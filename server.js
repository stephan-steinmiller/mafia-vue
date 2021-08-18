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
    origin: ["http://localhost:8080", "http://192.168.178.30:8080/"],
    methods: ["GET", "POST"]
  }
});


const PLAYER_SESSION_TIMEOUT = 20000
let oRequest = false;
let onlinePlayers = {
  // Player5649893: { playerId: Player5649893, playerName: 'Stephan', socket, matchName: 'match1', isHost: true, isConnected: true }
  // Player5673940: { playerId: Player5673940, playerName: '', matchName: 'match1' }
  // Player5649893: { playerId: Player5649893, playerName: '', matchName: 'match2' }
  // Player5673940: { playerId: Player5673940, playerName: '', matchName: 'match2' }
}
let pendingPlayers = []
let games = {
  totalMatches: 0
  // matchName: {
  //   players: [
  //     { playerId: Player5649893, playerName: 'Stephan', socket, match: 'match1', isHost: true },
  //     { playerId: Player5673940, playerName: '', matchName: 'match1' },
  //     { playerId: Player5673940, playerName: '', matchName: 'match2' }
  //   ] 
  //   status: GAME_STATES.ACTIVE,
  // }
};

io.on('connection', socket => {
  let matchName = null;
  let registeredPlayerId = null;
  console.log('new connection');

  socket.on('registered', ({playerId, playerName}) => {
  console.log(playerId, playerName);
  registeredPlayerId = playerId;
  
    if(!onlinePlayers[registeredPlayerId]) {
      let playerObject = { playerId: registeredPlayerId, playerName, socket, matchName, isHost: false, isConnected: true}
      onlinePlayers[registeredPlayerId] = playerObject
      pendingPlayers.push(registeredPlayerId);

      //first Player becomes Host-Player
      if(pendingPlayers.length === 1) {
        setHost()
      }

      console.log('player socket id registered: ' + socket.id);
      console.log('with playerName: ' + onlinePlayers[registeredPlayerId].playerName);

      // only Host-Player can  start the game
      if (playerObject.isHost) {
        socket.on('start-game', roles => {
          createMatch(roles)
        })
      }


    } else if(onlinePlayers[registeredPlayerId]) {
      
      onlinePlayers[registeredPlayerId].disconnectedAt = null
      onlinePlayers[registeredPlayerId].isConnected = true
      onlinePlayers[registeredPlayerId].playerName = playerName
      onlinePlayers[registeredPlayerId].socket = socket

      if (onlinePlayers[registeredPlayerId].isHost) {
        socket.on('start-game', roles => {
          createMatch(roles)
        })
      }
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
    return { playerName: player.playerName, playerId: player.playerId, isHost: player.isHost, isConnected: player.isConnected }
  })
}


// function deleteMatch(matchName) {
//     if (games[matchName].xPlayer) {
//         let xPlayer = games[matchName].xPlayer;
//     }
//     if (games[matchName].oPlayer) {
//         let oPlayer = games[matchName].oPlayer;
//     }
//     if ((onlinePlayers[xPlayer])) {
//         onlinePlayers[xPlayer].match = null;
//         pendingPlayers.push(xPlayer)
//     }
//     if ((onlinePlayers[oPlayer])) {
//         onlinePlayers[oPlayer].match = null;
//         pendingPlayers.push(oPlayer)
//     }
//     delete games[matchName];
//     games.totalMatches--;
// }

function createMatch(rolesPool) {
  console.log(rolesPool);
  let matchName = `match-${games.totalMatches}`
  games.totalMatches++;

  let players = pendingPlayersObjectList()
  players.forEach( (currentPlayer, currentIndex) => {
    rolesPool.length<0 && rolesPool.push("Normal Citizen")
    players[currentIndex].role = rolesPool.splice(randomNumberGenerator(0, rolesPool.length-1), 1)[0]
    rolesPool.length<0 && rolesPool.push("Normal Citizen")
  })

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


  pendingPlayers.forEach( pendingPlayerId => {
    onlinePlayers[pendingPlayerId].matchName = matchName
    onlinePlayers[pendingPlayerId].socket.emit('match-created', games[matchName])
  })
  pendingPlayers = []

  // onlinePlayers[xPlayerName].socket.emit('match-created', 'x')
  // onlinePlayers[oPlayerName].socket.emit('match-created', 'o')

  // onlinePlayers[xPlayerName].socket.on('set-field', move => {
  //   // one of the players made a move
  //   console.log(`x in ${matchName}: ${move}`);
  //   onlinePlayers[oPlayerName].socket.emit('field', move);
  // });
  // onlinePlayers[oPlayerName].socket.on('set-field', move => {
  //   // one of the players made a move
  //   console.log(`o in ${matchName}: ${move}`);
  //   onlinePlayers[xPlayerName].socket.emit('field', move);
  // });

  function randomNumberGenerator (min, max) {
    return Math.floor(Math.random()*max)+min
  }
}