// History-related functions
let diagramHistory = [];

function addToHistory(prompt, code) {
    const newItem = {
        prompt,
        code,
        timestamp: new Date().toISOString()
    };

    // Add to beginning of array
    diagramHistory.unshift(newItem);

    // Keep only last 10 items
    if (diagramHistory.length > 10) {
        diagramHistory.pop();
    }

    // Save to localStorage
    localStorage.setItem('diagramHistory', JSON.stringify(diagramHistory));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    
    historyContainer.innerHTML = '';
    
    diagramHistory.forEach((item) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleTimeString();
        const promptPreview = item.prompt.length > 50 
            ? item.prompt.substring(0, 47) + '...' 
            : item.prompt;
        
        historyItem.innerHTML = `
            <strong>Prompt:</strong> ${promptPreview}<br>
            <small>Generated at ${timeStr}</small>
        `;
        
        historyItem.addEventListener('click', () => {
            document.getElementById('promptInput').value = item.prompt;
            displayMermaidCode(item.code);
            // Switch to prompt tab
            switchTab('prompt');
        });
        
        historyContainer.appendChild(historyItem);
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        diagramHistory = [];
        localStorage.removeItem('diagramHistory');
        updateHistoryDisplay();
    }
}

// Load history on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedHistory = localStorage.getItem('diagramHistory');
    if (savedHistory) {
        try {
            diagramHistory = JSON.parse(savedHistory);
            updateHistoryDisplay();
        } catch (e) {
            console.error('Error loading history:', e);
            diagramHistory = [];
        }
    }
}); 