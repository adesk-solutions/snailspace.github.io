let showSection = 'one';
const SECTIONS = {
    one: 'one',
    two: 'two'
}
const THEME = {
    light: 0,
    dark: 1
}
const SCORE_COUNT_PROCESS = {
    throw: 'onThrow',
    end: 'atEnd'
}
const DIRECTIONS = {
    right:[0, 1],
    down: [1, 0],
    left: [0, -1],
    up: [-1, 0]
};
const USER = {
    pc: 'pc',
    person: 'person'
}
const DEALER = {
    player1: 'player1',
    player2: 'player2'
}
const SAMPLE_STRING  = '2345678910JQKA';


let userScore = 0;
let pcScore = 0;
let dealer = false;
let currentPlayer = DEALER.player1;
let scoreCountEnd = localStorage.getItem('scoreCountSelect') === SCORE_COUNT_PROCESS.end;
const spiralArr = [13, 18, 17, 16, 11, 6, 7, 8, 9, 14, 19, 24, 23, 22, 21, 20, 15, 10, 5, 0, 1, 2, 3, 4];
const spiral2DArr = [
    [2, 2], [2, 3], [3, 3], [3, 2], [3, 1],
    [2, 1], [1, 1], [1, 2], [1, 3], [1, 4],
    [2, 4], [3, 4], [4, 4], [4, 3], [4, 2],
    [4, 1], [4, 0], [3, 0], [2, 0], [1, 0],
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]
];

const cardsArr = createAndShuffleDeck();
const scoreCardsArr = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
];


function pageInit() {
    clearData();
    hideShowSection(SECTIONS.one);
    setTheme();
    $('.scores').hide();
    $('#restartBtn').hide();

    $("#themeChangeBtn").click(function () {
        $('body').toggleClass('dark');
        const theme = JSON.parse(localStorage.getItem('theme'));
        if(theme === THEME.light){
            localStorage.setItem('theme', THEME.dark);
        }else{
            localStorage.setItem('theme', THEME.light);
        }
        setTheme();
    });
}

function saveGameSettings() {
    let playerNameField = document.getElementById('playerName');
    let playerName = document.getElementById('playerName').value;
    if (playerName === '') {
        document.getElementById('nameError').classList.add('show');
        playerNameField.classList.add('is-invalid')
        return;
    }

    let playerNameField2 = document.getElementById('playerName2');
    let playerName2 = document.getElementById('playerName2').value;

    if (playerName2 === '') {
        // document.getElementById('nameError2').classList.add('show');
        playerNameField2.classList.add('is-invalid')
        return;
    }

    let dealerSelect = document.getElementById('dealerSelect').value;
    let scoreCountSelect = document.getElementById('scoreCountSelect').value;

    // Save values to localStorage
    localStorage.setItem('playerName', playerName);    
    localStorage.setItem('dealerSelect', dealerSelect);
    localStorage.setItem('scoreCountSelect', scoreCountSelect);
    localStorage.setItem('playerName2', playerName2);
    $("#gameSettingsModal").modal("hide");
    if (scoreCountSelect === SCORE_COUNT_PROCESS.throw) {
        $('.scores').show();
    }
    hideShowSection(SECTIONS.two);
}




function makeGrid() {
    const playerName = localStorage.getItem('playerName');
    const playerName2 = localStorage.getItem('playerName2');

    document.getElementById('name').innerHTML = playerName;
    document.getElementById('name2').innerHTML = playerName2;

    dealer = localStorage.getItem('dealerSelect') === 'player1';
    currentPlayer = localStorage.getItem('dealerSelect');
    scoreCountEnd = localStorage.getItem('scoreCountSelect') === SCORE_COUNT_PROCESS.end;
    if (localStorage.getItem('scoreCountSelect') === SCORE_COUNT_PROCESS.throw) {
        $('.scores').show();
    }
    const grid = document.querySelector('.card-grid-inner');
    let str = ''
    for (let i = 1; i <= 25; i++) {
        str += `
        <div class="card-face-down">
            <img src="images/facedown.jpg"/>
        </div>
        `
    }
    grid.innerHTML = str;

    makePlayerCardGrid(cardsArr.slice(0, 13), '.user-cards','user')
    makePlayerCardGrid(cardsArr.slice(13, 26), '.pc-cards','pc')
    setDealerClass()
    selectCenterCard()
    checkDealer()
}

function makePlayerCardGrid(array, id, isFaceDown) {
    let str = '';
    array.forEach((item) => {
        str += `
            <div class="card-image ${isFaceDown == 'pc' ? 'pc':'user'}" onclick="removeCard(this, '${item}')">
                <img src="cards/${ item + '.svg'}"/>
            </div>
            `;
    });
    document.querySelector(id).innerHTML = str;
}



function removeCard(element, item) {
    if (!element.parentNode.classList.contains('active')) {
        alert("It's not your turn");
        return;
    }
    const currentCard = document.querySelectorAll('.card-face-down')[spiralArr.shift()];
    const position = spiral2DArr.shift();
    scoreCardsArr[position[0]][position[1]] = item;
    const currentCardImg = currentCard.querySelector('img')
    currentCardImg.src = `cards/${item}.svg`;

    element.parentNode.removeChild(element);
    dealer = !dealer;
    setDealerClass();
    if (!dealer) {
        //setTimeout(() => {
            const pcCards = document.querySelector('.pc-cards');
            const pcCard = pcCards.querySelector('.card-image');
            const event = new Event('click');
            if(pcCard !== null)
            console.log('test');
            //pcCard.dispatchEvent(event);
        //}, 1000);
    }

    setTimeout(() => {
    if(scoreCountEnd){
        if (!spiral2DArr.length) {
            //calculateScoreAtEnd();
            calculateManaullyScoreAtEnd();
        }
    } else {
        if(element.classList.contains('pc')){
            //calculateScore(position[0], position[1], USER.pc);
             
            calculateScoreManually('pc');
             //}, 2000);
        }else {
            //setTimeout(() => {
            calculateScoreManually("player");
        //}, 2000);
            //calculateScore(position[0], position[1], USER.user);
        }
    }
        }, 500);

    // if(!spiral2DArr.length) {
    //     $('#scoreBtn').hide();
    //     $('#restartBtn').show();
    //     if (pcScore > userScore) {
    //         $('#pcScore').addClass('winner');

    //         var winnerInfo = localStorage.getItem('playerName2') + " won with a total score of " + pcScore + ".";
    //         document.getElementById('winnerInfo').textContent = winnerInfo;
    //         var winnerModal = new bootstrap.Modal(document.getElementById('winnerModal'));
    //         winnerModal.show();
    //             $('#player2Modal').hide();
    //             $('#player1Modal').hide();
    //     } else if (userScore > pcScore) {
    //         $('#userScore').addClass('winner');

    //         var winnerInfo = localStorage.getItem('playerName') + " won with a total score of " + userScore + ".";
    //         document.getElementById('winnerInfo').textContent = winnerInfo;
    //         var winnerModal = new bootstrap.Modal(document.getElementById('winnerModal'));
    //         winnerModal.show();
    //         $('#player2Modal').hide();
    //         $('#player1Modal').hide();
    //     } else {
    //         $('.scores').addClass('winner');
    //     }
    //     var confettiSettings = {"target":"my-canvas","max":"500","size":"2","animate":true,"props":["circle","square","triangle","line"],"colors":[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],"clock":"25","rotate":true,"width":"1920","height":"945","start_from_edge":true,"respawn":true};
    //     var confetti = new ConfettiGenerator(confettiSettings);
    //     confetti.render();
    // }
}

function endOfScoringAsYouGo(){
    if(!spiral2DArr.length) {
        $('#scoreBtn').hide();
        $('#restartBtn').show();
        if (pcScore > userScore) {
            $('#pcScore').addClass('winner');

            var winnerInfo = localStorage.getItem('playerName2') + " won with a total score of " + pcScore + ".";
            document.getElementById('winnerInfo').textContent = winnerInfo;
            var winnerModal = new bootstrap.Modal(document.getElementById('winnerModal'));
            winnerModal.show();
                $('#player2Modal').hide();
                $('#player1Modal').hide();
        } else if (userScore > pcScore) {
            $('#userScore').addClass('winner');

            var winnerInfo = localStorage.getItem('playerName') + " won with a total score of " + userScore + ".";
            document.getElementById('winnerInfo').textContent = winnerInfo;
            var winnerModal = new bootstrap.Modal(document.getElementById('winnerModal'));
            winnerModal.show();
            $('#player2Modal').hide();
            $('#player1Modal').hide();
        } else {
            $('.scores').addClass('winner');
        }
        var confettiSettings = {"target":"my-canvas","max":"500","size":"2","animate":true,"props":["circle","square","triangle","line"],"colors":[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],"clock":"25","rotate":true,"width":"1920","height":"945","start_from_edge":true,"respawn":true};
        var confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
    }
}

function calculateManaullyScoreAtEnd(){

    $('#mainModal').show();


}

function showGrid() {
    // Close all modals
    $('#mainModal').hide();
    $('#show_forend').show();
    // Show the grid (implement your grid logic here)
    console.log("Grid shown!");
}

// Function to initiate the process of claiming scores
function claimScores() {
    // Close all modals
    $('#mainModal').hide(); 

    // Show the modal for player 1 to claim score
    var player1Modal = new bootstrap.Modal(document.getElementById('player1Modal'));
    player1Modal.show();
    $('#player1ModalLabel').text(localStorage.getItem('playerName') + ': Claim Your Score');

}


// Function to handle the claim score process for player 1
function submitPlayer1Score() {
    //var player1Score = document.getElementById('player1Score').value;
    // Logic for player 1's score submission

    // Show the modal for player 2 to approve/reject
    $('player2ApprovalModal').show();
    
}

// Function to handle the approval/rejection process for player 2
// function approvePlayer2Score() {
//     var player2Score = document.getElementById('player2Score').value;
//     // Logic for player 2's approval/rejection

//     // Show the modal for player 2 to submit score
//     var player2Modal = new bootstrap.Modal(document.getElementById('player2Modal'));
//     player2Modal.show();
// }


// Function to create and shuffle a deck of cards
function createAndShuffleDeck() {
    const suits = ['H', 'D', 'C', 'S'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    // Create a deck of cards
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank}${suit}`);
        }
    }

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

function selectCenterCard() {
    document.querySelectorAll('.card-face-down')[12].innerHTML = `<img src="cards/${cardsArr[50]}.svg"/>`
    const position = spiral2DArr.shift();
    scoreCardsArr[position[0]][position[1]] = cardsArr[50];
}


function setDealerClass() {
    const cardsLength = document.querySelectorAll('.card-image').length
    if (cardsLength === 0) {
        document.querySelector('.pc-cards')?.classList.remove('active')
        document.querySelector('.user-cards')?.classList.remove('active')
        return
    }
    if (dealer) {
        document.querySelector('.user-cards')?.classList.add('active')
        document.querySelector('.pc-cards')?.classList.remove('active')
    } else {
        document.querySelector('.pc-cards')?.classList.add('active')
        document.querySelector('.user-cards')?.classList.remove('active')
    }
}



/*================  CALLS  ===================*/
pageInit();
/*================  CALLS ENDS  ===================*/

/*================   UTITILIY FUNCTIONS   ===================*/
function checkDealer() {
    if (!dealer) {
        setTimeout(() => {
            const pcCards = document.querySelector('.pc-cards');
            const pcCard = pcCards.querySelector('.card-image');
            const event = new Event('click');
            //pcCard.dispatchEvent(event);
        }, 1000)
    }
}

function showHideError() {
    const name = document.getElementById('playerName');    

    if (name.value === '') {
        document.getElementById('nameError').classList.add('show')
        name.classList.add('is-invalid');
    } else {
        name.classList.remove('is-invalid');
        document.getElementById('nameError').classList.remove('show');
    }
}

function showHideError2() {
    const name2 = document.getElementById('playerName2');    

    if (name2.value === '') {
        //document.getElementById('nameError2').classList.add('show')
        name2.classList.add('is-invalid');
    } else {
        name2.classList.remove('is-invalid');
        //document.getElementById('nameError2').classList.remove('show');
    }
}
function hideShowSection(showSection) {
    if (showSection === 'one') {
        document.getElementById('landingPage').style.display = 'flex';
        document.getElementById('gridContainer').style.display = 'none';
    } else if (showSection === 'two') {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('gridContainer').style.display = 'block';
        makeGrid();
    }
}

function clearData() {
    localStorage.removeItem('playerName');
    localStorage.removeItem('playerName2');

    localStorage.removeItem('dealerSelect');
    localStorage.removeItem('scoreCountSelect');
}

function setTheme(){
    const theme = JSON.parse(localStorage.getItem('theme'));
    if (theme === THEME.light || theme == null) {
        $('body').removeClass('dark');
    } else {
        $('body').addClass('dark');
    }
}

function setScore(){
        $('#userScore').html(userScore);
        $('#pcScore').html(pcScore);
}

/* =========== SCORES CALCULATION MANUALLY START=========== */


var player1Total = 0;
var player2Total = 0;
var current_Player = '';
function showAlert(message, type) {
    var alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-' + type;
    alertDiv.innerHTML = message;
    document.body.appendChild(alertDiv);
    setTimeout(function() {
        alertDiv.remove();
    }, 3000); // Remove the alert after 3 seconds
}
function showModal(modalId) {
    var modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

function claimScore(player) {
    

    if (player === 'player') {
        showModal('player1Modal');   
        $('#player1ModalLabel').text(localStorage.getItem('playerName') + ': Claim Your Score');
        attachPlayer1ScoreEventListener();    
        // var score = prompt("Player 1: Enter your score:");
        // var approval = confirm("Player 2: Do you approve Player 1's score of " + score + "?");

        // if (approval) {
        //     showAlert("Score approved! Adding " + score + " to Player 1's total.", 'success');
        //     player1Total += parseInt(score);
        //     userScore += parseInt(score);
        //     setScore();
        //     console.log('player1Total ' + player1Total);
        //     console.log('userScore ' + userScore);
        //     hideModal('player1Modal');
        // } else {
        //     var reason = prompt("Enter reason for rejection (optional):");
        //     showAlert("Player 2 rejected Player 1's score with reason: " + reason, 'danger');
        //     claimScore(1); // Player 1 needs to claim score again
        // }
    } else if (player === 'pc') {
        showModal('player2Modal');
        $('#player2ModalLabel').text(localStorage.getItem('playerName2') + ': Claim Your Score');
        attachPlayer2ScoreEventListener();

        //var score = document.getElementById('player2Score').value;
        //document.getElementById('messageText').innerHTML = "Player 1: Do you approve Player 2's score of " + score + "?";
        // var score = prompt("Player 2: Enter your score:");
        // var approval = confirm("Player 1: Do you approve Player 2's score of " + score + "?");

        // if (approval) {
        //     showAlert("Score approved! Adding " + score + " to Player 2's total.", 'success');
        //     player2Total += parseInt(score);
        //     pcScore += parseInt(score);
        //     setScore();
        //     console.log('player2Total ' + player2Total);
        //     console.log('pcScore ' + pcScore);
        // } else {
        //     var reason = prompt("Enter reason for rejection (optional):");
        //     showAlert("Player 1 rejected Player 2's score with reason: " + reason, 'danger');
        //     claimScore(2); // Player 2 needs to claim score again
        // }
    }

}


function submitScore(player) {

   

    current_Player = player;
    if (player === 'player') {
        $('#player1Modal').hide();
        showModal('messageModal');
        var score = document.getElementById('player1Score').value;
        document.getElementById('messageText').innerHTML = localStorage.getItem('playerName2') + ": Do you approve "+localStorage.getItem('playerName') +"'s score of " + score + "?";
    } else if (player === 'pc') {
        $('#player2Modal').hide();
        showModal('messageModal');
        var score = document.getElementById('player2Score').value;
        document.getElementById('messageText').innerHTML = localStorage.getItem('playerName')  + ": Do you approve "+localStorage.getItem('playerName2') +"'s score of " + score + "?";
    }
}

// var scoreCountEndApproval1 = 0;
 var scoreCountEndApproval2 = 0;

function approveScore() {
    var score = document.getElementById(current_Player === 'player' ? 'player1Score' : 'player2Score').value;
    if (current_Player === 'player') {
        player1Total += parseInt(score, 10);
        document.getElementById('player1Score').value = '0';
        userScore += parseInt(score);
        setScore();
        console.log('player1Total ' + player1Total);
        console.log('userScore ' + userScore);   
        $('#rejected_player2_reason,#rejected_player1_reason').text('')     ;

        // console.log('scoreCountEnd ' + scoreCountEnd);
  
        // if(scoreCountEnd){
        //     // $('#player1Modal').hide();
        //     // $('#player2Modal').show();
        //     //$('.scores').show();
        // }
        
    } else {
        player2Total += parseInt(score, 10);
        document.getElementById('player2Score').value = '0';
        pcScore += parseInt(score);
        setScore();
        console.log('player2Total ' + player2Total);
        console.log('pcScore ' + pcScore);
        // console.log('scoreCountEnd ' + scoreCountEnd);

        $('#rejected_player2_reason,#rejected_player1_reason').text('')        ;
        if(scoreCountEnd ){
            //$('#player2Modal').hide();
            //$('#player1Modal').show();            
            $('.scores').show();
            //endOfScoringAsYouGo();
        }
    }
    $('#messageModal .modal-footer').hide();
    var message = "Score approved! Adding " + score + " to " + (current_Player === 'player' ? "Player 1's" : "Player 2's") + " total.";
    document.getElementById('messageText').innerHTML = message;
    setTimeout(function() {
        $('#messageModal').hide();
        $('.modal').modal('hide');
        $('.modal-backdrop').remove();
        $('#messageModal .modal-footer').show();

        if(scoreCountEnd == false){
        endOfScoringAsYouGo();
        }
        scoreCountEndApproval2++;
        if(scoreCountEnd &&  scoreCountEndApproval2 == 1 ){
         
            $('#player2Modal').show();
                   $('#player2ModalLabel').text(localStorage.getItem('playerName2') + ': Claim Your Score');

        }
        console.log('scoreCountEndApproval2 ' + scoreCountEndApproval2) ;
        if(scoreCountEnd &&  scoreCountEndApproval2 > 1 ){
         
            endOfScoringAsYouGo();
            scoreCountEndApproval2++;
        }

    }, 2000); // Hide the modal after 2 seconds
}

function rejectScore() {
    var reason = prompt("Enter reason for rejection (optional):");    
    //document.getElementById('messageText').innerHTML = message;
  
    setTimeout(function() {
        if (current_Player === 'player') {
            $('#messageModal').hide();
            var message = localStorage.getItem('playerName2') + " rejected "+localStorage.getItem('playerName') +"'s score with reason: " + reason;
            showModal('player1Modal');
            $('#rejected_player1_reason').text(message);
        } else {
            $('#messageModal').hide();
            var message = localStorage.getItem('playerName') + " rejected "+localStorage.getItem('playerName2') +"'s score with reason: " + reason;
            showModal('player2Modal');
            $('#rejected_player2_reason').text(message);
        }
    }, 2000); // Show respective modal after 2 seconds
}

function calculateScoreManually(type){
    setTimeout(function(){

    },1000);
    //claimScore(type);
    console.log('type ' + type);
    //console.log('type ' + USER.pc);
    if( type == "pc" ){

        claimScore('pc'); // Start with Player 1's turn
        

    }else{
        claimScore('player'); // Start with Player 1's turn


    }
   

  

}

/* =========== SCORES CALCULATION MANUALLY END=========== */
/* =========== SCORES CALCULATION =========== */
function calculateScore(row, col, type) {
    let score = 0;


    let prialScore = isPrial(row, col, scoreCardsArr);
    if (prialScore > 0) {
        score = prialScore;
    } else {
        score += isPair(row, col, scoreCardsArr);
    }

    // Check for sequence
    score += getSequenceScore(row, col, scoreCardsArr);

    // Check for flush
    score += getFlushScore(row, col, scoreCardsArr);

    type === USER.pc ? pcScore += score : userScore += score;
    // console.log('PC Score', pcScore);
    // console.log('User Score', userScore);
    setScore();
}


// 0:(5) ['JH', 'KS', 'AD', '2D', '2C']
// 1:(5) ['5S', '5C', '8H', '7D', 'QH']
// 2:(5) ['3H', 'KC', '10S', '8D', 'JS']
// 3:(5) ['8S', '10C', 'KD', 'AS', '10D']
// 4:(5) ['7S', '10H', '8C', '6D', '7H']

function isPair(row, col, grid) {
    let score = 0;

    // Get the value of the current card
    let currentValue = grid[row][col].slice(0, -1); // Remove the last character (category)

    // Check left
    if (col > 0) {
        let leftValue = grid[row][col - 1].slice(0, -1);
        if (leftValue === currentValue) {
            score += 2;
        }
    }

    // Check right
    if (col < grid[0].length - 1) {
        let rightValue = grid[row][col + 1].slice(0, -1);
        if (rightValue === currentValue) {
            score += 2;
        }
    }

    // Check top
    if (row > 0) {
        let topValue = grid[row - 1][col].slice(0, -1);
        if (topValue === currentValue) {
            score += 2;
        }
    }

    // Check bottom
    if (row < grid.length - 1) {
        let bottomValue = grid[row + 1][col].slice(0, -1);
        if (bottomValue === currentValue) {
            score += 2;
        }
    }

    return score;
}

function isPrial(row, col, grid) {
    let score = 0;

    // Get the value of the current card
    let currentValue = grid[row][col].slice(0, -1); // Remove the last character (category)

    // Check left
    if (col > 1) {
        let left1Value = grid[row][col - 1].slice(0, -1);
        let left2Value = grid[row][col - 2].slice(0, -1);
        if (left1Value === currentValue && left2Value === currentValue) {
            score += 6;
        }
    }

    // Check right
    if (col < grid[0].length - 2) {
        let right1Value = grid[row][col + 1].slice(0, -1);
        let right2Value = grid[row][col + 2].slice(0, -1);
        if (right1Value === currentValue && right2Value === currentValue) {
            score += 6;
        }
    }

    // Check top
    if (row > 1) {
        let top1Value = grid[row - 1][col].slice(0, -1);
        let top2Value = grid[row - 2][col].slice(0, -1);
        if (top1Value === currentValue && top2Value === currentValue) {
            score += 6;
        }
    }

    // Check bottom
    if (row < grid.length - 2) {
        let bottom1Value = grid[row + 1][col].slice(0, -1);
        let bottom2Value = grid[row + 2][col].slice(0, -1);
        if (bottom1Value === currentValue && bottom2Value === currentValue) {
            score += 6;
        }
    }

    return score;
}


function getSequenceScore(row, col, grid) {
    let score = 0;

    // Get the values of the current card and its adjacent cards
    // let currentValue = grid[row][col].slice(0, -1); // Remove the last character (category)
    // let left1Value = col > 0 ? grid[row][col - 1].slice(0, -1) : null;
    // let left2Value = col > 1 ? grid[row][col - 2].slice(0, -1) : null;
    // let right1Value = col < grid[0].length - 1 ? grid[row][col + 1].slice(0, -1) : null;
    // let right2Value = col < grid[0].length - 2 ? grid[row][col + 2].slice(0, -1) : null;
    // let top1Value = row > 0 ? grid[row - 1][col].slice(0, -1) : null;
    // let top2Value = row > 1 ? grid[row - 2][col].slice(0, -1) : null;
    // let bottom1Value = row < grid.length - 1 ? grid[row + 1][col].slice(0, -1) : null;
    // let bottom2Value = row < grid.length - 2 ? grid[row + 2][col].slice(0, -1) : null;

    let rowValues = [];
    let colValues = [];


    for (let i = 0; i < grid.length; i++) {
        colValues.push(grid[i][col].slice(0, -1));
        rowValues.push(grid[row][i].slice(0, -1));
    }

    rowValues = rowValues.filter(e => e !== '').sort(function(a, b) {
        return cardValue(a) - cardValue(b);
    });
    colValues = colValues.filter(e => e !== '').sort(function(a, b) {
        return cardValue(a) - cardValue(b);
    });

    const rowStr = rowValues.join('');
    const colStr = colValues.join('');

    if(SAMPLE_STRING.includes(rowStr)) {
        score += rowValues.length >= 3 ? rowValues.length : 0;
    }
    if(SAMPLE_STRING.includes(colStr)) {
        score += colValues.length >= 3 ? colValues.length : 0;
    }

    return score;
}

function getFlushScore(row, col, grid) {
    let score = 0;

    function allCharactersSame(str) {
        for (let i = 1; i < str.length; i++) {
            if (str[i] !== str[0]) {
                return false;
            }
        }
        return true;
    }

    let rowValues = [];
    let colValues = [];

    for (let i = 0; i < grid.length; i++) {
        colValues.push(grid[i][col].charAt(grid[i][col].length - 1));
        rowValues.push(grid[row][i].charAt(grid[row][i].length - 1));
    }

    rowValues = rowValues.filter(e => e !== '')
    colValues = colValues.filter(e => e !== '')

    const rowStr = rowValues.join('');
    const colStr = colValues.join('');

    if(rowStr.length >= 3) {
        score += allCharactersSame(rowStr) ? rowStr.length : 0;
    }
    if(colStr.length >= 3) {
        score += allCharactersSame(colStr) ? colStr.length : 0;
    }
    // console.log('row',rowStr)
    // console.log('col',colStr)

    return score;
}


function sortDeckCards(cards) {
    // console.log(cards);
    const sortedCards = JSON.parse(JSON.stringify(cards));
    return sortedCards.sort(function(a, b) {
        return cardValue(a) - cardValue(b);
    })
}

function cardValue(card) {
    if (card === 'A') {
        return 14; // Ace has the highest value
    } else if (card === 'K') {
        return 13;
    } else if (card === 'Q') {
        return 12;
    } else if (card === 'J') {
        return 11;
    } else {
        return card;
    }
}

/*============== CALCULATE SCORES AT END =============== */
function calculateScoreAtEnd() {

    const flushScore = getFlushScoreEnd(scoreCardsArr);
    const pairAndPrialScore = getPairAndPrialScoreEnd(scoreCardsArr);
    const sequenceScore = getSequenceScoreEnd(scoreCardsArr);

    console.log(flushScore);
    console.log(pairAndPrialScore);
    console.log(sequenceScore);

    if (currentPlayer === DEALER.player1) {
        // debugger;
        userScore += flushScore.colScore;
        pcScore += flushScore.rowScore;
        userScore += pairAndPrialScore.colScore;
        pcScore += pairAndPrialScore.rowScore;
        userScore += sequenceScore.colScore;
        pcScore += sequenceScore.rowScore;
    } else {
        // debugger
        userScore += flushScore.rowScore;
        pcScore += flushScore.colScore;
        userScore += pairAndPrialScore.rowScore;
        pcScore += pairAndPrialScore.colScore;
        userScore += sequenceScore.rowScore;
        pcScore += sequenceScore.colScore;
    }
     // === USER.pc ? pcScore += score : userScore += score;
    // console.log('PC Score', pcScore);
    // console.log('User Score', userScore);
    $('.scores').show();
    setScore();
}

function getSequenceScoreEnd(grid) {
    const scores = {
        rowScore: 0,
        colScore: 0
    }
    let firstCharArr = [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ];

    function isSequence(cards) {
        const elements = JSON.parse(JSON.stringify(cards));
        // console.log(elements)
        const pattern5 = sortDeckCards([...elements]).join('');
        const pattern4A = sortDeckCards(elements.slice(0, -1)).join('');
        const pattern4B = sortDeckCards(elements.slice(1)).join('');
        const pattern3A = sortDeckCards(elements.slice(0, 3)).join('');
        const pattern3B = sortDeckCards(elements.slice(1, 4)).join('');
        const pattern3C = sortDeckCards(elements.slice(2, 5)).join('');

        // console.log('Pattern5 = ', pattern5);
        // console.log('Pattern4A = ', pattern4A);
        // console.log('Pattern4B = ', pattern4B);
        // console.log('Pattern3A = ', pattern3A);
        // console.log('Pattern3B = ', pattern3B);
        // console.log('Pattern3C = ', pattern3C);

        const sequence5Exist = SAMPLE_STRING.includes(pattern5);

        if(!sequence5Exist) {
            const sequence4Exist = SAMPLE_STRING.includes(pattern4A) || SAMPLE_STRING.includes(pattern4B);

            if (!sequence4Exist) {
                const sequence3Exist = SAMPLE_STRING.includes(pattern3A) || SAMPLE_STRING.includes(pattern3B) || SAMPLE_STRING.includes(pattern3C);
                if(!sequence3Exist) {
                    // console.log(0);
                    return 0;
                } else {
                    return 3;
                }
            } else {
                // console.log(4);
                return 4;
            }
        } else {
            // console.log(5)
            return 5;
        }

    }

    for (let i=0; i<5; i++) {
        for (let j=0; j<5; j++) {
            firstCharArr[i][j] = scoreCardsArr[i][j].slice(0, - 1);
        }
    }

    for (let i=0; i<5; i++) {
        let arrRow = [];
        let arrCol = [];
        for (let j=0; j<5; j++) {
            arrRow.push(firstCharArr[i][j]);
            arrCol.push(firstCharArr[j][i]);
        }
        scores.rowScore += isSequence(arrRow);
        scores.colScore += isSequence(arrCol);
    }

    // for (let i=0; i<5; i++) {
    //     let repeatedRow = 1;
    //     let repeatedCol = 1;
    //     for (let j=0; j<4; j++) {
    //         if (firstCharArr[i][j] === firstCharArr[i][j + 1]) {
    //             repeatedRow++;
    //         }
    //         if (firstCharArr[j][i] === firstCharArr[j + 1][i]) {
    //             repeatedCol++;
    //         }
    //     }
    //
    //     repeatedRow >= 3 ? score += repeatedRow : score = score;
    //     repeatedCol >= 3 ? score += repeatedCol : score = score;
    //     // console.log('Repeated Row', repeatedRow);
    //     // console.log('Repeated Col', repeatedCol);
    // }

    // console.log(firstCharArr);
    return scores;
}

function getPairAndPrialScoreEnd(grid) {
    let rowScore = 0;
    let colScore = 0;
    let firstCharArr = [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ];

    for (let i=0; i<5; i++) {
        for (let j=0; j<5; j++) {
            firstCharArr[i][j] = scoreCardsArr[i][j].slice(0, - 1);
        }
    }

    // console.log(firstCharArr);

    for (let i=0; i<5; i++) {
        let repeatedRow = 1;
        let repeatedCol = 1;
        for (let j=0; j<4; j++) {
            if (firstCharArr[i][j] === firstCharArr[i][j + 1]) {
                repeatedRow++;
            } else {
                repeatedRow === 3 ? rowScore += 3 : repeatedRow === 2 ? rowScore += 2 : '';
                repeatedRow = 1;
            }
            if (firstCharArr[j][i] === firstCharArr[j + 1][i]) {
                repeatedCol++;
            } else {
                repeatedCol === 3 ? colScore += 3 : repeatedCol === 2 ? colScore += 2 : '';
                repeatedCol = 1;
            }
        }

        // console.log(`Row ${i + 1} = `, repeatedRow);
        // console.log(`Col ${i + 1} = `, repeatedCol);
        repeatedRow >= 2 ? rowScore += repeatedRow : rowScore = rowScore;
        repeatedCol >= 2 ? colScore += repeatedCol : colScore = colScore;
    }

    return {
        rowScore: rowScore,
        colScore: colScore
    };
}
function getFlushScoreEnd(grid) {
    let rowScore = 0;
    let colScore = 0;
    let firstCharArr = [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ];

    for (let i=0; i<5; i++) {
        for (let j=0; j<5; j++) {
            firstCharArr[i][j] = grid[i][j].charAt(grid[i][j].length - 1);
        }
    }

    for (let i=0; i<5; i++) {
        let repeatedRow = 1;
        let repeatedCol = 1;
        for (let j=0; j<4; j++) {
            if (firstCharArr[i][j] === firstCharArr[i][j + 1]) {
                repeatedRow++;
            } else {
                repeatedRow < 3 ? repeatedRow = 1 : '';
            }
            if (firstCharArr[j][i] === firstCharArr[j + 1][i]) {
                repeatedCol++;
            } else {
                repeatedCol < 3 ? repeatedCol = 1 : '';
            }
        }

        repeatedRow >= 3 ? rowScore += repeatedRow : rowScore = rowScore;
        repeatedCol >= 3 ? colScore += repeatedCol : colScore = colScore;
    }

    return {
        rowScore: rowScore,
        colScore: colScore
    };
}
/*============== CALCULATE SCORES AT END =============== */

function restartGame() {
    window.location.reload();
}

