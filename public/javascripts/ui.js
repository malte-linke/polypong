class UI{
  constructor(){
    this.hostBtn = document.querySelector('.btn-host');
    this.joinBtn = document.querySelector('.btn-join');
    this.joinInput = document.querySelector('.input-join');
    this.backBtn = document.querySelector('.btn-back');
    this.gameStatusText = document.querySelector('.game-status-text');

    this.pregameUIContainer = document.querySelector(".pregame-ui-container");

    this.currentState = "landing";

    this.joinBtn.addEventListener('click', (e) => this.joinBtnHandler(e));
    this.hostBtn.addEventListener('click', this.hostBtnHandler);
    this.backBtn.addEventListener('click', this.backBtnHandler);

    console.log(this.joinBtn);
  }

  joinBtnHandler(e){
    console.log("t");
    if(currentState == "landing") setNameState("join");
    else if(currentState == "name-join") setJoinState();
    else if(currentState == "name-host") setHostState();
    else if(currentState == "join") findGame(joinInput.value);
  }

  hostBtnHandler(e){
    if(currentState == "landing") setNameState("host");
  }

  backBtnHandler(){
    setLandingState();
  }

  findGame(gID){
    net.joinGame(gID);
  }
  
  
  setLandingState(){
    hostBtn.style.display = "inline";
    joinInput.style.display = "none";
    joinBtn.style.margin = "0 5vw 0 5vw";
    backBtn.style.display = "none";
    gameStatusText.style.visibility = "hidden";
    joinBtn.innerHTML = "Join";
    hostBtn.innerHTML = "Host";
    currentState = "landing";
  }
  
  setNameState(suffix){
    hostBtn.style.display = "none";
    joinInput.style.display = "inline";
    joinBtn.style.margin = "0 5vw 0 0";
    backBtn.style.display = "inline";
  
    joinInput.placeholder = "Enter Username";
    joinInput.value = getCookie("username");
    joinBtn.innerHTML = "Submit";
  
    currentState = "name-" + suffix;
  }
  
  setJoinState(){
  
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
  
  setHostState(){
  
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
  
  setGameFoundState(){
    gameStatusText.style.visibility = "visible";
    gameStatusText.innerHTML = "Joining game...";
    //TODO: after server response and game found
    gameStatusText.innerHTML = "Game Found!";
  
    joinInput.placeholder = "Enter Username";
  
    currentState = "gameFound";
  }
}



