class LeaderBoard {
    constructor() {
        this._board = []; //An array where each entry is an object that contains the id of a player and thier score in descending
                         //order of their score.
    }

    get board() {
        return this._board;
    }

    //Add a player to the leaderboard
    addPlayer(id) {
        let key = id;
    
        this._board.push({id: id, score: 0});
    }

    //Adjust a players points up or down by points
    adjustPoints(id, points) {
        let player = undefined;
        let playerIndex = -1;

        //Find the player with the given id
        for(let i = 0; i < this._board.length; i++) {
            if(this._board[i].id === id) {
                player = this._board[i];
                playerIndex = i;
                break;
            }
        }

        //Adjust the points and move the player either up or down the leaderboard
        if(player !== undefined) {
            if(points > 0) { //Move the player up
                for(let i = playerIndex - 1; i >= 0; i--) {
                    if(this._board[i].score < player.score) {
                        swap(i, playerIndex);
                        playerIndex = i;
                    } else {
                        break;
                    }
                }
            } else if(points < 0) { //Move the player down
                for(let i = playerIndex + 1; i < this._board.length; i++) {
                    if(this._board[i].score > player.score) {
                        swap(i, playerIndex);
                        playerIndex = i;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    //This method swaps the values at the provided indices in the leaderboard
    swap(i, j) {
        let temp = this._board[j];

        this._board[j] = this._board[i];
        this._board[i] = temp;
    }
}

exports.LeaderBoard = LeaderBoard;