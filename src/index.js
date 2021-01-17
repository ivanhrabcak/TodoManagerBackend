const express = require('express');
const cors = require('cors');

const app = express();

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://passwordmanager-ih.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'todo-manager',
  issuer: 'https://passwordmanager-ih.eu.auth0.com/',
  algorithms: ['RS256']
});

app.use(jwtCheck);
app.use(cors());
app.use(express.json());

const tasks = new Map();

var id = 1;

app.post('/tasks', (req, res,) => {
    console.log('POST /tasks');

    const username = req.user.sub;

    if (!tasks.has(username)) {
        tasks.set(username, new Map());
    }

    const taskId = ++id;

    const task = {...req.body, id: taskId, done: false };
    
    tasks.get(username).set(taskId, task);

    res.json({ ...task });
});

app.get('/tasks', (req, res,) => {
    console.log('GET /tasks');

    const username = req.user.sub;
    
    if (!tasks.has(username)) {
        tasks.set(username, new Map());
    }

    res.json([...tasks.get(req.user.sub).values()]);
});

app.post('/tasks/toggle/:taskId', (req, res) => {
    console.log(`POST /tasks/toggle/${req.params.taskId}`);
    
    const username = req.user.sub;

    const taskId = parseInt(req.params.taskId);
    if (tasks.get(username).has(taskId)) {
        const task = tasks.get(username).get(taskId);
        
        tasks.get(req.user.sub).set(taskId, {...task, done: !task.done });
        res.json(tasks.get(req.user.sub).get({ ...taskId}));
        
        return;
    }

    res.json(null);
});

app.delete('/tasks/:taskId', (req, res) => {
    console.log(`DELETE /tasks/${req.params.taskId}`);

    const username = req.user.sub;

    const taskId = parseInt(req.params.taskId);
    if (tasks.get(username).has(taskId)) {
        const task = tasks.get(taskId);
        
        tasks.get(username).delete(taskId);
        res.json({ ...task });
        
        return;
    }

    res.json(null);
});

app.put('/tasks/:taskId', (req, res) => {
    console.log(`PUT /tasks/${req.params.taskId}`);

    const username = req.user.sub;

    const taskId = parseInt(req.params.taskId);
    if (tasks.get(username).has(taskId)) {
        tasks.get(username).set(taskId, {...req.body, id: taskId});

        res.json({ ...tasks.get(username).get(taskId) });
    }
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Running server on http://localhost:${process.env.PORT || 8080}`);
});