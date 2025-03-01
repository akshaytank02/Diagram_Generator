async function callAIAPI(endpoint, apiKey, model, prompt) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                inputs: `Generate a Mermaid.js diagram for: ${prompt}
                Rules:
                - Output only valid Mermaid.js code
                - No explanations or markdown backticks
                - Ensure proper syntax and indentation
                - Keep the diagram minimal and focused`,
                parameters: {
                    max_new_tokens: 2000,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            let errorMessage = `API request failed: (${response.status})`;
            
            if (response.status === 401) {
                errorMessage = "Invalid API key. Please check your API key and try again.";
            } else if (response.status === 403) {
                errorMessage = "Access forbidden. Please check your API key permissions.";
            } else if (errorData.error) {
                errorMessage += ` - ${errorData.error}`;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return Array.isArray(data) ? data[0].generated_text.trim() : data.generated_text.trim();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

async function generateMermaidWithAI() {
    const promptInput = document.getElementById('promptInput');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorDisplay = document.getElementById('errorDisplay');
    
    try {
        loadingSpinner.style.display = 'block';
        errorDisplay.textContent = '';
        
        const endpoint = document.getElementById('apiEndpoint').value;
        const apiKey = document.getElementById('apiKey').value;
        const model = document.getElementById('modelInput').value;
        
        let mermaidCode = await callAIAPI(endpoint, apiKey, model, promptInput.value);
        mermaidCode = cleanupMermaidSyntax(mermaidCode);
        
        if (!validateMermaidCode(mermaidCode)) {
            throw new Error('Generated diagram contains invalid Mermaid.js syntax');
        }
        
        displayMermaidCode(mermaidCode);
        addToHistory(promptInput.value, mermaidCode);
        
    } catch (error) {
        errorDisplay.textContent = `Error: ${error.message}`;
        generateFallbackDiagram(promptInput.value, 'flowchart');
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function generateFallbackDiagram(prompt, type) {
    const fallbackCode = `graph TD
    A[Error Generating Diagram] --> B[Please check:]
    B --> C[API Key]
    B --> D[API Endpoint]
    B --> E[Internet Connection]`;
    
    displayMermaidCode(fallbackCode);
}

function validateMermaidCode(code) {
    try {
        // Try to parse the code using mermaid's parse function
        mermaid.parse(code);
        return true;
    } catch (error) {
        console.error('Mermaid validation error:', error);
        return false;
    }
}

function displayMermaidCode(code) {
    const codeElement = document.getElementById('mermaidCode');
    const outputElement = document.getElementById('mermaidOutput');
    
    codeElement.textContent = code;
    outputElement.innerHTML = '';
    
    if (!validateMermaidCode(code)) {
        outputElement.innerHTML = `<div class="error">Invalid Mermaid.js syntax. Please check the diagram code.</div>`;
        return;
    }
    
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

function cleanupMermaidSyntax(code) {
    return code
        .replace(/```mermaid/g, '')
        .replace(/```/g, '')
        .replace(/^\s+|\s+$/g, '')  // Trim whitespace
        .replace(/[\u200B-\u200D\uFEFF]/g, '');  // Remove zero-width spaces
} 