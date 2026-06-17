document.addEventListener('DOMContentLoaded', async () => {
    // Apply Theme
    if (typeof browser !== 'undefined' && browser.storage) {
        const themeResult = await browser.storage.local.get(['cmTheme']);
        if (themeResult.cmTheme === 'light') {
            document.body.classList.add('light-mode');
        }
    }

    // Task 1: Master toggle
    const masterToggle = document.getElementById('master-toggle');

    // Attempt to load actual settings if Anti Fingerprinting APIs are exposed
    if (typeof browser !== 'undefined' && browser.storage) {
        try {
            const result = await browser.storage.local.get('blockMode');
            if (result.blockMode !== undefined && result.blockMode !== 'allowEverything') {
                masterToggle.checked = true;
            } else if (result.blockMode === 'allowEverything') {
                masterToggle.checked = false;
            }
        } catch(e) {
            // Fallback
        }
    }

    masterToggle.addEventListener('change', (e) => {
        const isOn = e.target.checked;
        // Dispatch to background script
        if (typeof browser !== 'undefined' && browser.storage) {
            try {
                // Fetch the default or last known good mode to restore if toggled ON. For now, 'fake' is safe.
                browser.storage.local.set({ blockMode: isOn ? 'fake' : 'allowEverything' });
            } catch(err) {}
        }
    });

    // Task 2: Clear Data Button
    const clearBtn = document.getElementById('clear-data-btn');
    const clearFeedback = document.getElementById('clear-feedback');
    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            const api = (typeof browser !== 'undefined' && browser.browsingData) ? browser : 
                        (typeof chrome !== 'undefined' && chrome.browsingData) ? chrome : null;
                        
            if (api && api.browsingData) {
                try {
                    api.browsingData.remove({since: 0}, {
                        "cookies": true,
                        "localStorage": true,
                        "cache": true
                    }, function() {
                        // Show success feedback
                        clearBtn.style.display = 'none';
                        clearFeedback.style.display = 'block';
                        
                        setTimeout(() => {
                            clearFeedback.style.display = 'none';
                            clearBtn.style.display = 'block';
                        }, 2000);
                    });
                } catch(e) {
                    console.error("Failed to clear data:", e);
                }
            } else {
                console.error("browsingData API not available.");
            }
        });
    }

    // Task 3: Download WARP
    const warpBtn = document.getElementById('warp-btn');
    if (warpBtn) {
        warpBtn.addEventListener('click', () => {
            window.open('https://1.1.1.1/', '_blank');
        });
    }
});
