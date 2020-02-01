const http = require('http');
const routes = require('./15UsingtheNodeModulesSystemRoutes')

const server = http.createServer(routes);

// const server = http.createServer(routes.handler);

server.listen(3000);