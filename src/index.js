const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const tasks = new Map();
tasks.set(1, {
    name: 'Sample Task 1',
    description: 'Sample description 1',
    done: false
});

tasks.set(2, {
    name: 'Finished task',
    description: 'This task is finished',
    done: true
});

var id = 3;

app.post('/tasks', (req, res,) => {
    console.log('POST /tasks');

    const taskId = ++id;

    const task = { ...req.body, done: false };
    tasks.set(taskId, task);

    res.json({ ...task, id: taskId } );
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
        res.json(tasks.get({ ...taskId, id: taskId }));
        
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
        res.json({ ...task, id: taskId });
        
        return;
    }

    res.json(null);
});

app.put('/tasks/:taskId', (req, res) => {
    console.log(`PUT /tasks/${req.params.taskId}`);

    const taskId = parseInt(req.params.taskId);
    if (tasks.has(taskId)) {
        tasks.set(taskId, {...req.body});

        res.json({ ...tasks.get(taskID), id: taskId });
    }
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Running server on http://localhost:${process.env.PORT || 8080}`);
});