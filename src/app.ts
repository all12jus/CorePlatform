// import express and create app instance with express() then export the app
global.models = {};


import * as express from 'express';
import Auth from "./routes/auth";

const app: express.Application = express();



// GET: / route
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('OK');
});

// GET: /api route
app.get('/api', (req: express.Request, res: express.Response) => {
    res.send('OK');
});

// GET: /test mogodb connection
app.get('/test', (req: express.Request, res: express.Response) => {
    res.send('OK');
});

// USE: /api/auth route
app.use('/api/auth', Auth);

// error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    // send this as JSON
    res.status(500).send({
        message: err.message,
    });

    // res.status(500).send('Something broke!');
});

export default app;