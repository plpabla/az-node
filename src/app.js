const http = require('http');
const util = require('util');
const querystring = require('querystring');

// Note: for Node we must use 0.0.0.0 if we want to run it in a container
// https://medium.com/@marcmintel/development-setup-with-nuxt-node-and-docker-b008a241c11d#fb37
const host = '0.0.0.0';
const port = process.env.PORT || 6900;
const messages = [];

exports.server = http.createServer((req,res)=>{
    if(req.method == "POST" && req.url == "/messages/create.json") {
        createMessage(req, res);
    } else if (req.method == "GET" && req.url == "/messages/list.json") {
        displayMessages(req, res);
    } else {
        createDefaultView(req, res);
    }
}).listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}/`);
});

function createMessage(req, res) {
    let message = '';
    req.on('data', function(data, msg) {
        let dataStr = data.toString('utf-8');
        console.log(dataStr);
        message = exports.addMessage(dataStr);
    });
    req.on('end', function() {
        console.log("message", util.inspect(message, true, null));
        console.log("messages", util.inspect(messages, true, null));
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end(message);
    })
}

function displayMessages(req, res) {
    const body = exports.getMessages();
    res.writeHead(200, {"Content-Type": "text/plain", "Content-Length": body.length});
    res.end(body);
}

function createDefaultView(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Supported endpoints:\nmessages/create.json (POST)\nmessages/list.json (GET)\n");
}

exports.getMessages = function() {
    return JSON.stringify(messages);
}

exports.addMessage = function(txt) {
    let data = querystring.parse(txt);
    messages.push(data);
    return JSON.stringify(data);
}