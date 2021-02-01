const { GamePiece, MINIMUM_RADIUS, PLAYER, COLORS } = require("./game-piece");

class PlayerData {
    constructor(id, name = "", webSocket) {
        this._id = id;
        this._name = name;
        this._webSocket = webSocket;
        this._pieces = [];
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get webSocket() {
        return this._webSocket;
    }

    get pieces() {
        return this._pieces;
    }

    set name(name) {
        this._name = name;
    }

    set webSocket(ws) {
        this._webSocket = ws;
    }

    //This method adds a game piece for a player. A player can have multiple game pieces if they split.
    addGamePiece(x, y, radius=MINIMUM_RADIUS) {
        let color  = undefined;

        if(this._pieces.length == 0) { //This is the first game piece, give it a random color
            color = COLORS[Math.floor(Math.random() * (COLORS.length - 1))];
        } else { //Use the same color as the existing game pieces
            color = this._pieces[0].color;
        }

        this._pieces.push(new GamePiece(x, y, radius, PLAYER, color));
    }
}

exports.PlayerData = PlayerData;
