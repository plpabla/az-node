const http = require('http');
const util = require('util');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

// Note: for Node we must use 0.0.0.0 if we want to run it in a container
// https://medium.com/@marcmintel/development-setup-with-nuxt-node-and-docker-b008a241c11d#fb37
const host = '0.0.0.0';
const port = process.env.PORT || 6900;
const messages = [];

// mognodb settings
const mongoUrl = process.env.MONGODB_URI || "mongodb://root:example@0.0.0.0?writeConcern=majority"
const client = new MongoClient(mongoUrl);
const dbName = 'test';

exports.server = http.createServer((req,res)=>{
    if(req.method == "POST" && req.url == "/messages/create.json") {
        exports.addMessage(req, res);
    } else if (req.method == "GET" && req.url == "/messages/list.json") {
        exports.displayMessages(req, res);
    } else {
        createDefaultView(req, res);
    }
}).listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}/`)
});


function createDefaultView(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Supported endpoints:\nmessages/create.json (POST)\nmessages/list.json (GET)\n");
}

exports.displayMessages = async function(req, res) {
    getMessagesFromDB()
    .then((messages) => {
        const body = JSON.stringify(messages);
        res.writeHead(200, {"Content-Type": "text/plain", "Content-Length": body.length});
        res.end(body);
    })
    .catch(console.error)
    .finally(() => client.close());
}

async function getMessagesFromDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('MsgBrdTest');
  
    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);
  
    return findResult;
  }

exports.addMessage = async function(req, res) {
    let message = '';
    req.on('data', async function(data, msg) {
        let dataStr = data.toString('utf-8');
        console.log(dataStr);
        message = await saveMessageInDB(querystring.parse(dataStr));
    });

    req.on('end', function() {
        console.log("message", util.inspect(message, true, null));
        console.log("messages", util.inspect(messages, true, null));
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end(message);
    })
}

async function saveMessageInDB(txt) {
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    const collection = db.collection('MsgBrdTest')
  
    const insertResult = await collection.insertOne(txt)
    console.log("inserted => ", insertResult)
}