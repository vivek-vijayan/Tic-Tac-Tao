const firebaseAdmin = require('firebase-admin');
const express = require('express');
const app = express();

// Firebase 🔥 
const serviceAccount = require('./tic-tac-toe-vivek-vijayan-firebase-adminsdk-dwiq5-c7af04df24.json');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

// Firestore DB Conenction ☄️
const db = firebaseAdmin.firestore();

// Structure 🏛
var gameJson = {
    roomCode: "",
    players: {
        player1: {
            playerName: "",
            playerID: "",
            playerWin: ""
        },
        player2: {
            playerName: "",
            playerID: "",
            playerWin: ""
        }
    },
    status: "",
    gamePlay: {
        a11: "", a12: "", a13: "",
        b11: "", b12: "", b13: "",
        c11: "", c12: "", c13: "",
    },
}

// Room Availability 🏡
var getNewRoomForGame = (roomCode) => {
    var roomAvailable = Math.floor((Math.random() * 3400 + 21343)).toString()
    if (db.collection('gameplay').doc(roomCode).get().exists) {
        getNewRoomForGame(roomCode)
    }
    else
        return roomAvailable
}


// request 👋
app.get('/', (req, res) => {
    res.status(200).json({
        getUsage: "/start/<username>  -> GET to open a room for the game , /join/<roomcode>/<username> -> GET to join the room with the user1 who created the room",
        postUsage: "new turn URL -> POST to play the game",
        status: 200,
        version: "1.0.0"
    })
})

app.get('/start/:username/:lastGameCode', (req, res) => {
    var user1 = req.params.username;
    db.collection('gameplay').doc(req.params.lastGameCode).delete()
    if (user1.length > 0) {
        gameJson.roomCode = getNewRoomForGame('0')
        gameJson.players.player1.playerName = user1;
        gameJson.status = "Waiting for player 2";
        db.collection('gameplay').doc(gameJson.roomCode).set(gameJson);
        res.json({
            roomCode: gameJson.roomCode,
            status: gameJson.status,
        })
    }
    else {
        res.json({
            error: "Invalid username"
        }).status(500)
    }
})

app.get('/join/:code/:username', (req, res) => {
    var user2 = req.params.username
    if (db.collection('gameplay').doc(req.params.code).get().exists) {
        res.json({
            firstone : "vivek",
            error: db.collection('gameplay')
        })
    }
    else {
        res.json({
            error: "game off",
            erer: db.collection('gameplay').doc()
        })
    }
})

app.listen(3000)


