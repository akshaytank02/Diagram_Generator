// Initialize Mermaid and set up event listeners
mermaid.initialize({ 
    startOnLoad: true,
    theme: 'default',
    flowchart: { curve: 'basis' }
});

// Set up event listeners on page load
window.addEventListener('DOMContentLoaded', () => {
    // Load saved history
    const savedHistory = localStorage.getItem('diagramHistory');
    if (savedHistory) {
        diagramHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
    
    // Set up event listeners
    document.getElementById('generateBtn').addEventListener('click', generateMermaidWithAI);
    document.getElementById('promptInput').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateMermaidWithAI();
        }
    });
}); 