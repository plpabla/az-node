const http = require('node:http');
// Note: for Node we must use 0.0.0.0
// https://medium.com/@marcmintel/development-setup-with-nuxt-node-and-docker-b008a241c11d#fb37
const host = '0.0.0.0';
const port = process.env.PORT || 6900;

const server = http.createServer((req,res)=>{
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("Hello, world (from Node container, yay!)\nAzure container, yay! #PARTY\nCD enabled (webhook working but only after manual reset)\nMaybe now will be better?\n");
});

server.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}/`);
});