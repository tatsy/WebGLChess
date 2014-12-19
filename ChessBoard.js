var Chess;
(function (Chess) {
    (function (Piece) {
        Piece[Piece["Empty"] = 0] = "Empty";
        Piece[Piece["King"] = 1] = "King";
        Piece[Piece["Queen"] = 2] = "Queen";
        Piece[Piece["Bishop"] = 3] = "Bishop";
        Piece[Piece["Knight"] = 4] = "Knight";
        Piece[Piece["Rook"] = 5] = "Rook";
        Piece[Piece["Pawn"] = 6] = "Pawn";
    })(Chess.Piece || (Chess.Piece = {}));
    var Piece = Chess.Piece;
    var Board = (function () {
        function Board() {
            this.rows = 8;
            this.cols = 8;
            this.pieces = [
                [5, 4, 3, 1, 2, 3, 4, 5],
                [6, 6, 6, 6, 6, 6, 6, 6],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [-6, -6, -6, -6, -6, -6, -6, -6],
                [-5, -4, -3, -2, -1, -3, -4, -5],
            ];
        }
        Board.prototype.getPiece = function (row, col) {
            return this.pieces[row][col];
        };
        Board.prototype.setPiece = function (row, col, piece) {
            this.pieces[row][col] = piece;
        };
        return Board;
    })();
    Chess.Board = Board;
})(Chess || (Chess = {}));
