import { createStore } from 'vuex'
import { joinMatch, startGame, kickPlayer } from '../api/socket'
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
    playerRole: "",
    matchName: "",
    isHost: false,
    rolesSelectionFinished: false,
    nameIsAlreadyTaken: false,
    dayCount: 0,
    isDay: false,
    gameState: GAME_STATES.INACTIVE,
    playerToKickName: "",
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
    setPlayerId(state, id) {
      localStorage.setItem('playerId', id)
      state.playerId = id
    },
    setPlayerName(state, name) {
      state.playerName = name
    },
    setPlayerRole(state, role) {
      state.playerRole = role
    },
    setMatchName(state, matchName) {
      state.matchName = matchName
    },
    setRolesSelectionFinished(state, rolesSelectionFinished) {
      state.rolesSelectionFinished = rolesSelectionFinished
    },
    setNameIsAlreadyTaken(state, nameIsAlreadyTaken) {
      state.nameIsAlreadyTaken = nameIsAlreadyTaken
    },
    
    setDayCount(state, dayCount) {
      state.dayCount = dayCount
    },
    setGameState(state, gameState) {
      state.gameState = gameState
    },
    setIsDay(state, isDay) {
      state.isDay = isDay
    },
    setPlayerToKickName(state, playerName) {
      state.playerToKickName = playerName
    },
  },

  actions: {
    setRolesPool({commit}, roles) {
      const temporaryRoles = roles
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

    connectToApi() {
      socket = io("http://localhost:3000")
    },

    joinMatch({ state, dispatch, commit }) {
      console.log("store/index l.88 join");
      const playerId = localStorage.getItem('playerId')
      const playerName = localStorage.getItem('playerName')
      joinMatch(socket)

      socket.on("name-is-already-taken", () => {
        commit("setNameIsAlreadyTaken", { state, nameIsAlreadyTaken: true })
      })

      socket.on('registered', playerId => {
        console.log("registered ", playerId);
        const playerName = localStorage.getItem('playerName')
        playerId && commit('setPlayerId', playerId)
        playerName && commit('setPlayerName', playerName)

        socket.on('match-created', match => {
          console.log("match created")
        })
        dispatch('getMatchInfoUpdate')
        dispatch('getRoleUpdate')

      })
    },

    getRoleUpdate({ commit, dispatch, state }) {
      socket.on('role-changed', roleName => {
        console.log("roleName:",roleName)
        commit('setPlayerRole', roleName)
        
        dispatch('getRoleUpdate')
      })
    },

    startGame({ state }) {
      startGame(socket, state.rolesPool)
    },

    getMatchInfoUpdate({ commit, dispatch, state }) {
      socket.on('match-info-update', match => {
        console.log("players-updated triggered");
        console.log(match);
        console.log(match.players);
        const playerName = state.playerName
        const isHost = match.hostPlayerName === playerName

        commit('setIsHost', isHost)
        commit('setPlayers', match.players)
        commit('setGameState', match.gameState)
        commit('setMatchName', match.matchName)
        commit('setDayCount', match.dayCount)
        commit('setIsDay', match.isDay)
        
        console.log("isHost:", isHost)
        console.log("state.isHost:", state.isHost)
        console.log("match.gameState:", match.gameState)
        console.log("matchName:", match.matchName)
        console.log("dayCount:", match.dayCount)
        console.log("isDay:", match.isDay)

        dispatch('getMatchInfoUpdate')
      })
    },
    
    startGame({ state }) {
      startGame(socket, state.rolesPool)
    },

    kickPlayer({ state }) {
      if(state.isHost) kickPlayer(socket, state.playerName)
    },
  },
  
  modules: {
  }
})
