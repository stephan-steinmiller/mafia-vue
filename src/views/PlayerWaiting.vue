<template>
  <div class="page-info">
    {{$store.state.players.length}} Player<template v-if="$store.state.players.length>1">s</template> in Lobby
  </div>

  <PlayerList :isSelectionList="false"></PlayerList>
  <button v-if="isHost" class="button next-button" @click="startGame">Start Game</button>
</template>

<script>
import PlayerList from '@/components/PlayerList.vue'
// @ is an alias to /src

export default {
  name: "PlayerWaiting",
  data() {
    return {
      isHost: false
    }
  },
  components: {
    PlayerList,
  },
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
</style>