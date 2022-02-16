var leftBtn = document.querySelector("button.btn-mobile-left");
var rightBtn = document.querySelector("button.btn-mobile-right");

leftBtn.addEventListener("touchstart", e => {
  e.preventDefault(); // prevent scrolling and opening the context menu

  // simulate keydown
  document.dispatchEvent(new KeyboardEvent("keydown", {key: "a"}));
});
leftBtn.addEventListener("touchend", e => {
  e.preventDefault(); // prevent scrolling and opening the context menu

  // simulate keyup
  document.dispatchEvent(new KeyboardEvent("keyup", {key: "a"}));
});

rightBtn.addEventListener("touchstart", e => {
  e.preventDefault(); // prevent scrolling and opening the context menu

  // simulate keydown
  document.dispatchEvent(new KeyboardEvent("keydown", {key: "d"}));
});
rightBtn.addEventListener("touchend", e => {
  e.preventDefault(); // prevent scrolling and opening the context menu

  // simulate keyup
  document.dispatchEvent(new KeyboardEvent("keyup", {key: "d"}));
});