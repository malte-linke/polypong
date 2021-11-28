let hostBtn = document.querySelector('.btn-host');
let joinBtn = document.querySelector('.btn-join');
let joinInput = document.querySelector('.input-join');
let backBtn = document.querySelector('.btn-back');
let gameStatusText = document.querySelector('.game-status-text');


let currentState = "landing";


joinBtn.addEventListener('click', function(e) {
  if(currentState == "landing") setNameState("join");
  else if(currentState == "name-join") setJoinState();
  else if(currentState == "name-host") setHostState();
  else if(currentState == "join") setGameFoundState(); //TODO: ask if game exists
  else if(currentState == "gameFound") {} //TODO: send server join request with username
});


hostBtn.addEventListener('click', function(e) {
  if(currentState == "landing") setNameState("host");
});


backBtn.addEventListener('click', function(e) {
  setLandingState();
});



function setLandingState(){
  hostBtn.style.display = "inline";
  joinInput.style.display = "none";
  joinBtn.style.margin = "0 5vw 0 5vw";
  backBtn.style.display = "none";
  gameStatusText.style.visibility = "hidden";
  joinBtn.innerHTML = "Join";
  hostBtn.innerHTML = "Host";
  currentState = "landing";
}

function setNameState(suffix){
  hostBtn.style.display = "none";
  joinInput.style.display = "inline";
  joinBtn.style.margin = "0 5vw 0 0";
  backBtn.style.display = "inline";

  joinInput.placeholder = "Enter Username";
  joinInput.value = getCookie("username");
  joinBtn.innerHTML = "Submit";

  currentState = "name-" + suffix;
}

function setJoinState(){

  if(joinInput.value.length < 4){
    gameStatusText.innerHTML = "Name Is Too Short";
    gameStatusText.style.visibility = "visible";
    return;
  }
  
  gameStatusText.style.visibility = "hidden";

  setCookie("username", joinInput.value, 1);

  hostBtn.style.display = "none";
  joinInput.style.display = "inline";
  joinBtn.style.margin = "0 5vw 0 0";
  backBtn.style.display = "inline";

  joinInput.placeholder = "Enter room code";
  joinInput.value = "";
  joinBtn.innerHTML = "Join";

  currentState = "join";
}

function setHostState(){

  if(joinInput.value.length < 4){
    gameStatusText.innerHTML = "Name Is Too Short";
    gameStatusText.style.visibility = "visible";
    return;
  }
  
  gameStatusText.style.visibility = "hidden";

  setCookie("username", joinInput.value, 1);

  hostBtn.style.display = "none";
  joinInput.style.display = "inline";
  joinBtn.style.margin = "0 5vw 0 0";
  backBtn.style.display = "inline";

  joinInput.placeholder = "Enter Lobby Name";
  joinInput.value = "";
  joinBtn.innerHTML = "Host";

  currentState = "host";
}

function setGameFoundState(){
  gameStatusText.style.visibility = "visible";
  gameStatusText.innerHTML = "Joining game...";
  //TODO: after server response and game found
  gameStatusText.innerHTML = "Game Found!";

  joinInput.placeholder = "Enter Username";

  currentState = "gameFound";
}