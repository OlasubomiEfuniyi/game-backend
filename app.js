const WebSocket = require("ws");
const LinkedList = require("./linked-list").LinkedList;
const { GameData } = require("./game-data");

const port = 1024;
const NUM_FOOD = 1000;

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
            getPort(ws, Number.parseInt(msg.gameCode));
            break;
        default:
            let result = {status: "FAILURE"};
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

            let result = {status: "SUCCESS", type: "CREATE", gameCode: gameCode};
            ws.send(JSON.stringify(result));
        });
    }
}

//Return the port number associated with the game code provided
function getPort(ws, gc) {
    let portNumber = codeToGameData.get(gc).port;

    let result =  {status: "SUCCESS", type: "PORT", port: portNumber};
    ws.send(JSON.stringify(result));
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
            } 

            result = {status: "SUCCESS", type: "CONNECT", playerWaitlist: gameData.getPlayerNames(), id: id};
            break;
        case "START":
            gameData = handleStartGame(gc);
            result = {status: "SUCCESS", type: "START", gamePieces: gameData.gamePieces, foodPieces: gameData.foodPieces};
            break;
        default:
            result = {status: "FAILURE"};
            break;
    };

    codeToGameData.get(gc).notifyPlayers(JSON.stringify(result));
}


//This function handles a request to start a game given the game code associated with the game world
function handleStartGame(gc) {
    let players = codeToPlayers.get(gc);

    //Create a game piece for each player
    let gamePieces = players.map((player, index, arr) => {
        let x = Math.floor(Math.random() * INITIAL_MAX_PLAYER_X);
        let y = Math.floor(Math.random() * INITIAL_MAX_PLAYER_Y); 

        return new GamePiece(x, y, undefined, PLAYER, colors[index % colors.length]);
    });

    //Create food in the game world
    let food = [];
    for(let i = 0; i < NUM_FOOD; i++) {
        let x = Math.floor(Math.random() * MAX_X);
        let y = Math.floor(Math.random() * MAX_Y); 
        let foodPiece = new GamePiece(x, y, FOOD_RADIUS, FOOD, colors[i % colors.length]);

        food.push(foodPiece);
    }

    let gameData = new GameData(gamePieces, food);

    //Keep track of all of this data for the game world
    codeToData.set(gc, gameData);

    return gameData;
}

function generateUniqueID() {
    return Date.now();
}
