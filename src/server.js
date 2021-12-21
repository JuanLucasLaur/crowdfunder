const next = require('next');
const { createServer } = require('http');
const routes = require('./routes');

const PORT = 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(PORT, (error) => {
        if (error) {
            throw error;
        }
        console.log('Ready on localhost:3000');
    });
});
