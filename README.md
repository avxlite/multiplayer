# 🎮 Multiplayer Game

> *“Because singleplayer is lonely.”*

---

## 🚀 Quick Start

### 🛠 1. Clone This Repo

```bash
git clone https://github.com/avxlite/multiplayer.git
cd multiplayer
```

### 📦 2. Install Stuff

Make sure you have [Node.js](https://nodejs.org/) installed.
Then summon the dependencies:

```bash
npm install
```

*(This will grab Express + Socket.IO so your game can actually run.)*

### ▶️ 3. Launch the Game Server

```bash
node server.js
```

The server will rise from its slumber on port **3000**.

### 🕹 4. Play

Fire up your browser and head to:

```
http://localhost:3000
```

Open it in multiple tabs or invite friends to connect to your IP for true multiplayer chaos.

---

## 📂 Project Layout

```
📦 multiplayer
 ┣ 📂 node_modules        # dependencies
 ┣ 📂 public        # Frontend: index.html, style.css, script.js
 ┣ 📜 server.js     # Backend: Express + Socket.IO server
 ┣ 📜 package.json  # npm dependencies + scripts
 ┗ 📜 README.md     # This beautiful document
```

---

## 🏆 Pro Tips

* Open multiple browser windows to test multiplayer locally.
* To host publicly, port forward 3000 or use a service like [ngrok](https://ngrok.com/).
* If it doesn’t work, check if you forgot `npm install`—90% of issues are that.
