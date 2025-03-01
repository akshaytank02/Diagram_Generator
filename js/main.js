// Initialize Mermaid and set up event listeners
mermaid.initialize({ 
    startOnLoad: true,
    theme: 'default',
    flowchart: { curve: 'basis' }
});

// Load saved settings and history on page load
window.addEventListener('DOMContentLoaded', () => {
    // Load saved API settings
    const defaultEndpoint = "https://api.openai.com/v1/chat/completions";
    const defaultModel = "gpt-3.5-turbo";
    const defaultApiKey = "sk-proj-0123456789abcdef0123456789abcdef";

    
    const savedEndpoint = localStorage.getItem('apiEndpoint') || defaultEndpoint;
    const savedModel = localStorage.getItem('modelName') || defaultModel;
    const savedApiKey = localStorage.getItem('apiKey') || defaultApiKey;
    
    document.getElementById('apiEndpoint').value = savedEndpoint;
    document.getElementById('modelInput').value = savedModel;
    document.getElementById('apiKey').value = savedApiKey;
    
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