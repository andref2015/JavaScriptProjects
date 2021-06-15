
// Hi, welcome to André's Tic Tac Toe game
// You need 2 players to play
// You should install the prompt-sync package on npm

const prompt = require('prompt-sync')({sigint: true}); //Useful for user input

const board = {
    instructionMap : 
`Insert one of these numbers to select a cell in the board
[1] [2] [3] 
[4] [5] [6] 
[7] [8] [9] 
Insert h to see this board again for help.
Insert e to exit game.
`,

    map : [
    ['[ ]', '[ ]', '[ ]'], 
    ['[ ]', '[ ]', '[ ]'],
    ['[ ]', '[ ]', '[ ]']
    ],

    print () {
        this.stringMap = "";
        for (let i = 0; i < this.map.length; i ++)
            this.stringMap += this.map[i].join(" ") + "\n"
        console.log(this.stringMap);
    },

    insert (userInput, currentPlayer) {
        //Determine what to input
        let char;
        if (currentPlayer === "X") {
            char = "[X]"
        }
        else if (currentPlayer === "O") {
            char = "[O]"
        }

        //Determine where to input
        if (userInput === 1) {
            this.map[references[userInput][0]][references[userInput][1]] = char; //change map
        }
        else if (userInput === 2) {
            this.map[references[userInput][0]][references[userInput][1]] = char;
        }
        else if (userInput === 3) {
            this.map[references[userInput][0]][references[userInput][1]] = char;
        }
        else if (userInput === 4) {
            this.map[references[userInput][0]][references[userInput][1]] = char;
        }
        else if (userInput === 5) {
            this.map[references[userInput][0]][references[userInput][1]] = char;
        }
        else if (userInput === 6) {
            this.map[references[userInput][0]][references[userInput][1]] = char;
        }
        else if (userInput === 7) {
            this.map[references[userInput][0]][references[userInput][1]] = char;
        }
        else if (userInput === 8) {
            this.map[references[userInput][0]][references[userInput][1]] = char;
        }
        else if (userInput === 9) {
            this.map[references[userInput][0]][references[userInput][1]] = char;
        }
        
        this.filledCells.push(userInput); //Add to filledCells
        this.filledCellsByPlayers[currentPlayer].push(userInput)
    },

    checkWin() {
        for (let i = 0; i < board.winningCombinations.length; i++) {
            if (board.winningCombinations[i].every(cell => board.filledCellsByPlayers["X"].includes(cell))) {
                console.log(`Congrats ${playerXName}, you win!`)
                gameActive = false;
                break;
            }
            else if (board.winningCombinations[i].every(cell => board.filledCellsByPlayers["O"].includes(cell))) {
                console.log(`Congrats ${playerOName}, you win!`)
                gameActive = false;
                break;
            }
        }
    },

    checkTie () {
        if (board.filledCells.length === 9) {
            console.log("Game is a tie");
            gameActive = false;
        }
    },
    
    checkInput (userInput) {
        //Check that cell is not already filled
        for (let i = 0; i < board.filledCells.length; i++) {
            if (userInput === this.filledCells[i]) {
                console.log("Sorry, you cannot move in a cell that is already selected")
                return false;
            }
        }

        //Check that number is between 1 and 9
        if (userInput > 0 && userInput < 10) {
            return true;
        }
        
        if (typeof userInput === "string") {
            if (userInput.toLowerCase() === "h") {
                console.log(board.instructionMap);
                return false;
            }

            else if (userInput.toLowerCase() === "e") {
                console.log("Game terminated.")
                gameActive = false;;
                return false;
            }
        }

        else {
            console.log("Sorry, you did not select a number between 1 and 9")
            return false;
        }
    },

    filledCells : [],
    filledCellsByPlayers : {
        "X" : [],
        "O" : []
    },

    winningCombinations : [[1, 2, 3], [4, 5, 6], [7, 8 , 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]
}   

const references = {
    1: [0,0],
    2: [0,1],
    3: [0,2],
    4: [1,0],
    5: [1,1],
    6: [1,2],
    7: [2,0],
    8: [2,1],
    9: [2,2], 
}

function changePlayer () {
    if (currentPlayer === "X") {
        currentPlayer = "O";
        currentPlayerName = playerOName;
    } else {
        currentPlayer = "X";
        currentPlayerName = playerXName;
    }
}

function turn () {
    let userInput = prompt(`${currentPlayerName}, which cell do you choose? `);
    if (userInput.toLowerCase() !== "h" && userInput.toLowerCase() !== "e") {
        userInput = Number.parseInt(userInput);
    }
    
    if (board.checkInput(userInput)) {
        board.insert(userInput, currentPlayer)
        changePlayer();   
    } 

}

let gameActive = true;

//Get names
let playerXName = prompt(`Player X, what is your name? `);
playerXName = playerXName.toString();
let playerOName = prompt(`Player O, what is your name? `);
playerOName = playerOName.toString();
let currentPlayerName = playerXName;

let currentPlayer = "X"; // X starts

console.log(board.instructionMap); //print instructions

while (gameActive) {
    turn();
    if (gameActive) {
        board.print();
    }
    board.checkWin();
    if (gameActive) {
        board.checkTie();
    }
}