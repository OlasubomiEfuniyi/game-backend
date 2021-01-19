const port = 8080;
const WebSocket = require("ws");

const ws = new WebSocket.Server({port: port}, () => {
    console.log(`Server socket listening on port ${port}`);
});


//Set a callback to handle a client connecting to the websocket
ws.on('connection', (ws) => {handleConnection(ws);});

//This function handles a successful connection between a client and the server
function handleConnection(ws) {
    console.log("client is connected");
    ws.on('message', (message) => {handleMessage(message);});
}

//This function hanles a message from a connected client
function handleMessage(message) {
    console.log("received: %s", message);
}

