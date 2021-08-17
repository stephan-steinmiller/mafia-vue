export const joinMatch = (socket) => {
  let playerName = localStorage.getItem('playerName')
  let playerId = localStorage.getItem('playerId')
  socket.emit('registered', { playerName, playerId })
}

export const startGame = (socket, rolesPool) => {
  socket.emit('start-game', rolesPool )
}