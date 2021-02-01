class PlayerData {
    constructor(id, name = "", webSocket) {
        this._id = id;
        this._name = name;
        this._webSocket = webSocket;
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

    set name(name) {
        this._name = name;
    }

    set webSocket(ws) {
        this._webSocket = ws;
    }
}

exports.PlayerData = PlayerData;
