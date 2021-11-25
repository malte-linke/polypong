module.exports = {
  genID: (IDLength) => {

    let id = "";

    for (let i = 0; i < IDLength; i++) {
      id += Math.round(Math.random() * 9);
    }

    return id;
  }
}