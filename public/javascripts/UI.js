class UI{
  constructor(net){
    this.hostBtn = document.querySelector('.btn-host');
    this.joinBtn = document.querySelector('.btn-join');
    this.joinInput = document.querySelector('.input-join');
    this.backBtn = document.querySelector('.btn-back');
    this.gameStatusText = document.querySelector('.game-status-text');
    this.canvasContainer = document.querySelector(".canvas-container");

    this.pregameUIContainer = document.querySelector(".pregame-ui-container");


    this.setLandingState();
  }

  joinBtnHandler(e){
    if(this.currentState == "landing") this.setNameState("join");
    else if(this.currentState == "name-join") this.setJoinState(this.joinInput.value);
    else if(this.currentState == "name-host") this.setHostState(this.joinInput.value);
    else if(this.currentState == "join") this.findGame(this.joinInput.value);
    else if(this.currentState == "host") this.hostGame(this.joinInput.value);
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

    this.backBtn.onclick = this.setLandingState.bind(this);
    this.hostBtn.onclick = this.setNameState.bind(this, "host");
    this.joinBtn.onclick = this.setNameState.bind(this, "join");
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

    this.backBtn.onclick = this.setLandingState.bind(this);
    this.joinBtn.onclick = () => net.changeName(this.joinInput.value);
  }
  
  setJoinState(){
        
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

    this.backBtn.onclick = this.setLandingState.bind(this);
    this.joinBtn.onclick = () => net.joinGame(this.joinInput.value);
  }
  
  setHostState(){
  
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

    this.backBtn.onclick = this.setLandingState.bind(this);
    this.joinBtn.onclick = () => net.createGame(this.joinInput.value);
  }


  setLobbyState(){
    this.pregameUIContainer.style.display = "none";
    this.canvasContainer.style.display = "grid";
    this.currentState = "lobby";
  }


  changeNameResult(result){
    this.gameStatusText.style.visibility = "hidden";

    if(!result.successful){
      this.gameStatusText.innerHTML = result.reason;
      this.gameStatusText.style.visibility = "visible";
      return;
    }

    if(this.currentState == "name-join") this.setJoinState();
    else if(this.currentState == "name-host") this.setHostState();
  }

  joinGameResult(result){
    if(!result.successful){
      this.gameStatusText.innerHTML = result.reason;
      this.gameStatusText.style.visibility = "visible";
      return;
    }

    this.setLobbyState();
  }

  hostGameResult(result){
    if(!result.successful) {
      this.gameStatusText.innerHTML = result.reason;
      this.gameStatusText.style.visibility = "visible";
      return;
    }

    this.setLobbyState();
  }
}



