<template>
  <div class="page-info">Your displayed name:</div>
  <input class="input" type="text" v-model="playerName" :class="{ 'redText': inputError }" placeholder="Please enter your name" @keypress.enter="joinMatch">
  <div v-if="inputError" class="error-info">Player name must be at least three symbols long!</div>
  <button class="button next-button" :class="{ 'active': nameIsLongEnough }" @click="joinMatch">next</button>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
      playerName: "",
      inputError: false,
    }
  },
  watch: {
    nameIsLongEnough() {
      this.nameIsLongEnough && (this.inputError = false)
    },
  },
  computed: {
    nameIsLongEnough() {
      return this.playerName.length >= 3
    },
  },
  mounted() {
    this.playerName = localStorage.getItem('playerName')
  },
  components: {
  },
  methods: {
    joinMatch({target}) {
      if (this.nameIsLongEnough) {
        // const isJoining = confirm("Are you sure that you want to join with the name " + this.playerName)

        // if (isJoining) {
        if (this.$store.state.playerName !== this.playerName) {
          const playerId = localStorage.getItem('playerId') || this.playerName + '-' + Date.now()
          localStorage.setItem('playerId', playerId)
          localStorage.setItem('playerName', this.playerName)
          this.$store.dispatch("joinMatch")
        }
          
        this.$router.push({name: "PlayerWaiting"})
        // } 
      } else {
        console.log(this.inputError = true);
        this.inputError = true
      }
    },
  },
}
</script>

<style scoped lang="scss">
.input.redText, .error-info {
  color: rgb(165, 11, 11);
}
.error-info {
  margin: 4rem 0;
}
</style>