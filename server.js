const socketio = require('socket.io')
const express = require('express')
const { GAME_STATES } = require('./serverConstants')
// const io = require('socket.io')(3000)


const app = express()
app.use(express.static(__dirname + '/client'))

const port = process.env.PORT
const expressServer = app.listen(port)
console.log(`Server listening on port ${port}`)

const io = socketio(expressServer, {
  cors: {
    origin: ["http://localhost:8080", "http://192.168.178.30:8080/", "https://mafia-vue.surge.sh/"],
    methods: ["GET", "POST"]
  }
});


const PLAYER_SESSION_TIMEOUT = 20000
let totalMatches: 0

let onlinePlayers = {
  // Player5649893: { playerId: 5649893, playerName: 'Stephan', socket, matchName: 'match1', isHost: true, isConnected: true },
  // Player5673940: { ... },
  // Player5649893: { ... },
  // Player5673940: { ... }
}
let pendingPlayers = []
let games = {
  // matchName: {
  //   players: [
  //     { playerId: 5649893, playerName: 'Stephan', socket, match: 'match1', isHost: true },
  //     { ... },
  //     { ... }
  //   ],
  //   status: GAME_STATES.ACTIVE
  // }
};

io.on('connection', socket => {
  let registeredPlayerId = null;
  console.log('new connection');

  socket.on('entered-name', ({ playerName, playerID }) => {
    console.log("Player registered: ", playerId, playerName);
    registeredPlayerId = playerId || Date.now();

    if(pendingPlayers.find( (pendingPlayer) => {
      return pendingPlayer.playerName === playerName
    })) socket.emit("name-already-taken")

    else if(!onlinePlayers[registeredPlayerId]) {
      let playerObject = { playerId: registeredPlayerId, playerName, socket, isHost: false, isConnected: true}
      onlinePlayers[registeredPlayerId] = playerObject
      pendingPlayers.push(registeredPlayerId);

      onlinePlayer[registeredPlayerId].socket.join(`match-${totalMatches}`)
      //first Player becomes Host-Player
      if(pendingPlayers.length === 1) {
        setHost()
      }

      console.log('player socket id registered: ' + socket.id);
      console.log('with playerName: ' + onlinePlayers[registeredPlayerId].playerName);

      // only Host-Player can start the game
      if (playerObject.isHost) {
        socket.on('start-game', roles => {
          createMatch(roles)
        })
      }
      socket.emit("registered")
    } else if(onlinePlayers[registeredPlayerId]) {
      onlinePlayer[registeredPlayerId].socket.join(`match-${totalMatches}`)
        
      onlinePlayers[registeredPlayerId].disconnectedAt = null
      onlinePlayers[registeredPlayerId].isConnected = true
      onlinePlayers[registeredPlayerId].playerName = playerName
      onlinePlayers[registeredPlayerId].socket = socket

      if (onlinePlayers[registeredPlayerId].isHost) {
        socket.on('start-game', roles => {
          createMatch(roles)
        })
      }
      socket.emit("registered")
    }
    sendPendingPlayers()
  })

  socket.on('disconnect', function () {
    console.log("session timeout by Player with PlayerId: "+ registeredPlayerId);

    if(!onlinePlayers[registeredPlayerId]) {
      return null
    }
    if (onlinePlayers[registeredPlayerId].isHost && pendingPlayers.length >= 1) {
      onlinePlayers[registeredPlayerId].isHost = false
      pendingPlayers.push(pendingPlayers.splice(pendingPlayers.indexOf(registeredPlayerId), 1)[0])
      setHost()
    }

    console.log(`${registeredPlayerId} disconnected`);
    onlinePlayers[registeredPlayerId].disconnectedAt = Date.now()
    onlinePlayers[registeredPlayerId].isConnected = false
    sendPendingPlayers()

    setTimeout(() => {

      if (onlinePlayers[registeredPlayerId] && !onlinePlayers[registeredPlayerId].isConnected) {
        let deletedPlayerIsHost = onlinePlayers[registeredPlayerId].isHost
        deletePlayer(registeredPlayerId)
        registeredPlayerId = null;
        
        deletedPlayerIsHost && pendingPlayers.length >= 1 && setHost()
        sendPendingPlayers()
      }
    }, PLAYER_SESSION_TIMEOUT)

  });

})

function deletePlayer(playerToDeleteId) {
  console.log('user will be deleted: ' + playerToDeleteId);
  console.log('player after disconnect: ', onlinePlayers);

  // deleteMatch(onlinePlayers[registeredPlayer].match);
  delete onlinePlayers[playerToDeleteId]
  pendingPlayers = pendingPlayers.filter(player => player !== playerToDeleteId)
}

function setHost() {
  onlinePlayers[pendingPlayers[0]].isHost = true
  console.log(pendingPlayers[0] + "is now Host-Player")

}

const sendPendingPlayers = () => {
  console.log(pendingPlayers);
  const updatedPlayers = pendingPlayersObjectList()
  console.log(updatedPlayers);
  pendingPlayers.forEach( pendingPlayer => {
    onlinePlayers[pendingPlayer].socket.emit('players-updated', updatedPlayers)
  })

}
function pendingPlayersObjectList() {
  return pendingPlayers.map( currentPlayerId => {
    const player = onlinePlayers[currentPlayerId]
    return { playerName: player.playerName, isHost: player.isHost, isConnected: player.isConnected }
  })
}


function deleteMatch(matchName) {
  // TODO
}

function createMatch(rolesPool) {
  totalMatches++;
  console.log(rolesPool);
  let matchName = `match-${totalMatches}`

  let players = pendingPlayersObjectList()
  players.forEach( (currentPlayer, currentIndex) => {
    rolesPool.length<0 && rolesPool.push("Normal Citizen")
    players[currentIndex].role = rolesPool.splice(randomNumberGenerator(0, rolesPool.length-1), 1)[0]
    rolesPool.length<0 && rolesPool.push("Normal Citizen")
  })
  console.log(players);

  mafiaPlayerIndex = randomNumberGenerator(0, players.length-1)
  console.log("mafiaPlayerIndex: "+ mafiaPlayerIndex, players.length-1);
  rolesPool.push(players[mafiaPlayerIndex].role)
  players[mafiaPlayerIndex].role = "Normal Mafia"
  console.log(players);

  games[matchName] = {
    players: players,
    rolesPool,
    status: GAME_STATES.ACTIVE
  }
  console.log(games);

  io.to("game").emit('match-created', games[matchName])
  
  pendingPlayers = []
}

function randomNumberGenerator (min, max) {
  return Math.floor(Math.random()*max)+min
}