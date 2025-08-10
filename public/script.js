const socket = io();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const sizeSlider = document.getElementById("penSize");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");


let currentColor = "#000000";
let penSize = 10;
let isDrawing = false;
let lastPos = null;

// ===== 🎨 Drawing =====
function drawSquare(x, y, color, size) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

function drawAndEmit(x, y, color, size) {
  drawSquare(x, y, color, size);
  socket.emit("drawSquare", { x, y, color, size });
}

function drawLine(from, to, color, size) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const steps = Math.max(Math.abs(dx), Math.abs(dy)) / size;

  for (let i = 0; i <= steps; i++) {
    const x = Math.floor((from.x + (dx * i) / steps) / size) * size;
    const y = Math.floor((from.y + (dy * i) / steps) / size) * size;
    drawAndEmit(x, y, color, size);
  }
}

function handleLocalDraw(e) {
  const { x, y } = getMouseCoords(e);
  const currentPos = { x, y };

  if (lastPos) {
    drawLine(lastPos, currentPos, currentColor, penSize);
  } else {
    drawAndEmit(x, y, currentColor, penSize);
  }

  lastPos = currentPos;
}

function getMouseCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

// ===== 🖱️ Input Events =====
function startDrawing(e) {
  isDrawing = true;
  lastPos = null;
  handleLocalDraw(e);
}

function stopDrawing() {
  isDrawing = false;
  lastPos = null;
}

function handleMouseMove(e) {
  if (!isDrawing) return;
  handleLocalDraw(e);
}

function setupInputEvents() {
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);
  canvas.addEventListener("mousemove", handleMouseMove);

  colorPicker.addEventListener("input", () => {
    currentColor = colorPicker.value;
  });

  sizeSlider.addEventListener("input", () => {
    penSize = parseInt(sizeSlider.value);
  });
}

// ===== 🔌 Socket Events =====
function setupSocketEvents() {
  socket.on("drawSquare", (data) => {
    drawSquare(data.x, data.y, data.color, data.size);
  });

  socket.on("canvasState", (pixels) => {
    pixels.forEach(({ x, y, color, size }) => {
      drawSquare(x, y, color, size);
    });
  });
}

function addMessageToChat(message) {
  const el = document.createElement("div");
  el.textContent =
    typeof message === "string" ? message : message.text || "[empty]";
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setupChat() {
sendButton.addEventListener("click", () => {
  const msg = chatInput.value.trim();
  if (msg) {
    socket.emit("chatMessage", msg); // Just send
    chatInput.value = "";
  }
});


  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendButton.click();
  });

socket.on("chatMessage", (msg) => {
  const message = { id: socket.id, text: msg };
  chatHistory.push(message);
  console.log("Current chat history:", chatHistory); // 💥 logs in terminal
  io.emit("chatMessage", message);
});


  socket.on("chatHistory", (messages) => {
    messages.forEach(addMessageToChat);
  });
}


// ===== 🚀 Init =====
function init() {
  colorPicker.value = currentColor;
  sizeSlider.value = penSize;
  setupInputEvents();
  setupSocketEvents();
  setupChat(); // <-- HERE
}


init();
