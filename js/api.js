async function callAIAPI(prompt) {
    const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const GEMINI_API_KEY = 'AIzaSyClSGiiwX26VZrOq32cwEUan1cI0YmVVxc';

    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API request timed out after 30 seconds')), 30000)
    );

    try {
        const fetchPromise = fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: {
                    role: "user",
                    parts: [{ text: `Generate a simple Mermaid.js diagram for: ${prompt}
                        Important Rules:
                        - Start with exactly one of these: graph TD, graph LR, sequenceDiagram, classDiagram, stateDiagram, erDiagram, gantt, pie, mindmap
                        - Use only basic Mermaid.js syntax
                        - For flowcharts, use only --> for connections
                        - Keep node names simple and alphanumeric
                        - No special characters except underscore
                        - Output ONLY the diagram code
                        - No explanations or comments
                        - No markdown backticks
                        Example format for flowchart:
                        graph TD
                            A[Start] --> B[Process]
                            B --> C[End]`
                    }]
                }
            })
        });

        const response = await Promise.race([fetchPromise, timeout]);

        if (!response.ok) {
            throw new Error(`API request failed (${response.status})`);
        }

        const data = await response.json();
        let mermaidCode = data.candidates[0].content.parts[0].text;
        
        // Clean up the response
        mermaidCode = mermaidCode
            .trim()
            .replace(/```(?:mermaid)?\n?/g, '')
            .replace(/```/g, '')
            .replace(/[\u2013\u2014\u2015\u2212]/g, '-') // Replace various dash types with simple hyphen
            .replace(/[^\x20-\x7E\n]/g, '') // Remove non-ASCII characters
            .trim();

        // Validate diagram type
        const validStart = /^(graph [TBLR]D|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|mindmap)/;
        if (!validStart.test(mermaidCode)) {
            const type = prompt.toLowerCase().includes('sequence') ? 'sequenceDiagram' :
                        prompt.toLowerCase().includes('class') ? 'classDiagram' :
                        prompt.toLowerCase().includes('state') ? 'stateDiagram' :
                        prompt.toLowerCase().includes('er') ? 'erDiagram' :
                        prompt.toLowerCase().includes('gantt') ? 'gantt' :
                        prompt.toLowerCase().includes('pie') ? 'pie' :
                        prompt.toLowerCase().includes('mind') ? 'mindmap' :
                        'graph TD';
            
            mermaidCode = `${type}\n${mermaidCode}`;
        }

        // Basic syntax validation
        if (mermaidCode.includes('---')) {
            mermaidCode = mermaidCode.replace(/---/g, '-->');
        }

        // Ensure proper line breaks
        mermaidCode = mermaidCode.replace(/([A-Za-z0-9\]}"'])\s+(-->|==>|--)/g, '$1\n    $2');

        return mermaidCode;

    } catch (error) {
        console.error('API call error:', error);
        throw new Error(error.message || 'Failed to generate diagram');
    }
}

async function generateMermaidWithAI() {
    const promptInput = document.getElementById('promptInput');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorDisplay = document.getElementById('errorDisplay');
    
    try {
        loadingSpinner.style.display = 'block';
        errorDisplay.textContent = '';
        
        let mermaidCode = await callAIAPI(promptInput.value);
        mermaidCode = cleanupMermaidSyntax(mermaidCode);
        
        if (!validateMermaidCode(mermaidCode)) {
            throw new Error('Generated diagram contains invalid Mermaid.js syntax');
        }
        
        displayMermaidCode(mermaidCode);
        addToHistory(promptInput.value, mermaidCode);
        
    } catch (error) {
        errorDisplay.textContent = `Error: ${error.message}`;
        generateFallbackDiagram(promptInput.value);
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