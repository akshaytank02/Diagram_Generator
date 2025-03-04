// UI-related functions
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const containers = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        }
    });
    
    containers.forEach(container => {
        container.style.display = 'none';
        if (container.getAttribute('data-tab') === tabName) {
            container.style.display = 'block';
        }
    });
}

function toggleAPISettings() {
    const settingsPanel = document.getElementById('apiSettings');
    const isVisible = settingsPanel.style.display !== 'none';
    settingsPanel.style.display = isVisible ? 'none' : 'block';
}

function copyCode() {
    const codeElement = document.getElementById('mermaidCode');
    navigator.clipboard.writeText(codeElement.textContent)
        .then(() => {
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy code:', err);
        });
}

function displayMermaidCode(code) {
    const codeElement = document.getElementById('mermaidCode');
    const outputElement = document.getElementById('mermaidOutput');
    
    codeElement.textContent = code;
    outputElement.innerHTML = '';
    
    try {
        mermaid.render('mermaid-diagram', code)
            .then(result => {
                outputElement.innerHTML = result.svg;
            })
            .catch(error => {
                outputElement.innerHTML = `<div class="error">Error rendering diagram: ${error.message}</div>`;
            });
    } catch (error) {
        outputElement.innerHTML = `<div class="error">Error rendering diagram: ${error.message}</div>`;
    }
}

function saveAPIConfiguration() {
    const endpoint = document.getElementById('apiEndpoint').value;
    const apiKey = document.getElementById('apiKey').value;
    const modelName = document.getElementById('modelInput').value;
    
    // Validate inputs
    if (!endpoint || !apiKey || !modelName) {
        alert('Please fill in all API configuration fields');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('apiEndpoint', endpoint);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('modelName', modelName);
    
    // Visual feedback
    const saveButton = document.getElementById('saveApiSettings');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Saved!';
    setTimeout(() => {
        saveButton.textContent = originalText;
        toggleAPISettings(); // Close the settings panel
    }, 1500);
}

// Add event listeners for tabs
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                if (content.getAttribute('data-tab') === tabName) {
                    content.style.display = 'block';
                    // Trigger animation
                    setTimeout(() => content.style.opacity = '1', 10);
                } else {
                    content.style.opacity = '0';
                    setTimeout(() => content.style.display = 'none', 200);
                }
            });
        });
    });

    // Initialize textarea auto-resize
    const promptInput = document.getElementById('promptInput');
    if (promptInput) {
        promptInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    // Copy button functionality
    window.copyCode = function() {
        const codeElement = document.getElementById('mermaidCode');
        const copyBtn = document.querySelector('.copy-btn');
        
        if (codeElement) {
            navigator.clipboard.writeText(codeElement.textContent).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.classList.add('text-green-600');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy Code';
                    copyBtn.classList.remove('text-green-600');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                copyBtn.textContent = 'Failed to copy';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy Code';
                }, 2000);
            });
        }
    };

    // Generate button loading state
    const generateBtn = document.getElementById('generateBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    if (generateBtn && loadingSpinner) {
        generateBtn.addEventListener('click', function() {
            this.disabled = true;
            this.classList.add('opacity-50', 'cursor-not-allowed');
            loadingSpinner.classList.remove('hidden');
            
            // This timeout is just for demonstration
            // In reality, this would be handled by your API call
            setTimeout(() => {
                this.disabled = false;
                this.classList.remove('opacity-50', 'cursor-not-allowed');
                loadingSpinner.classList.add('hidden');
            }, 2000);
        });
    }

    // Error display handling
    window.showError = function(message) {
        const errorDisplay = document.getElementById('errorDisplay');
        if (errorDisplay) {
            errorDisplay.textContent = message;
            errorDisplay.style.display = 'block';
            setTimeout(() => {
                errorDisplay.style.opacity = '1';
            }, 10);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorDisplay.style.opacity = '0';
                setTimeout(() => {
                    errorDisplay.style.display = 'none';
                    errorDisplay.textContent = '';
                }, 200);
            }, 5000);
        }
    };

    // History item template
    window.createHistoryItem = function(prompt, code, timestamp) {
        return `
            <div class="history-item">
                <div class="flex justify-between items-start mb-2">
                    <div class="font-medium text-gray-800">${prompt}</div>
                    <span class="timestamp">${timestamp}</span>
                </div>
                <pre class="text-sm bg-gray-50 p-2 rounded mt-2">${code}</pre>
            </div>
        `;
    };

    // Example item click animation
    const exampleItems = document.querySelectorAll('.example-item');
    exampleItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.add('scale-95');
            setTimeout(() => {
                this.classList.remove('scale-95');
            }, 200);
        });
    });
}); 