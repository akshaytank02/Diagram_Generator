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