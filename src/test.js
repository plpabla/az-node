const http = require('http');
const assert = require('assert');
const querystring = require('querystring');
const util = require('util');

const app = require('./app');

assert.deepEqual(app.getMessages(),
                '[]', 
                "Initially no messages should be present");

assert.deepEqual(JSON.parse(app.addMessage("name=John%20Doe&message=example")),
                JSON.parse('{"name":"John Doe", "message":"example"}'),  
                "Adding message should return JSON");

assert.deepEqual(JSON.parse(app.getMessages()),
                JSON.parse('[{"name":"John Doe", "message":"example"}]'), 
                "Message should be returned");

app.addMessage("name=John%20Doe2&message=another")
assert.deepEqual(JSON.parse(app.getMessages()), 
                JSON.parse('[{"name":"John Doe", "message":"example"}, {"name":"John Doe2", "message":"another"}]'), 
                "Two messages should be returned");