const port = 1024;
const WebSocket = require("ws");
const LinkedList = require("./linked-list");

//Linked list to keep track of port numbers
const portList = new LinkedList();
//A map from game code to web socket for keeping track of all game worlds
const gameWorlds = new Map();
//A web socket for handling game world logistics with all clients
const wss = new WebSocket.Server({port: port}, () => {
    console.log(`Server socket listening on port ${port}`);
});

/****************Initialize linked list of port numbers********************/
const minPort = 1025;
const maxPort = 65535;

for(let p = minPort; p <= maxPort; p++) {
    portList.addToFront(p);
}
/***************End of port initialization **************************/

//Set a callback to handle a client connecting to the websocket
wss.on('connection', (ws) => {handleConnection(ws);});

//This function handles a successful connection between a client and the server
function handleConnection(ws) {
    console.log("client is connected");
    ws.on('message', (message) => {handleMessage(ws, message);});
}

//This function hanles a message from a connected client
function handleMessage(ws, message) {
    let msg = JSON.parse(message);
    let result = {};

    console.log("received: %s", message);

    switch(msg.type) {
        case "CREATE":
            result = createGame();
            break;
        default:
            result = {status: "FAILURE"};
            break;

    };

    ws.send(JSON.stringify(result));
}

//This function creates a new game world and returns an
//object containing the relevant info about the game world
function createGame() {
    let gameCode = generateGameCode();
    let portNumber = null;

    if(portList.size != 0) {
        portNumber = portList.removeFromFront();
        let newWss = new WebSocket.Server({port: portNumber}, () => {
            console.log(`Created web socket server for game world with code ${gameCode} on port ${portNumber}`);
        });
    
        gameWorlds.set(gameCode, newWss);

        newWss.on('connection', (ws) => {
            console.log(`Player connected to game world with game code ${gameCode}`);
            ws.on('message')
        });
    
        return {status: "SUCCESS", type: "CREATE", gameCode: gameCode, port: portNumber};
    }
}

//This function generates a unique game code
function generateGameCode() {
    return Date.now();
}
