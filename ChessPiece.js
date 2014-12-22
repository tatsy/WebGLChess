/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
var Chess;
(function (Chess) {
    (function (PieceKind) {
        PieceKind[PieceKind["Empty"] = 0] = "Empty";
        PieceKind[PieceKind["King"] = 1] = "King";
        PieceKind[PieceKind["Queen"] = 2] = "Queen";
        PieceKind[PieceKind["Bishop"] = 3] = "Bishop";
        PieceKind[PieceKind["Knight"] = 4] = "Knight";
        PieceKind[PieceKind["Rook"] = 5] = "Rook";
        PieceKind[PieceKind["Pawn"] = 6] = "Pawn";
    })(Chess.PieceKind || (Chess.PieceKind = {}));
    var PieceKind = Chess.PieceKind;
    var Piece = (function () {
        function Piece(pieceKind, x, y, mesh) {
            this.pieceKind = pieceKind;
            this.x = x;
            this.y = y;
            this.mesh = mesh;
        }
        return Piece;
    })();
    Chess.Piece = Piece;
})(Chess || (Chess = {}));
