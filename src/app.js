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



    


const HTML_PRE='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>BiedaTweeter</title></head><body>'
const HTML_POST='</body></html>'

function createDefaultView(req, res) {
    getMessagesFromDB()
    .then((messages) => {
        body = ""
        messages.forEach((m)=>{
            body+=m.name+": "+m.message+"<br>"
        })
        res.writeHead(200, {"Content-Type": "text/html"})
        res.end(HTML_PRE
            +"Supported endpoints:<br>messages/create.json (POST)<br>messages/list.json (GET)<br><hr>"
            +body
            +HTML_POST)
    })
    .catch()
    .finally()
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
    const db = client.db(dbName);
    const collection = db.collection('MsgBrdTest');
  
    const findResult = await collection.find({}).toArray();
  
    return findResult;
  }

exports.addMessage = async function(req, res) {
    let message = '';
    req.on('data', async function(data, msg) {
        let dataStr = data.toString('utf-8');
        message = await saveMessageInDB(querystring.parse(dataStr));
    });

    req.on('end', function() {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end(message);
    })
}

async function saveMessageInDB(txt) {
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection('MsgBrdTest')
  
    const insertResult = await collection.insertOne(txt)
}