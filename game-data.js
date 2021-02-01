const { GamePiece, FOOD } = require("./game-piece");
const { PlayerData } = require("./player-data");
const { LeaderBoard } = require("./leaderboard");

const MAX_X = 1000;
const MAX_Y = 1000;
const colors = ["red", "gree", "blue","orange", "yellow", "black", "brown"];
const FOOD_RADIUS = 5;

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
    }

    get playerData() {
        return this._playerData;
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

    set port(port) {
        this._port = port;
    }

    set gameCode(gc) {
        this._gameCode = gc;
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
            player.webSocket.send(message);
        })
    }

    //This method adds food to the game
    addFood() {
        let x = Math.floor(Math.random() * MAX_X);
        let y = Math.floor(Math.random() * MAX_Y);

        let foodPiece = new GamePiece(x, y, FOOD_RADIUS, FOOD, colors[(Math.floor(Math.random() * colors.length))]);

        this._foodData.push(foodPiece);
    }
}

exports.GameData = GameData;
exports.MAX_X = MAX_X;
exports.MAX_Y = MAX_Y;