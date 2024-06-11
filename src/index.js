
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
console.log("hello world");


// example: Player 1 moves to the center of 3x3 grid
// 1-indexed
let exampleMove = 
{
    player: 1,
    xPosition: 2,
    yPosition: 2
};

// Given a sequence of moves, return the player who wins the board
// If no one has won, then return 0
// If one player makes an illegal move: they lose
// the size of the gird is 3x3
// Illegal moves:
//  X  move into a spot that doesnt exist
//   move into a spot that is full
//  X move twice in a row
// If there are no moves left available and no one has won, return -1
function tttSolve(moves,board = Array.from({length : 3}).map(() => new Array(3).fill(0)) ) {
    const BOARD_SIZE = 3;
    const FINAL_ROUND = 9;
    let previousPlayer;
    for (let i = 0; i < moves.length; i++){
        const move = moves[i];
        const playerWillWin = move.player === 1 ? 2 : 1;
        
        if (previousPlayer === move.player) {
            return playerWillWin;
        }
        
        previousPlayer = move.player;
        const xIndex = move.xPosition - 1;
        const yIndex = move.yPosition - 1;
        
        if (
            xIndex  < 0 || xIndex  > BOARD_SIZE - 1 ||
            yIndex < 0 || yIndex > BOARD_SIZE - 1
        ){
            return playerWillWin;
        }

        if (board[xIndex][yIndex] !== 0){
            return playerWillWin;    
        }

        board[xIndex][yIndex] = move.player;
        
        const potentialWinner = tttSolveBoard(board);
        if (potentialWinner !== 0) {
            return potentialWinner;
        }
    }

    // is all board filled out?
    
    return moves.length === FINAL_ROUND ? -1 : 0;

}

// Return the player who has "won" the board
// Constraints: 
// Board is a 3x3 grid, with 0 (for empty), 1 or 2 for player 1 or 2
function tttSolveBoard(board) {
        const patterns = [
          // horizontal
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
      
          // vertical
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
      
          // diagonal
          [0, 4, 8],
          [2, 4, 6],
        ];
      
        // get board value from pattern index
        function getBoardValue(index) {
          // (row * n) + col = index
          const row = Math.floor(index / board.length);
          const col = index % board.length;
      
          return board[row][col];
        }
      
        for (let pi = 0; pi < patterns.length; pi++) {
          const pattern = patterns[pi];
      
          const first = getBoardValue(pattern[0]);
          const second = getBoardValue(pattern[1]);
          const third = getBoardValue(pattern[2]);
      
          if (first !== 0 && first === second && second === third) {
            return first;
          }
        }
      
        return 0;

}

//starting with player 1
// ask for a move as x,y (ignore whitespace)
// if you dont understand the move, then ask the player again
// afterwards, print the board and ask the other player
// repeat until the game is over
function playTTT(){
    console.log('playTTT was called');
    const board = Array.from({length : 3}).map(() => new Array(3).fill(0));
    let isGameOver = false;
    let player = "x";
    // "x" -> player1
    // "o" -> player2
    let playerNumber = player === 'x' ? 1 : 2;

    console.log(`player${playerNumber}'s turn`)

    while (!isGameOver){

        const rl = readline.createInterface({ input, output });
        rl.prompt('what do you think?', (answer) => {
            console.log(`Thank you for your valuable feedback: ${answer}`);
            

            let move = answer;
            let xCommand = move.split(',')[0].trim();
            let yCommand = move.split(',')[1].trim();
            
            if (Number(xCommand) === NaN || Number(yCommand) === NaN){
                console.log(`Invalid move, please try again`);
                rl.close();

            }
            const gameWinner = tttSolve([Move(playerNumber,xCommand,yCommand)],board);
    
            if (gameWinner !== 0) {
                isGameOver = true
            }
    
            player = player === 'x' ? 'o' : 'x';

            rl.close();
        })
    }
    
}


function Move(player, x, y) {
    return {player: player, xPosition: x, yPosition: y};
};

console.log("Empty Game", tttSolve([]) === 0);

console.log("1 Move Game", tttSolve([Move(1,1,1)]) === 0);

console.log("2 Move Game", tttSolve([Move(1,1,1), Move(2,2,2)]) === 0);

console.log("Bad Game", tttSolve([Move(1,0,0)]) === 2);

console.log("Good Game", tttSolve([
    Move(1,2,2),
    Move(2,1,3),
    Move(1,1,2),
    Move(2,3,3),
    Move(1,3,2)
]) === 1);


// 000
// 222
// 000
console.log("Mirror Game", tttSolve([
    Move(2,2,2),
    Move(1,1,3),
    Move(2,1,2),
    Move(1,3,3),
    Move(2,3,2)
]) === 2);

console.log("Long Game", tttSolve([
    Move(1,3,3),
    Move(2,1,1),
    Move(1,2,3),
    Move(2,2,1),
    Move(1,1,3),
    Move(2,3,1),
]) === 1);


console.log("Overwrite Game", tttSolve([
    Move(2,2,2),
    Move(1,2,2)
]) === 2);


console.log("Double Move Game", tttSolve([
    Move(1,2,2),
    Move(2,1,1),
    Move(1,2,1),
    Move(1,2,3)
]) === 2);

console.log("Cat's Game", tttSolve([
    Move(1,2,2),
    Move(2,1,1),
    Move(1,2,1),
    Move(2,2,3),
    Move(1,1,3),
    Move(2,3,1),
    Move(1,1,2),
    Move(2,3,2),
    Move(1,3,3)
]) === -1);

console.log("")

playTTT()