const MINIMUM_RADIUS = 10;
const FOOD = 1;
const PLAYER = 2;

class GamePiece {
    constructor(x = 0, y = 0, radius = MINIMUM_RADIUS, type = FOOD, color = "green") {
        this._x = x;
        this._y = y;
        this._radius = radius;
        this._type = type;
        this._color = color;
        this._isAlive = true;
    }

    set x(x) {
        this._x = x;
    }

    set y(y) {
        this._y = y;
    }

    set radius(radius) {
        this._radius = radius;
    }

    set type(type) {
        this._type = type;
    }

    set color(color) {
        this._color = color;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get radius() {
        return this._radius;
    }

    get type() {
        return this._type;
    }

    get color() {
        return this._color;
    }

    get isAlive() {
        return this._isAlive;
    }

    grow(radiusIncrement) {
        if(this._type === PLAYER) {
            this._radius += radiusIncrement;
        }
    }

    shrink(radiusDecrement) {
        if(this._type === PLAYER) {
            if(this._radius - radiusDecrement > MINIMUM_RADIUS) {
                this._radius -= radiusDecrement;
            } else {
                this._radius = MINIMUM_RADIUS;
                this.isAlive = false;
            }
        }
    }
}

exports.GamePiece = GamePiece;
exports.FOOD = FOOD;
exports.PLAYER = PLAYER;
exports.MINIMUM_RADIUS = MINIMUM_RADIUS;