const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const tasks = new Map();
tasks.set(1, {
    name: 'Sample Task 1',
    description: 'Sample description 1',
    done: false,
    id: 1
});

tasks.set(2, {
    name: 'Finished task',
    description: 'This task is finished',
    done: true,
    id: 2
});

var id = 3;

app.post('/tasks', (req, res,) => {
    console.log('POST /tasks');

    const taskId = ++id;

    const task = { ...req.body, id: taskId, done: false };
    tasks.set(taskId, task);

    res.json({ ...task });
});

app.get('/tasks', (req, res,) => {
    console.log('GET /tasks');


    res.json([...tasks.values()]);
});

app.post('/tasks/toggle/:taskId', (req, res) => {
    console.log(`POST /tasks/toggle/${req.params.taskId}`);
    
    const taskId = parseInt(req.params.taskId);
    if (tasks.has(taskId)) {
        const task = tasks.get(taskId);
        
        tasks.set(taskId, {...task, done: !task.done });
        res.json(tasks.get({ ...taskId}));
        
        return;
    }

    res.json(null);
});

app.delete('/tasks/:taskId', (req, res) => {
    console.log(`DELETE /tasks/${req.params.taskId}`);

    const taskId = parseInt(req.params.taskId);
    if (tasks.has(taskId)) {
        const task = tasks.get(taskId);
        
        tasks.delete(taskId);
        res.json({ ...task });
        
        return;
    }

    res.json(null);
});

app.put('/tasks/:taskId', (req, res) => {
    console.log(`PUT /tasks/${req.params.taskId}`);

    const taskId = parseInt(req.params.taskId);
    if (tasks.has(taskId)) {
        tasks.set(taskId, {...req.body, id: taskId});

        res.json({ ...tasks.get(taskId) });
    }
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Running server on http://localhost:${process.env.PORT || 8080}`);
});