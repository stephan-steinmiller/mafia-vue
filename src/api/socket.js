export const joinMatch = (socket) => {
  const playerName = localStorage.getItem('playerName')
  const playerId = localStorage.getItem('playerId')
  socket.emit('entered-name', { playerName, playerId })
}

export const startGame = (socket, rolesPool) => {
  socket.emit('start-game', rolesPool )
}

export const kickPlayer = (socket, playerNameToKick) => {
  socket.emit('kick-player', playerNameToKick )
}
