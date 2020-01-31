const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>')
    res.write('<head><title>My Node Title</title></head>')
    res.write('<body><h1>My Node Server</h1></body>')
    res.write('</html>')
    res.end() // After this you cannot send any further response
    // res.write() // this will result in error
})

server.listen(3000);