// Example-related functions
function loadExample(exampleType) {
    const examples = {
        flowchart: "Create a flowchart showing a user login process with password validation",
        sequence: "Create a sequence diagram showing an e-commerce checkout process",
        classDiagram: "Create a class diagram for a library management system",
        stateDiagram: "Create a state diagram for a traffic light system",
        erDiagram: "Create an entity relationship diagram for a social media platform",
        gantt: "Create a Gantt chart for a software development project",
        pie: "Create a pie chart showing market share of top 5 tech companies",
        mindmap: "Create a mindmap for project planning phases"
    };

    const promptInput = document.getElementById('promptInput');
    promptInput.value = examples[exampleType];
    generateMermaidWithAI();
} 