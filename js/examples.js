// Example-related functions
function loadExample(exampleType) {
    const examples = {
        flowchart: {
            prompt: "Create a flowchart showing a user login process with password validation",
            code: `graph TD
    A[Start] --> B[Enter Username]
    B --> C[Enter Password]
    C --> D{Valid Credentials?}
    D -->|Yes| E[Login Success]
    D -->|No| F[Show Error]
    F --> B`
        },
        sequence: {
            prompt: "Create a sequence diagram showing an e-commerce checkout process",
            code: `sequenceDiagram
    Customer->>Cart: Add Items
    Cart->>Checkout: Process Order
    Checkout->>Payment: Validate Payment
    Payment-->>Checkout: Payment Confirmed
    Checkout-->>Customer: Order Confirmation`
        },
        classDiagram: {
            prompt: "Create a class diagram for a library management system",
            code: `classDiagram
    class Book {
        +title: string
        +author: string
        +ISBN: string
        +checkOut()
        +returnBook()
    }
    class Member {
        +name: string
        +id: number
        +borrowBook()
    }
    Book -- Member`
        },
        stateDiagram: {
            prompt: "Create a state diagram for a traffic light system",
            code: `stateDiagram
    [*] --> Red
    Red --> Green
    Green --> Yellow
    Yellow --> Red`
        },
        erDiagram: {
            prompt: "Create an entity relationship diagram for a social media platform",
            code: `erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : has`
        },
        gantt: {
            prompt: "Create a Gantt chart for a software development project",
            code: `gantt
    title Software Development Project
    Planning :a1, 2024-01-01, 30d
    Design :a2, after a1, 45d
    Development :a3, after a2, 90d`
        },
        pie: {
            prompt: "Create a pie chart showing market share of top 5 tech companies",
            code: `pie
    title Market Share
    "Company A" : 30
    "Company B" : 25
    "Company C" : 20
    "Company D" : 15
    "Company E" : 10`
        },
        mindmap: {
            prompt: "Create a mindmap for project planning phases",
            code: `mindmap
    root((Project))
        Planning
            Requirements
            Timeline
            Budget
        Execution
            Development
            Testing
        Delivery
            Deploy
            Review`
        }
    };

    const example = examples[exampleType];
    if (example) {
        const promptInput = document.getElementById('promptInput');
        promptInput.value = example.prompt;
        displayMermaidCode(example.code);
        addToHistory(example.prompt, example.code);
    }
} 