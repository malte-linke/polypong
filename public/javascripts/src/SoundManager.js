

class SoundManager{
  constructor(){
    this.currentlyPlaying = null;

    this.sounds = [];

    //this.sounds.push({name: "enemy_hit", audio: new Howl({src: ["/sounds/enemy_hit.wav"]})});
    //this.sounds.push({name: "player_hit", audio: new Howl({src: ["/sounds/player_hit.wav"]})});
  }

  play(sound){
    //this.sounds.find(s => s.name == sound)?.audio?.play(); // Play sound if found
    //this.sounds.filter(s => s.name != sound).forEach(s => s.audio.stop()); // Stop all other sounds
  }
}
  