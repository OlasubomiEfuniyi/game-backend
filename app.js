const port = 1024;
const WebSocket = require("ws");
const LinkedList = require("./linked-list").LinkedList;

//Linked list to keep track of port numbers
const portList = new LinkedList();

//A map from game code to list of players
const codeToPlayers = new Map();
//A map from game code to port number
const codeToPort = new Map();


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


/********************************************* Overseer Functions ***********************************************/
//This function handles a successful connection between a client and the server
function handleConnection(ws) {
    console.log("client is connected");
    ws.on('message', (message) => {handleMessage(ws, message);});
}

//This function hanles a message from a connected client
function handleMessage(ws, message) {
    let msg = JSON.parse(message);

    console.log("received: %s", message);

    switch(msg.type) {
        case "CREATE":
            createGame(ws);
            break;
        case "PORT":
            getPort(ws, msg.gameCode);
            break;
        default:
            let result = {status: "FAILURE"};
            ws.send(JSON.stringify(result));
            break;
    };

}

//Return the port number associated with the game code provided
function getPort(ws, gameCode) {
    let gc = Number.parseInt(gameCode);
    let result =  {status: "SUCCESS", type: "PORT", port: codeToPort.get(gc)};
    console.log(codeToPort);
    console.log(gameCode);
    ws.send(JSON.stringify(result));
}

//This function creates a new game world and returns an
//object containing the relevant info about the game world
function createGame(ws) {
    let gameCode = generateGameCode();
    let portNumber = null;

    if(portList.size != 0) {
        portNumber = portList.removeFromFront();
        let newWss = new WebSocket.Server({port: portNumber}, () => {
            console.log(`Created web socket server for game world with code ${gameCode} on port ${portNumber}`);
            codeToPort.set(gameCode, portNumber);

            newWss.on('connection', (ws) => {
                console.log(`Player connected to game world with game code ${gameCode}`);
                ws.on('message', (message) => {handleGameWorldMessage(ws, gameCode, message)});
            });
        
            let result = {status: "SUCCESS", type: "CREATE", gameCode: gameCode, port: portNumber};
            ws.send(JSON.stringify(result));
        });
    }
}

//This function generates a unique game code
function generateGameCode() {
    return Date.now();
}


/**************************************************** Game World Functions *******************************************************/
//This function handles messages sent to game worlds
function handleGameWorldMessage(ws, gameCode, message) {
    let msg = JSON.parse(message);
    let result = {};
    let gc = Number.parseInt(gameCode);

    console.log(`received message: ${message}`);
    switch(msg.type) {
        case "CONNECT":
            if(codeToPlayers.has(gc)) {
                codeToPlayers.get(gc).push(msg.name);
            } else {
                codeToPlayers.set(gc, [msg.name]);
            }

            result = {status: "SUCCESS", type: "CONNECT", playerWaitlist: codeToPlayers.get(gc)};
            break;
        default:
            result = {status: "FAILURE"};
            break;
    };

    ws.send(JSON.stringify(result));
}
