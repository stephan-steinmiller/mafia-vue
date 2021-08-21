import { createStore } from 'vuex'
import { joinMatch, startGame } from '../api/socket'
const { GAME_STATES } = require('../constants')
const io = require('socket.io-client')
let socket = null


export default createStore({
  state: {
    roles: [],
    rolesPool: [],
    players: [],
    playerId: "",
    playerName: "",
    isHost: false,
    rolesSelectionFinished: false,
    gameState: GAME_STATES.INACTIVE,
  },

  mutations: {
    setRoles(state, roles) {
      state.rolesPool = roles
    },

    setRolesPool(state, rolesPool) {
      state.rolesPool = rolesPool
    },

    setPlayers(state, players) {
      state.players = players
    },

    setIsHost(state, isHost) {
      state.isHost = isHost
    },
    
    setPlayerId(state, playerId) {
      state.playerId = playerId
    },

    setPlayerName(state, playerName) {
      state.playerName = playerName
    },

    setRolesSelectionFinished(state, rolesSelectionFinished) {
      state.rolesSelectionFinished = rolesSelectionFinished
    },

    setGameState(state, gameState) {
      state.gameState = gameState
    },
  },

  actions: {
    setRolesPool({commit}, roles) {
      let temporaryRoles = roles
      let rolesPool = []
      temporaryRoles.forEach( role => {
        for(var i=0; i<role.count; i++) {
          if (role.roleName !== 'Normal Mafia' || role.count-i === 1) {
            rolesPool.push(role.roleName)
          }
        }
      })
      console.log(rolesPool);
      commit("setRolesPool", rolesPool)
    },

    connectToApi({ commit }) {
      socket = io("http://localhost:3000")
      const playerId = localStorage.getItem('playerId')
      const playerName = localStorage.getItem('playerName')
      playerId && commit('setPlayerId', playerId)
      playerName && commit('setPlayerName', playerName)
    },

    joinMatch({ dispatch, commit }) {
      const playerId = localStorage.getItem('playerId')
      const playerName = localStorage.getItem('playerName')
      commit('setPlayerId', playerId)
      commit('setPlayerName', playerName)
      console.log(playerId);
      joinMatch(socket)
      dispatch('getUpdatedPlayers', playerId)

      socket.on('match-created', match => {
        commit('setPlayers', match.players)
        commit('setRolesPool', match.rolesPool)
        commit('setGameState', match.gameState)
      })
    },

    getUpdatedPlayers({ commit, dispatch, state }, playerId) {

      socket.on('players-updated', players => {
        console.log("players-updated triggered");
        console.log(players);
        let amIHost = false

        players.find(player => {
          amIHost = (player.playerId === playerId && player.isHost)
          return amIHost
        })

        console.log("amIHost:",amIHost)
        commit('setIsHost', amIHost)
        console.log("state.isHost:",state.isHost)
        commit('setPlayers', players)
      })
    },
    
    startGame({ state }) {
      startGame(socket, state.rolesPool)
    },
  },
  
  modules: {
  }
})
