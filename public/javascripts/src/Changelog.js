class Changelog {
  #backbtn = document.querySelector(".changelog-footer .btn-back");
  #openbtn = document.querySelector(".btn-container .btn-changelog");

  #menucontainer = document.querySelector(".menu-container");
  #changelogcontainer = document.querySelector(".changelog-container");

  constructor() {
    this.#openbtn.addEventListener("click", () => {
      this.#changelogcontainer.classList.remove("hidden");
      this.#menucontainer.classList.add("hidden");
    });

    this.#backbtn.addEventListener("click", () => {
      this.#changelogcontainer.classList.add("hidden");
      this.#menucontainer.classList.remove("hidden");
    });
  }
}