// History-related functions
let diagramHistory = [];

function addToHistory(prompt, code) {
    diagramHistory.unshift({ prompt, code, timestamp: new Date().toISOString() });
    if (diagramHistory.length > 10) {
        diagramHistory.pop();
    }
    localStorage.setItem('diagramHistory', JSON.stringify(diagramHistory));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    
    historyContainer.innerHTML = '';
    
    diagramHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.onclick = () => loadFromHistory(item);
        
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleTimeString();
        
        historyItem.innerHTML = `
            <strong>Prompt:</strong> ${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}<br>
            <small>Generated at ${timeStr}</small>
        `;
        
        historyContainer.appendChild(historyItem);
    });
}

function loadFromHistory(item) {
    document.getElementById('promptInput').value = item.prompt;
    displayMermaidCode(item.code);
}

function clearHistory() {
    diagramHistory = [];
    localStorage.removeItem('diagramHistory');
    updateHistoryDisplay();
} 