/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />

module Chess {
    export enum PieceKind {
        Empty = 0,
        King,
        Queen,
        Bishop,
        Knight,
        Rook,
        Pawn
    }

    export class Piece {
        constructor(public pieceKind : PieceKind, public x : number, public y : number, public mesh : THREE.Mesh) {
        }
    }
}
