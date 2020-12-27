const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const tasks = [
    { name: 'Sample Task 1', description: 'Sample description 1', id: 1, done: false },
    { name: 'Finished Task', description: 'This task is finished', id: 2, done: true},
];

var id = 3;

app.post('/tasks/create', (req, res,) => {
    console.log("/tasks/create");

    const task = { ...req.body, id: ++id, done: false };
    tasks.push(task);

    res.json(task);
});

app.get('/tasks', (req, res,) => {
    console.log("/tasks");

    return res.json(tasks);
});

app.post('/tasks/toggle/:taskId', (req, res,) => {
    console.log(`/tasks/toggle/${req.params.taskId}`);

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == req.params.taskId) {
            tasks[i].done = !tasks[i].done;
            res.json(tasks[i]);
            return;
        }
    }

    res.json(null);
});

app.post('/tasks/delete/:taskId', (req, res,) => {
    console.log(`/tasks/delete/${req.params.taskId}`);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == req.params.taskId) {
            tasks.splice(i, 1);
            res.json(tasks);
            return;
        }
    }
    res.json(null);
});

app.post('/tasks/update/:taskId', (req, res,) => {
    console.log(`/tasks/update/${req.params.taskId}`);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == req.params.taskId) {
            tasks[i] = { ...req.body, id: tasks[i].id };
            res.json(tasks[i]);
            return;
        }
    }
    res.json(null);
});

app.listen(8080, () => {
    console.log('Running server on http://localhost:8080');
});