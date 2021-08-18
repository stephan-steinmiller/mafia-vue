<template>
  <div class="player-waiting view">
    <div class="page-content">
      <div class="page-info">
        <template v-if="$store.state.players.length>1">{{$store.state.players.length}} Players in Lobby</template>
        <template v-else>You are the only one waiting</template>
      </div>
      <PlayerList :isSelectionList="false"></PlayerList>
      <div class="not-enough-players-error error-message" v-if="notEnoughPlayersError">
        There are not enough Players to start the game!
      </div>
    </div>
    <button v-if="isHost" class="button next-button" @click="startGame">Start Game</button>
  </div>
</template>

<script>
import PlayerList from '@/components/PlayerList.vue'
// @ is an alias to /src

export default {
  name: "PlayerWaiting",
  data() {
    return {
      isHost: false,
      notEnoughPlayersError: false,
    }
  },
  components: {
    PlayerList,
  },
  watch: {
    "$store.state.players.length" () {
      this.$store.state.players.length >= 2 && (this.notEnoughPlayersError = false)
    },
    "$store.state.isHost" () {
      this.isHost = this.$store.state.isHost
      this.routeToRoleSelection()
    },
    "$store.state.gameStarted" () {
      this.$router.push({name: "Game"})
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
      if (this.$store.state.players.length >= 2) {
        this.$store.commit('setRolesSelectionFinished')
        this.$store.dispatch("startGame")
      } else {
        this.notEnoughPlayersError = true
      }
    }
  },
}
</script>

<style scoped lang="scss">
.error-message {
  color: var(--red);
  margin: 4rem 0;
}
</style>