class UI{
  constructor(net){
    this.hostBtn = document.querySelector('.btn-host');
    this.joinBtn = document.querySelector('.btn-join');
    this.joinInput = document.querySelector('.input-join');
    this.backBtn = document.querySelector('.btn-back');
    this.gameStatusText = document.querySelector('.game-status-text');
    this.canvasContainer = document.querySelector(".canvas-container");

    this.pregameUIContainer = document.querySelector(".pregame-ui-container");

    this.currentState = "landing";

    this.joinBtn.addEventListener('click', this.joinBtnHandler.bind(this));
    this.hostBtn.addEventListener('click', this.hostBtnHandler.bind(this));
    this.backBtn.addEventListener('click', this.backBtnHandler.bind(this));

    this.net = net;
  }

  joinBtnHandler(e){
    if(this.currentState == "landing") this.setNameState("join");
    else if(this.currentState == "name-join") this.setJoinState();
    else if(this.currentState == "name-host") this.setHostState();
    else if(this.currentState == "join") this.findGame(this.joinInput.value);
    else if(this.currentState == "host") this.hostGame(this.joinInput.value);
  }

  hostBtnHandler(e){
    if(this.currentState == "landing") this.setNameState("host");
  }

  backBtnHandler(){
    this.setLandingState();
  }

  findGame(gID){
    net.joinGame(gID);
  }

  hostGame(gID){
    net.createGame(gID);
  }
  
  setLandingState(){
    this.hostBtn.style.display = "inline";
    this.joinInput.style.display = "none";
    this.joinBtn.style.margin = "0 5vw 0 5vw";
    this.backBtn.style.display = "none";
    this.gameStatusText.style.visibility = "hidden";
    this.joinBtn.innerHTML = "Join";
    this.hostBtn.innerHTML = "Host";
    this.currentState = "landing";
  }
  
  setNameState(suffix){
    this.hostBtn.style.display = "none";
    this.joinInput.style.display = "inline";
    this.joinBtn.style.margin = "0 5vw 0 0";
    this.backBtn.style.display = "inline";
  
    this.joinInput.placeholder = "Enter Username";
    this.joinInput.value = Cookies.get("username");
    this.joinBtn.innerHTML = "Submit";
  
    this.currentState = "name-" + suffix;
  }
  
  setJoinState(){
  
    if(this.joinInput.value.length < 4){
      this.gameStatusText.innerHTML = "Name Is Too Short";
      this.gameStatusText.style.visibility = "visible";
      return;
    }
    
    this.gameStatusText.style.visibility = "hidden";

    Cookies.set("username", this.joinInput.value, 1);
  
    this.hostBtn.style.display = "none";
    this.joinInput.style.display = "inline";
    this.joinBtn.style.margin = "0 5vw 0 0";
    this.backBtn.style.display = "inline";
  
    this.joinInput.placeholder = "Enter room code";
    this.joinInput.value = "";
    this.joinBtn.innerHTML = "Join";
  
    this.currentState = "join";
  }
  
  setHostState(){
  
    if(this.joinInput.value.length < 4){
      this.gameStatusText.innerHTML = "Name Is Too Short";
      this.gameStatusText.style.visibility = "visible";
      return;
    }
    
    this.gameStatusText.style.visibility = "hidden";
  
    Cookies.set("username", this.joinInput.value, 1);
  
    this.hostBtn.style.display = "none";
    this.joinInput.style.display = "inline";
    this.joinBtn.style.margin = "0 5vw 0 0";
    this.backBtn.style.display = "inline";
  
    this.joinInput.placeholder = "Enter Lobby Name";
    this.joinInput.value = "";
    this.joinBtn.innerHTML = "Host";
  
    this.currentState = "host";
  }
  
  setGameFoundState(){
    this.gameStatusText.style.visibility = "visible";
    this.gameStatusText.innerHTML = "Joining game...";
    //TODO: after server response and game found
    this.gameStatusText.innerHTML = "Game Found!";
  
    this.joinInput.placeholder = "Enter Username";
  
    this.currentState = "gameFound";
  }

  setLobbyState(){
    this.pregameUIContainer.style.display = "none";
    this.canvasContainer.style.display = "grid";
    this.currentState = "lobby";
  }
}



