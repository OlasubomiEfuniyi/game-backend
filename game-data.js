const { GamePiece, FOOD, COLORS, MINIMUM_RADIUS } = require("./game-piece");
const { PlayerData } = require("./player-data");
const { LeaderBoard } = require("./leaderboard");

const MAX_X = 10000;
const MAX_Y = 10000;
const NUM_FOOD = 1000;
const FOOD_RADIUS = 5;

// A game can be in one of the following 3 states 
const WAITING = "WAITING";
const STARTED = "STARTED";
const ENDED = "ENDED";

class GameData {
    constructor() {
        this._playerData = new Map(); //A map from player id to information about the player including information about the player's game piece.
        this._numPlayers = 0; //The number of players in the game
        this._maxX = MAX_X; //The largest x coordinate in the game
        this._maxY = MAX_Y; //The largest y coordinate in the game
        this._foodData = []; //A list of all the food in the game world.
        this._leaderBoard = new LeaderBoard(); //An up to date listing of the players' scores
        this._port = -1;
        this._gameCode = -1;
        this._gameState = WAITING;
    }

    //Expose a map from a players id to an object containing their id, name and game pieces only.
    get playerData() {
        let pd = new Map();

        this._playerData.forEach((player, id, map) => {
            pd.set(id, {id: id, name: player.name, pieces: player.pieces});
        });

        return pd;
    }

    get numPlayers() {
        return this._numPlayers;
    }

    get maxX() {
        return this._maxX;
    }

    get maxY() {
        return this._maxY;
    }

    get foodData() {
        return this._foodData;
    }
    
    get port() {
        return this._port;
    }

    get gameCode() {
        return this._gameCode;
    }

    get leaderboard() {
        return this._leaderBoard.board;
    }

    get gameState() {
        return this._gameState;
    }

    set port(port) {
        this._port = port;
    }

    set gameCode(gc) {
        this._gameCode = gc;
    }

    startGame() {
        this._gameState = STARTED;
    }

    endGame() {
        this._gameState = ENDED;
    }

    isGameWaiting() {
        return this._gameState === WAITING;
    }

    isGameStarted() {
        return this._gameState === STARTED;
    }

    isGameEnded() {
        return this._gameState === ENDED;
    }

    //This method adds a player to the game
    addPlayer(id, name, ws) {
        if(!this._playerData.has(id)) { //Create a new player with the provided id and name
            let playerData = new PlayerData(id, name, ws);
            this._playerData.set(id, playerData);
            this._numPlayers++;
        }

        this._leaderBoard.addPlayer(id); //Add the player to the leaderboard
    }

    //This method returns a list of player names
    getPlayerNames() {
        let res = [];

        this._playerData.forEach((value, key, map) => {
            res.push(value.name);
        })

        return res;
    }


    //This method sends message to all the players in the game via their web socket
    notifyPlayers(message) {
        this._playerData.forEach((player, id, map) => {
            //Replace maps with objects whose dataType key signify that it is a map and whose 
            //value key is a 2d array representing all the entries in the map.
            player.webSocket.send(JSON.stringify(message, (key, value) => {
                if(value instanceof Map) {
                  return {
                    dataType: 'Map',
                    value: Array.from(value.entries()),
                  };
                } else {
                  return value;
                }
             }));
        })
    }

    

    //This method adds food to the game
    createFood() {
        for(let i = 0; i < NUM_FOOD; i++) {
            let x = Math.floor(Math.random() * MAX_X);
            let y = Math.floor(Math.random() * MAX_Y);
    
            let foodPiece = new GamePiece(x, y, FOOD_RADIUS, FOOD, COLORS[(Math.floor(Math.random() * (COLORS.length - 1)))]);
    
            this._foodData.push(foodPiece);
        }
    }

    //This method creates game pieces for all players in the game
    createGamePieces() {
        this._playerData.forEach((player, id, map) => {
            let x = Math.floor(Math.random() * MAX_X);
            let y = Math.floor(Math.random() * MAX_Y);

            player.addGamePiece(x, y, MINIMUM_RADIUS);
        });
    }

}

exports.GameData = GameData;