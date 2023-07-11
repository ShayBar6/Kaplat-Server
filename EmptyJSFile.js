const express = require('express');
const app = express();
const port = 8496;
const TODOcounter = 0;
const todos = [];
const result = "";
const errorMessage = "";


// Health endpoint
app.get('/todo/health', (req, res) => {
    res.status = 200;
    const response = {
        result: "OK",
        errorMessage: null,
    };

});

app.post('/todo', (req, res) => {
    const { title, content, dueDate } = req.body;
    
    // Check if TODO with the same title already exists
    const existingTodo = todos.find((todo) => todo.title === title);
    if (existingTodo) {
        errorMessage = `Error: TODO with the title [${title}] already exists in the system`;
        res.status(409).json({ result, errorMessage });
        return;
    }

    // Check if dueDate is in the future
    const currentDate = Date.now();
    if (dueDate <= currentDate) {
        errorMessage = 'Error: Can’t create new TODO with a due date in the past';
        res.status(409).json({ result, errorMessage });
        return;
    }

    // Create new TODO item
    const newTodo = {
        id: TODOcounter + 1, // Assign a unique ID
        title,
        content,
        dueDate,
        status: 'PENDING',
    };

    todos.push(newTodo);

    res.status(200).json({ result: newTodo.id, errorMessage });
});

app.get('/todo/size', (req, res) => {
    const { status } = req.query;
    const validStatusOptions = ['ALL', 'PENDING', 'LATE', 'DONE'];
    if (!validStatusOptions.includes(status)) {
        res.status(400).json({ errorMessage: 'Bad Request: Invalid status parameter.' });
        return;
    }

    // Filter TODOs based on status
    let filteredTodos = todos;
    if (status !== 'ALL') {
        filteredTodos = todos.filter((todo) => todo.status === status);
    }

    // Send the count of TODOs based on the filtered list
    const todosCount = filteredTodos.length;
    res.status(200).json({ result: todosCount }, errorMessage);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
