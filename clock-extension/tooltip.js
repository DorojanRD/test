let tooltipElement = null;
let tooltipTimer = null;
let isExtensionHovered = false;

function createTooltip() {
    if (tooltipElement) return;
    
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'clock-tooltip';
    tooltipElement.innerHTML = `
        <div class="time">--:--:--</div>
        <div class="date">-- --- ----</div>
    `;
    document.body.appendChild(tooltipElement);
}

function updateTooltip() {
    if (!tooltipElement) return;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateStr = now.toLocaleDateString('ro-RO', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
    
    tooltipElement.querySelector('.time').textContent = timeStr;
    tooltipElement.querySelector('.date').textContent = dateStr;
}

function showTooltip() {
    createTooltip();
    updateTooltip();
    tooltipElement.classList.add('show');
    
    // Actualizează tooltip-ul la fiecare secundă
    if (tooltipTimer) clearInterval(tooltipTimer);
    tooltipTimer = setInterval(updateTooltip, 1000);
}

function hideTooltip() {
    if (tooltipElement) {
        tooltipElement.classList.remove('show');
    }
    if (tooltipTimer) {
        clearInterval(tooltipTimer);
        tooltipTimer = null;
    }
}

// Găsește butonul extensiei în toolbar
function findExtensionButton() {
    // Caută în diferite locații posibile pentru butonul extensiei
    const selectors = [
        'button[aria-label*="Clock"], button[aria-label*="Ceas"]',
        'button[title*="Clock"], button[title*="Ceas"]',
        '.extensions-toolbar button',
        '[data-extension-id] button'
    ];
    
    for (const selector of selectors) {
        const buttons = document.querySelectorAll(selector);
        for (const button of buttons) {
            if (button.getAttribute('aria-label')?.includes('Clock') ||
                button.getAttribute('aria-label')?.includes('Ceas') ||
                button.getAttribute('title')?.includes('Clock') ||
                button.getAttribute('title')?.includes('Ceas')) {
                return button;
            }
        }
    }
    
    return null;
}

// Observer pentru a detecta când se adaugă butonul extensiei
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const extensionButton = findExtensionButton();
            if (extensionButton && !extensionButton.hasAttribute('data-tooltip-added')) {
                extensionButton.setAttribute('data-tooltip-added', 'true');
                
                extensionButton.addEventListener('mouseenter', () => {
                    isExtensionHovered = true;
                    setTimeout(() => {
                        if (isExtensionHovered) {
                            showTooltip();
                        }
                    }, 500); // Delay de 500ms
                });
                
                extensionButton.addEventListener('mouseleave', () => {
                    isExtensionHovered = false;
                    setTimeout(() => {
                        if (!isExtensionHovered) {
                            hideTooltip();
                        }
                    }, 100);
                });
            }
        }
    });
});

// Începe observarea
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Încearcă să găsească butonul imediat (pentru cazul în care există deja)
setTimeout(() => {
    const extensionButton = findExtensionButton();
    if (extensionButton && !extensionButton.hasAttribute('data-tooltip-added')) {
        extensionButton.setAttribute('data-tooltip-added', 'true');
        
        extensionButton.addEventListener('mouseenter', () => {
            isExtensionHovered = true;
            setTimeout(() => {
                if (isExtensionHovered) {
                    showTooltip();
                }
            }, 500);
        });
        
        extensionButton.addEventListener('mouseleave', () => {
            isExtensionHovered = false;
            setTimeout(() => {
                if (!isExtensionHovered) {
                    hideTooltip();
                }
            }, 100);
        });
    }
}, 2000);