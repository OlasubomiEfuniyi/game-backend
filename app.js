const WebSocket = require("ws");
const LinkedList = require("./linked-list").LinkedList;
const { GameData } = require("./game-data");

const port = 1024;

//Linked list to keep track of port numbers
const portList = new LinkedList();

//A map from game code to the game's data
const codeToGameData = new Map();


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
    console.log("client is connected to game server");
    ws.on('message', (message) => {handleGameServerMessage(ws, message);});
}

//This function hanles a message from a connected client via their web socket connection
function handleGameServerMessage(ws, message) {
    let msg = JSON.parse(message);

    console.log("received: %s", message);

    switch(msg.type) {
        case "CREATE":
            createGame(ws);
            break;
        case "PORT":
            getPort(ws, Number.parseInt(msg.gameCode));
            break;
        default:
            let result = {status: "FAILURE", msg: `Invalid command: ${msg.type}`};
            ws.send(JSON.stringify(result));
            break;
    };

}

//This function creates a new game world and returns an
//object containing the relevant info about the game world
function createGame(ws) {
    let gameCode = generateGameCode();
    let portNumber = null;

    if(portList.size != 0) {
        portNumber = portList.removeFromFront();

        let gameData = new GameData();

        gameData.port = portNumber;
        gameData.gameCode = gameCode;

        //Add the game data to the map
        codeToGameData.set(gameCode, gameData);

        let webSocketServer = new WebSocket.Server({port: portNumber}, () => {
            console.log(`Created web socket server for game world with code ${gameCode} on port ${portNumber}`);

            webSocketServer.on('connection', (ws) => {
                console.log(`Player connected to game world with game code ${gameCode}`);
                ws.on('message', (message) => {handleGameWorldMessage(gameCode, message, ws)});
            });

            //Return this result to client after the server is created
            let result = {status: "SUCCESS", type: "CREATE", gameCode: gameCode};
            ws.send(JSON.stringify(result));
        });
    }
}

//Return the port number associated with the game code provided
function getPort(ws, gc) {
    let gameData = codeToGameData.get(gc);

    if(gameData !== undefined) {
        let portNumber = gameData.port;

        let result =  {status: "SUCCESS", type: "PORT", port: portNumber};
        ws.send(JSON.stringify(result));
    } else {
        ws.send(JSON.stringify({status: "FAILURE", msg: "Invalid game code"}));
    }

}


//This function generates a unique game code
function generateGameCode() {
    return Date.now();
}


/**************************************************** Game World Functions *******************************************************/
//This function handles messages sent to game worlds
function handleGameWorldMessage(gc, message, ws) {
    let msg = JSON.parse(message);
    let result = {};

    console.log(`received message: ${message}`);
    switch(msg.type) {
        //When a player attempts to connect to a game world, assign the player a unique id and return it to them as part of the response
        case "CONNECT": 
            if(codeToGameData.has(gc)) { //There is already game data associated with this game code. This should always be the
                //case if the player provides game code for a created game
                let gameData = codeToGameData.get(gc);
                let id = generateUniqueID();
                let name = msg.name;

                gameData.addPlayer(id, name, ws);
                result = {status: "SUCCESS", type: "CONNECT", playerWaitlist: gameData.getPlayerNames(), id: id, gameCode: gc};
            } else {
                result = {status: "FAILURE", msg: "Invalid game code provided on CONNECT"}
            }

            break;
        case "START":
            handleStartGame(gc, ws);
            break;
        default:
            result = {status: "FAILURE", msg: `Invalid comamand: ${msg.type}`};
            break;
    };

    codeToGameData.get(gc).notifyPlayers(result);
}


//This function handles a request to start a game given the game code associated with the game world
function handleStartGame(gc, ws) {
    let gameData = codeToGameData.get(gc);

    if(gameData) {
        //Create a game piece for each player
        codeToGameData.get(gc).createGamePieces();

        //Create food in the game world
        codeToGameData.get(gc).createFood();

        gameData.notifyPlayers({status: "SUCCESS", type: "START", playerData: gameData.playerData, foodData: gameData.foodData, leaderboard: gameData.leaderboard});
    } else { //Notify the player that they game code they provided is invalid
        ws.send(JSON.stringify({status: "FAILURE", msg: "Invalid game code provided on START"}));
    }
}

//This function generates a unique player id
function generateUniqueID() {
    return Date.now();
}
