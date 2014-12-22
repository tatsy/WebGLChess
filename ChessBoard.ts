module Chess {
    export class Board {
        public rows : number;
        public cols : number;
        private pieces : number[][];
        constructor() {
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

        getPiece(row : number, col : number) : number {
            return this.pieces[row][col];
        }

        setPiece(row : number, col : number, piece : number) : void {
            this.pieces[row][col] = piece;
        }
    }
}
