const socketio = require('socket.io')
const express = require('express')
const { GAME_STATES } = require('./serverConstants')
// const io = require('socket.io')(3000)


const app = express()
app.use(express.static(__dirname + '/client'))

const port = process.env.PORT
const expressServer = app.listen(port)
console.log(`l.12 Server listening on port ${port}`)

const io = socketio(expressServer, {
  cors: {
    origin: ["http://localhost:8080", "http://192.168.178.30:8080/", "https://mafia-vue.surge.sh/"],
    methods: ["GET", "POST"]
  }
});


const PLAYER_SESSION_TIMEOUT = 20000
let totalMatches = 1000000

let onlinePlayers = {
  // Player5649893: { playerId: 5649893, playerName: 'Stephan', socket, matchName: 'match1', isHost: true, isConnected: true },
  // Player5673940: { ... },
  // Player5649893: { ... },
  // Player5673940: { ... }
}
let registeredPlayers = [/* Player5649893, Player5673940, Player5673940 */]
// let pendingPlayers = []
let games = {
  // matchName: {
  //   players: [
  //     { playerId: 5649893, playerName: 'Stephan', socket, isHost: true },
  //     { ... },
  //     { ... }
  //   ],
  //   status: GAME_STATES.ACTIVE
  // }
};

io.on('connection', socket => {
  let registeredPlayerId = null;
  console.log('l.46 new connection');

  socket.on('entered-name', ({ playerName, playerId, gameCode }) => {
    console.log("l.49 parameters: ", playerName, playerId, gameCode)
    console.log("l.50 Player registered: ", playerId, playerName);
    playerName = playerName.trim()
    registeredPlayerId = playerId || Date.now();
    const matchName = gameCode || `match-${totalMatches}`
    
    // Player is reconnecting

    if(onlinePlayers[registeredPlayerId]) {
      console.log("l.55 Player is reconnecting");
      const matchName = onlinePlayers[registeredPlayerId].matchName

      let playerObject = { playerName, playerId: registeredPlayerId, socket, matchName, isConnected: true, disconnectedAt: null}
      onlinePlayers[registeredPlayerId] = playerObject
      const matchPlayerObject = { playerId: registeredPlayerId, playerName, isHost: onlinePlayers[registeredPlayerId].isHost, isConnected: true }
      games[matchName].players.splice(games[matchName].players.indexOf(registeredPlayerId), 1)[0]
      games[matchName].players.push(matchPlayerObject)
      
      onlinePlayers[registeredPlayerId].socket.join(matchName)
      socket.emit("registered", registeredPlayerId)
      updateMatchInfo(matchName)
      if(games[matchName].status === GAME_STATES.ACTIVE){}
      // TODO
      else if(games[matchName].status === GAME_STATES.INACTIVE) updateMatchInfo(matchName)
      else if (onlinePlayers[registeredPlayerId] && onlinePlayers[registeredPlayerId].isHost)
        socket.on( 'start-game', roles => {
          if (onlinePlayers[registeredPlayerId].isHost)
            startMatch(roles, matchName)
        })
    }
    
    // Player name is already taken

    else if(games[matchName] && games[matchName].players.find( (currentPlayer) => {
      return currentPlayer.playerName === playerName
    })) socket.emit("name-is-already-taken")

    // else if(matchName.length) socket.emit("game-already-started")

    // game already started

    // else if(games[matchName] && games[matchName].status === GAME_STATES.ACTIVE) socket.emit("game-already-started")

    // new player that has to be registered

    else if(!onlinePlayers[registeredPlayerId]) {
      if(!games[matchName]) {
        games[matchName] = {
          players: [],
          day: 0,
          hostPlayerId: "",
          status: GAME_STATES.INACTIVE
        }
      }

      let playerObject = { playerId: registeredPlayerId, playerName, socket, matchName, isHost: false, isConnected: true}
      onlinePlayers[registeredPlayerId] = playerObject
      const matchPlayerObject = { playerId: registeredPlayerId, playerName, isHost: false, isConnected: true }
      games[matchName].players.push(matchPlayerObject)

      onlinePlayers[registeredPlayerId].socket.join(matchName)
      //first Player becomes Host-Player
      if(games[matchName].players.length === 1)
        setHost(matchName)

      listenForPlayerKick(matchName)

      console.log('l.104 player socket id registered: ' + socket.id);
      console.log('l.105 with playerName:', onlinePlayers[registeredPlayerId].playerName, "joined Match:", matchName);

      // only Host-Player can start the game
      if (playerObject.isHost)
        socket.on( 'start-game', roles => {
          if (onlinePlayers[registeredPlayerId].isHost)
            startMatch(roles, matchName)
        })
      socket.emit("registered", registeredPlayerId)
      updateMatchInfo(matchName)

    }
  })

  socket.on('disconnect', function () {
    if(!onlinePlayers[registeredPlayerId]) return

    console.log("l.122 session timeout by Player with PlayerId: "+ registeredPlayerId);
    const matchName = onlinePlayers[registeredPlayerId].matchName
    onlinePlayers[registeredPlayerId].socket.leave(matchName)

    if (games[matchName] && games[matchName].players[registeredPlayerId] && games[matchName].players[registeredPlayerId].isHost && games[matchName].players.length >= 1) {
      onlinePlayers[registeredPlayerId].isHost = false
      games[matchName].players.push(games[matchName].players.splice(games[matchName].players.indexOf(registeredPlayerId), 1)[0])
      setHost(matchName)
    }

    console.log(`l.132 ${registeredPlayerId} disconnected`);
    onlinePlayers[registeredPlayerId].disconnectedAt = Date.now()
    onlinePlayers[registeredPlayerId].isConnected = false
    updateMatchInfo(matchName)

    setTimeout(() => {

      if (onlinePlayers[registeredPlayerId] && !onlinePlayers[registeredPlayerId].isConnected) {
        let deletedPlayerIsHost = onlinePlayers[registeredPlayerId].isHost
        deletePlayer(registeredPlayerId)
        registeredPlayerId = null;
        
        if(deletedPlayerIsHost && games[matchName].players.length >= 1) {
          setHost(matchName)
          updateMatchInfo(matchName)
        }
      }
    }, PLAYER_SESSION_TIMEOUT)

  });

})

function deletePlayer(playerToDeleteId) {
  console.log('l.154 user will be deleted: ' + playerToDeleteId)
  console.log('l.155 player after disconnect: ', onlinePlayers)

  matchName = onlinePlayers[playerToDeleteId].matchName || false
  if (games[matchName]) {
    delete games[matchName].players[playerToDeleteId]
    if(games[matchName].players.length === 0)
      deleteMatch(matchName)
  }

  delete onlinePlayers[playerToDeleteId]
  // pendingPlayers = pendingPlayers.filter(player => player !== playerToDeleteId)
}

function setHost(matchName) {
  if (games[matchName].players.length === 0) {
    deleteMatch(matchName)
    return
  }
  games[matchName].players[0].isHost = true
  onlinePlayers[games[matchName].players[0].playerId].isHost = true
  games[matchName].hostPlayerId = games[matchName].players[0].playerId
  console.log("l.176",games[matchName].players[0].playerName, "is now Host-Player of match", matchName)
}

function listenForPlayerKick(matchName) {
  onlinePlayers[games[matchName].hostPlayerId].socket.on( 'kick-player', playerName => {
    playerToDeleteId = ""
    games[matchName].players.find((element, index) => {
      if(element.playerName === playerName) {
        playerToDeleteId = games[matchName].players[index].playerId
        return true
      }
    })
    deletePlayer(playerToDeleteId)
    updateMatchInfo(matchName)
    listenForPlayerKick(matchName)
  })
} 

function pendingPlayersObjectList(matchName) {
  return games[matchName].players.map( currentPlayer => {
    const { playerName, isHost, isConnected } = onlinePlayers[currentPlayer.playerId]
    return { playerName, isHost, isConnected }
  })
}
function updateMatchInfo(matchName) {
  console.log("l.186",pendingPlayersObjectList(matchName));
  io.to(matchName).emit('match-info-update', {
    matchName: matchName,
    hostPlayerName: onlinePlayers[games[matchName].hostPlayerId].playerName,
    players: pendingPlayersObjectList(matchName),
    dayCount: games[matchName].dayCount,
    isDay: games[matchName].isDay,
    status: games[matchName].status
  })
}

function deleteMatch(matchName) {
  delete games[matchName]
}

function startMatch(rolesPool, matchName) {
  console.log("l.202 test");
  if (!games[matchName] || games[matchName].status == GAME_STATES.ACTIVE) {
    console.log("l.203 wtf");
    return
  }
  if( games[matchName].players.find( pendingPlayer => {
    return !onlinePlayers[pendingPlayer.playerId].isConnected
  }) || games[matchName].players.length <= 1 ) return

  console.log("l.210 create new Match");
  console.log("211", rolesPool);

  games[matchName].players.forEach( (currentPlayer, currentIndex) => {
    rolesPool.length<0 && rolesPool.push("Normal Citizen")
    games[matchName].players[currentIndex].role = rolesPool.splice(randomNumberGenerator(0, rolesPool.length-1), 1)[0]
    rolesPool.length<0 && rolesPool.push("Normal Citizen")
  })
  console.log("l.218", games[matchName].players);

  mafiaPlayerIndex = randomNumberGenerator(0, games[matchName].players.length-1)
  console.log("l.221 mafiaPlayerIndex: "+ mafiaPlayerIndex, games[matchName].players.length-1);
  rolesPool.push(games[matchName].players[mafiaPlayerIndex].role)
  games[matchName].players[mafiaPlayerIndex].role = "Normal Mafia"
  console.log("l.224",games[matchName].players);

  games[matchName].rolesPool = rolesPool
  games[matchName].dayCount = 1
  games[matchName].isDay = true
  games[matchName].status = GAME_STATES.ACTIVE

  updateMatchInfo(matchName)

  io.to(matchName).emit('match-created')

  games[matchName].players.forEach( currentPlayer => {
    onlinePlayers[currentPlayer.playerId].socket.emit('role-changed', currentPlayer.role)
  })
  
  // pendingPlayers = []
  if (matchName.length>6) totalMatches++
}

function randomNumberGenerator (min, max) {
  return Math.floor(Math.random()*max)+min
}