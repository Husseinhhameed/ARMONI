const game = { timer: 0, start: null };

// Create Message Element
const message = document.createElement("div");
message.classList.add("message");
message.textContent = "Press To Start";
document.body.prepend(message);

// Create a Box
const box = document.createElement("div");
box.classList.add("box");

const output = document.querySelector(".output");
output.append(box);

box.addEventListener("click", () => {
  box.textContent = "";
  box.style.display = "none";
  game.timer = setTimeout(addBox, randomNumbers(3000));
  if (!game.start) {
    message.textContent = "Watch for element and click it";
  } else {
    const current = new Date().getTime();
    const duration = (current - game.start) / 1000;
    message.textContent = `It took ${duration} seconds to click`;
  }
});

function randomNumbers(max) {
  return Math.floor(Math.random() * max);
}

function addBox() {
  game.start = new Date().getTime();
  const dim = [randomNumbers(100) + 50, randomNumbers(100) + 50]; // Increased size range
  box.style.display = "block";
  box.style.width = `${dim[0]}px`;
  box.style.height = `${dim[1]}px`;
  box.style.backgroundColor = "#" + Math.random().toString(16).substr(-6);
  box.style.left = randomNumbers(window.innerWidth - dim[0]) + "px"; // Use window.innerWidth
  box.style.top = randomNumbers(window.innerHeight - dim[1]) + "px"; // Use window.innerHeight
  box.style.borderRadius = randomNumbers(50) + "%";
}
