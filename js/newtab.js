// Utility function to escape HTML and prevent XSS
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('shortcut-grid');
    const saveBtn = document.getElementById('save-current-btn');
    const searchInput = document.getElementById('search-input');
    const addLinkBtn = document.getElementById('add-link-btn');

    let allLinks = [];

    // Modal Elements
    const modal = document.getElementById('link-modal');
    const modalTitle = document.getElementById('modal-title');
    const nameInput = document.getElementById('link-name');
    const urlInput = document.getElementById('link-url');
    const idInput = document.getElementById('link-id');
    const cancelBtn = document.getElementById('modal-cancel');
    const saveModalBtn = document.getElementById('modal-save');

    loadData();

    // --- 1. CORE DATA LOGIC ---
    function loadData() {
        chrome.storage.local.get(['hyperlinks'], (result) => {
            allLinks = result.hyperlinks || [];
            renderGrid();
        });
    }

    function saveData() {
        chrome.storage.local.set({
            hyperlinks: allLinks
        });
    }

    // --- 2. MODAL LOGIC (OPEN, CLOSE, SAVE) ---
    function openAddModal() {
        modalTitle.textContent = "Add New Shortcut";
        nameInput.value = '';
        urlInput.value = '';
        idInput.value = '';
        modal.classList.remove('hidden');
        nameInput.focus();
    }

    function openEditModal(linkId) {
        const link = allLinks.find(l => l.id === linkId);
        if (link) {
            modalTitle.textContent = "Edit Shortcut";
            nameInput.value = link.name;
            urlInput.value = link.url;
            idInput.value = link.id;
            modal.classList.remove('hidden');
            nameInput.focus();
        }
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    addLinkBtn.addEventListener('click', openAddModal);
    cancelBtn.addEventListener('click', closeModal);

    saveModalBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        let url = urlInput.value.trim();

        if (!name || !url) return;
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

        if (idInput.value) {
            // UPDATE EXISTING LINK
            const index = allLinks.findIndex(l => l.id === idInput.value);
            if (index > -1) {
                allLinks[index].name = name;
                allLinks[index].url = url;
            }
        } else {
            // CREATE NEW LINK
            allLinks.push({
                id: Date.now().toString(),
                name: name,
                url: url
            });
        }

        saveData();
        renderGrid();
        closeModal();
    });

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- 3. LINK LOGIC ---
    saveBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs || !tabs[0]) return;

            const currentTab = tabs[0];
            // Only add "..." if title is actually longer than 15 chars
            const truncatedTitle = currentTab.title.length > 15
                ? currentTab.title.substring(0, 15) + "..."
                : currentTab.title;

            const newShortcut = {
                id: Date.now().toString(),
                name: truncatedTitle,
                url: currentTab.url
            };

            allLinks.push(newShortcut);
            saveData();
            renderGrid();

            // Visual feedback without breaking gradient
            saveBtn.classList.add('saved');
            saveBtn.textContent = "Saved!";
            setTimeout(() => {
                saveBtn.classList.remove('saved');
                saveBtn.textContent = "Save Current Page";
            }, 1500);
        });
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        renderGrid(query);
    });

    function deleteShortcut(id) {
        allLinks = allLinks.filter(l => l.id !== id);
        saveData();
        renderGrid(searchInput.value.toLowerCase());
    }

    function renderGrid(searchQuery = '') {
        grid.innerHTML = '';

        const linksToShow = allLinks.filter(link => {
            if (searchQuery) {
                return link.name.toLowerCase().includes(searchQuery) || link.url.toLowerCase().includes(searchQuery);
            }
            return true;
        });

        // Show empty state if no links
        if (linksToShow.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';

            if (searchQuery) {
                emptyState.innerHTML = `
                    <div class="empty-state-icon">🔍</div>
                    <div class="empty-state-text">
                        No links found for "<strong>${escapeHtml(searchQuery)}</strong>"
                    </div>
                `;
            } else {
                emptyState.innerHTML = `
                    <div class="empty-state-icon">📌</div>
                    <div class="empty-state-text">
                        No links yet<br>
                        Click <strong>+</strong> to add your first shortcut
                    </div>
                `;
            }
            grid.appendChild(emptyState);
            return;
        }

        linksToShow.forEach(link => {
            let domain = "google.com";
            try { domain = new URL(link.url).hostname; } catch(e) {}

            const iconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
            const safeName = escapeHtml(link.name);

            const shortcutEl = document.createElement('div');
            shortcutEl.className = 'shortcut-item';

            shortcutEl.innerHTML = `
                <div class="item-actions">
                    <button class="action-btn edit-btn" data-id="${link.id}" title="Edit">✎</button>
                    <button class="action-btn delete-btn" data-id="${link.id}" title="Delete">×</button>
                </div>
                <div class="icon-circle" title="${safeName}">
                    <img src="${iconUrl}" alt="icon" onerror="this.style.display='none'">
                </div>
                <span class="shortcut-title">${safeName}</span>
            `;

            shortcutEl.querySelector('.icon-circle').addEventListener('click', () => {
                chrome.tabs.create({ url: link.url });
            });

            shortcutEl.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(link.id);
            });

            shortcutEl.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteShortcut(link.id);
            });

            grid.appendChild(shortcutEl);
        });
    }

    // Keyboard support for modal
    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') urlInput.focus();
    });

    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveModalBtn.click();
        if (e.key === 'Escape') closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});