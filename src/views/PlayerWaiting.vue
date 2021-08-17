<template>
  <div class="player-waiting">
    <ul>
      <div class="page-info">
        {{$store.state.players.length}} Player<template v-if="$store.state.players.length>1">s</template> in Lobby
      </div>
      <div class="players" v-for="player in $store.state.players" :key="player.playerName" :class="{ 'host': player.isHost, 'disconnected': !player.isConnected, }">
        {{player.playerName}}
        <button v-if="isHost && (player.playerId !== $store.state.playerId)" class="button">X</button>
      </div>
    </ul>
  </div>
  <button v-if="isHost" class="button next-button" @click="startGame">Start Game</button>
</template>

<script>
// @ is an alias to /src

export default {
  name: "PlayerWaiting",
  data() {
    return {
      isHost: false
    }
  },
  components: {},
  watch: {
    "$store.state.isHost" () {
      this.isHost = this.$store.state.isHost
      this.routeToRoleSelection()
    },
    "$store.state.gameStarted" () {
      this.$router.push({name: "Night"})
    },
  },
  mounted() {
    this.isHost = this.$store.state.isHost
    this.routeToRoleSelection()
  },
  methods: {
    routeToRoleSelection () {
      (this.$store.state.isHost && !this.$store.state.rolesSelectionFinished) && this.$router.push({name: "RoleSelection"})
    },
    startGame() {
      this.$store.commit('setRolesSelectionFinished')
      this.$store.dispatch("startGame")
    }
  },
}
</script>

<style scoped lang="scss">
.players {
  &.disconnected {
    color: rgb(238, 55, 55);
  }
  &.host {
    color: rgb(59, 59, 255);
  }
}
</style>