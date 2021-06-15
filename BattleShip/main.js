// main.js
// Hi, welcome to André's Battleship game
// You should install the prompt-sync package on npm

// Import the prompt-sync package as prompt for asking user input
const prompt = require('prompt-sync')({sigint: true});

const ships = ["Aircraft Carrier : ◼︎ ◼︎ ◼︎ ◼︎", "Battleship : ◼︎ ◼︎ ◼︎", "Cruiser : ◼︎ ◼︎", "Submarine : ◼︎"];
const countShipCells = 10; // 4 in an aircraft carrier + 3 in a battleship + 2 in a cruiser + 1 in a submarine
let placingShipsMode = true;
let activeGame = true;
let player1Score = 0, player2Score = 0;
let prevMove;
let hitShip = false;
let player1CarrierAlive = true, player1BattleshipAlive = true, player1CruiserAlive = true, player1SubmarineActive = true, player2CarrierAlive = true, player2BattleshipAlive = true, player2CruiserAlive = true, player2SubmarineAlive = true;
let player1Battleship = [], player1Carrier = [], player1Cruiser = [], player1Submarine = [], player2Battleship = [], player2Carrier = [], player2Cruiser = [], player2Submarine = [];
let player1AttackCells = [], player2AttackCells = [];

console.log("\n" + "Hi, welcome to Andre's Battleship game!\nYou need 2 players to play.\n")

// Ask for players' names or use default names
const player1 = prompt("Player 1, what is your name? ") || "Player 1";
const player2 = prompt("Player 2, what is your name? ") || "Player 2"; 
let activePlayer = player1, inactivePlayer = player2;

console.log(`\nThese are the ships that each player has to place:\n`)
for (let i = 0; i < ships.length; i ++) {
    console.log("1 " + ships[i])
}

const board = {
    map : [],
    createMap () { // Fills the map with 7 rows
        for (let i = 0; i < 7; i ++) {
            this.map.push(["[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]"])
            }
    }, 
    print (map) {
        console.log(["   A", "B", "C", "D", "E", "F", "G"].join("   ")); // Print first row with alphabet
        this.stringMap = "";
        for (let i = 1; i < map.length + 1; i ++) {
            this.stringMap += i + " " + map[i-1].join(" ") + "\n" // Adds the first column with numbers 1 to 7 to the map
        }
        console.log(this.stringMap); // Print the map
    },
    printEmpty () {
        console.log("\nThis is the board:\n")
        this.print(this.map);
    },
    getNumIndex (input) {
        return input.slice(1)-1;
    },
    getAlphabIndex (input) {
        const alphabetChar = input[0].toLowerCase();
        return board.positionIndex[alphabetChar];
    },
    checkInput (input) { // Checks that the input is valid in format like "a2"
        if (! input) { // If input is empty
            console.log("\nSorry, your input is empty, retry\n")
            return false;
        }
        // Check that the first character is a valid letter and that the number is between 1 and 7
        else if (board.letters.includes(input[0].toLowerCase()) && (input.slice(1)) > 0 && (input.slice(1)) < 8) {
            return true;
        } 
        else {
            console.log("\nSorry, your input is not in the format type 'a2' or is not a valid cell in the map, retry\n")
            return false;
        }
    },
    positionIndex : {"a":0, "b":1, "c":2, "d":3, "e":4, "f":5, "g":6}, // Used to retrieve alphabet index of user input
    letters : ["a", "b", "c", "d", "e", "f", "g"] // Used to check if user input is valid
}

function checkAdjacentShip (alphaIndex, numIndex, i) {
    // checkAdjacentShip only when inserting player ships
    if (placingShipsMode) {
        const newShipsIndex = [0, 4, 7, 9];
        // When the player is not inserting a new ship...
        if (! newShipsIndex.includes(i)) {
            const prevNumIndex = prevMove[1];
            const prevAlphaIndex = prevMove[0];

            // The new ship cell should be adjacent to the previously inserted cell
            if (alphaIndex === prevAlphaIndex + 1 || alphaIndex === prevAlphaIndex -1) {
                if (numIndex === prevNumIndex) {
                    return true;
                }
                else {
                    console.log(`\n${activePlayer}, you have to insert the ship piece adjacent to the previously-placed ship piece\n`)
                    return false;
                }
            }
            else if (numIndex === prevNumIndex + 1 || numIndex === prevNumIndex -1) {
                if (alphaIndex === prevAlphaIndex) {
                    return true;
                }
                else {
                    console.log(`\n${activePlayer}, you have to insert the ship piece adjacent to the previously-placed ship piece\n`)
                    return false;
                }
            }
            else {
                console.log(`\n${activePlayer}, you have to insert the ship piece adjacent to the previously-placed ship piece\n`)
                return false;
            }
        }
        // When the player is inserting a new ship
        else if (newShipsIndex.includes(i)) {
            return true;
        }
    }
    // Should not checkAdjacentShip when attacking
    else {
        return true;
    }
}

function checkMove (alphaIndex, numIndex) { // Check that the input cell wasn't previously inserted by the player
    // When in placingShipsMode, the user is inserting his ships
    if (placingShipsMode) {
        // Check that player1 has not previously filled the cell with numIndex and alphaIndex
        if (activePlayer === player1 && player1DefenceMap[numIndex][alphaIndex].includes("[◼︎]")){
            console.log(`\n${activePlayer}, you already selected this cell, retry\n`);
            return false;
        }
        // Same check but for player2
        else if (activePlayer === player2 && player2DefenceMap[numIndex][alphaIndex].includes("[◼︎]")) {
            console.log(`\n${activePlayer}, you already selected this cell, retry\n`);
            return false;
        }
        // If there are no problems...
        else {
            return true;
        }
    } 
    // When not in placingShipsMode, the user is attacking the enemy ships
    else if (! placingShipsMode) {
        // Check that player1 did not previously select the cell
        if (activePlayer === player1 && ! player1AttackMap[numIndex][alphaIndex].includes("[ ]")){
            console.log(`\n${activePlayer}, you already selected this cell, retry\n`);
            return false;
        }
        // Check that player2 did not previously select the cell
        else if (activePlayer === player2 && ! player2AttackMap[numIndex][alphaIndex].includes("[ ]")) {
            console.log(`\n${activePlayer}, you already selected this cell, retry\n`);
            return false;
        }
        // If there are no problems..
        else {
            return true;
        }
    }
}

function printHelp () {
    console.log(`\n${activePlayer}, this is the map of your ships.`)
    // Print the player's map
    if (activePlayer === player1) {
        board.print(player1DefenceMap);
    }
    else {
        board.print(player2DefenceMap);
    }
    // Hide the printed map from the console
    console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑\n(${activePlayer}, view your ships in the map above)\n(Hide the upper map from ${inactivePlayer})\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`)
}

function askInput(i) {
    let correctInput = true;
    do {
        let playerInput;
        let getHelp = false;

        // When in placingShipsMode, the user is entering his ships on the map
        if (placingShipsMode) {
            playerInput = prompt("Enter one cell only to place part of the ship: ");
        } 
        // Otherwise, the user is attacking the enemy ships
        else {
            console.log(`You can enter "help" to see ${activePlayer}'s ships`)
            playerInput = prompt(`${activePlayer}, enter one cell to attack ${inactivePlayer}'s ships: `);
            // If the user asks for help
            if(playerInput.toString().toLowerCase() === "help") {
                printHelp();
                // getHelp avoids interpreting the player's input
                getHelp = true;
            }
        }
        // If the user did not ask for help and the input is valid in format like "a2"
        if (!getHelp && board.checkInput(playerInput)) {
            const numIndex = board.getNumIndex(playerInput);
            const alphaIndex = board.getAlphabIndex(playerInput);
            
            // If the user did not already insert that cell and is placing the ship correctly adjacent to the other ship cells
            if (checkMove(alphaIndex, numIndex) && checkAdjacentShip (alphaIndex, numIndex, i)) {
                return [alphaIndex, numIndex];
                correctInput = true;
            } 
            else {
                correctInput = false;
            }
        }
        // If the input is wrong or the user asked for help...
        else {
            correctInput = false;
        }
    }
    // Repeat loop until input is correct
    while (! correctInput);
    
}

function placeShips () {
    console.log(`It's now ${activePlayer}'s turn to place his/her ships. ${inactivePlayer} please look away!\n`)
    let currentShipIndex = 0;
    for (let i = 0; i < countShipCells; i++) {
        console.log(`${activePlayer}, you're now placing the ${ships[currentShipIndex]}.\n\nYou can place it horizontally or vertically, one cell at a time.\nFor example, to start placing the first part of the ship in cell A1, write "a1" and press enter.\n`)
        
        // Ask where to place the ship
        const userInput = askInput(i);
        // Copy the userInput into prevMove
        prevMove = [...userInput];
        // Get the indices of the user input
        const numIndex = userInput[1];
        const alphaIndex = userInput[0];

        // For player1
        if (activePlayer === player1) {
            // Insert ship cell in map
            player1DefenceMap[numIndex][alphaIndex] = "[◼︎]";
            board.print(player1DefenceMap);
            
            // Register the location of the carrier, battlerhip, cruiser or submarine
            if (currentShipIndex === 0) {
                player1Carrier.push(alphaIndex.toString()+numIndex.toString())
            }
            else if (currentShipIndex === 1) {
                player1Battleship.push(alphaIndex.toString()+numIndex.toString())
            }
            else if (currentShipIndex === 2) {
                player1Cruiser.push(alphaIndex.toString()+numIndex.toString())
            }
            else if (currentShipIndex === 3) {
                player1Submarine.push(alphaIndex.toString()+numIndex.toString())
            }
        } 
        // For player2
        else if (activePlayer === player2) {
            // Insert ship cell in map
            player2DefenceMap[numIndex][alphaIndex] = "[◼︎]";
            board.print(player2DefenceMap);

            // Register the location of the carrier, battlerhip, cruiser or submarine
            if (currentShipIndex === 0) {
                player2Carrier.push(alphaIndex.toString()+numIndex.toString())
            }
            else if (currentShipIndex === 1) {
                player2Battleship.push(alphaIndex.toString()+numIndex.toString())
            }
            else if (currentShipIndex === 2) {
                player2Cruiser.push(alphaIndex.toString()+numIndex.toString())
            }
            else if (currentShipIndex === 3) {
                player2Submarine.push(alphaIndex.toString()+numIndex.toString())
            }
        }
        const endShipIndex = [3, 6, 8, 9]; //Indices at which the player stops inserting the previous ship
        if (endShipIndex.includes(i)) {
            currentShipIndex ++;
        }
    }
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n(Please avoid looking up, it's cheating)\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n") //hide the ships the previous player inserted
}

function switchPlayers () {
    if (activePlayer === player2) {
        activePlayer = player1;
        inactivePlayer = player2;
    } else {
        activePlayer = player2;
        inactivePlayer = player1;
    }
}

function checkWin() {
    if (player1Score === countShipCells) {
        console.log(`Congrats ${player1}, you win the game and eternal glory!\n`)
        activeGame = false;
    }
    if (player2Score === countShipCells) {
        console.log(`Congrats ${player2}, you win the game and eternal glory!\n`)
        activeGame = false;
    }
}

function checkShipSink () { // Alerts the user if he sank an enemy ship
    if (activePlayer === player1) {
        if (player2Carrier.every(cell => player1AttackCells.includes(cell)) && player2CarrierAlive) {
            console.log(`You sank ${inactivePlayer}'s carrier!`)
            player2CarrierAlive = false;
        }
        if (player2Battleship.every(cell => player1AttackCells.includes(cell)) && player2BattleshipAlive) {
            console.log(`You sank ${inactivePlayer}'s battleship!`)
            player2BattleshipAlive = false;
        }
        if (player2Cruiser.every(cell => player1AttackCells.includes(cell)) && player2CruiserAlive) {
            console.log(`You sank ${inactivePlayer}'s cruiser!`)
            player2CruiserAlive = false;
        }
        if (player2Submarine.every(cell => player1AttackCells.includes(cell)) && player2SubmarineAlive) {
            console.log(`You sank ${inactivePlayer}'s submarine!`)
            player2SubmarineAlive = false;
        }
    } else if (activePlayer === player2) {
        if (player1Carrier.every(cell => player2AttackCells.includes(cell)) && player1CarrierAlive) {
            console.log(`You sank ${inactivePlayer}'s carrier!`)
            player1CarrierAlive = false;
        }
        if (player1Battleship.every(cell => player2AttackCells.includes(cell)) && player1BattleshipAlive) {
            console.log(`You sank ${inactivePlayer}'s battleship!`)
            player1BattleshipAlive = false;
        }
        if (player1Cruiser.every(cell => player2AttackCells.includes(cell)) && player1CruiserAlive) {
            console.log(`You sank ${inactivePlayer}'s cruiser!`)
            player1CruiserAlive = false;
        }
        if (player1Submarine.every(cell => player2AttackCells.includes(cell)) && player1SubmarineActive) {
            console.log(`You sank ${inactivePlayer}'s submarine!`)
            player1SubmarineActive = false;
        }
    }
}

// Create a map
board.createMap();

// Copy the empty attack and defense maps for player1 and player2
let player1DefenceMap = JSON.parse(JSON.stringify(board.map)), player2DefenceMap = JSON.parse(JSON.stringify(board.map));
let player1AttackMap = JSON.parse(JSON.stringify(board.map)), player2AttackMap = JSON.parse(JSON.stringify(board.map))

// Let player1 place the ships
board.printEmpty(); // Print the empty map
placeShips();

// Let player2 place the ships
switchPlayers();
board.printEmpty();
placeShips();

// Now the placingShipsMode ends
placingShipsMode = false;

// Repeat this until someone wins
while (activeGame) {
    switchPlayers();
    // Print user's map of previous hits and misses
    if (activePlayer === player1) {
        console.log(`\n${player1}, this is the map of your attack hits (X) and misses (O) against ${player2}`)
        board.print(player1AttackMap);
    } else {
        console.log(`\n${player2}, this is the map of your attack hits (X) and misses (O) against ${player1}`)
        board.print(player2AttackMap);
    }
    // Repeat this if a user has hit an enemy ship
    do {
        const userInput = askInput();
        const numIndex = userInput[1];
        const alphaIndex = userInput[0];

        if (activePlayer === player1) {
            // Record the attack cell position in format "11"
            player1AttackCells.push(alphaIndex.toString()+numIndex.toString());

            // If the user hits an enemy ship...
            if (player2DefenceMap[numIndex][alphaIndex].includes("[◼︎]")){
                console.log(`\nCongrats ${activePlayer}, you hit a ship!`);
                player1AttackMap[numIndex][alphaIndex] = "[X]";
                player1Score++;
                hitShip = true;
                checkShipSink();

            } 
            // If the user does not hit an enemy ship
            else {
                console.log(`\nOoops, ${activePlayer}, you missed!`);
                player1AttackMap[numIndex][alphaIndex] = "[O]";
                hitShip = false;
            }
            // Print the user map to see the last hit or miss
            console.log(`\n${player1}'s map of attack hits (X) and misses (O) against ${player2}`)
            board.print(player1AttackMap);

        } else {
            player2AttackCells.push(alphaIndex.toString()+numIndex.toString());
            if (player1DefenceMap[numIndex][alphaIndex].includes("[◼︎]")){
                console.log(`\nCongrats ${activePlayer}, you hit a ship!`);
                player2AttackMap[numIndex][alphaIndex] = "[X]";
                player2Score++;
                hitShip = true;
                checkShipSink();

            } else {
                console.log(`\nOoops, ${activePlayer}, you missed!`)
                player2AttackMap[numIndex][alphaIndex] = "[O]"
                hitShip = false;
            }
            // Print the user map to see the last hit or miss
            console.log(`\n${player2}'s map of attack hits (X) and misses (O) against ${player1}`)
            board.print(player2AttackMap);   
            
        }
        // Check if someone has won
        checkWin();
    }
    // Repeat if player hits a ship and if game is still going
    while (hitShip && activeGame);
}