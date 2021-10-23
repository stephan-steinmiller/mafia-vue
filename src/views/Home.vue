<template>
  <div class="home view">
    <div class="page-content">
      <div class="page-info">Your displayed name will be:</div>
      <input class="input" type="text" v-model="playerName" :class="{ 'redText': inputError }" placeholder="Please enter your name" @keypress.enter="joinMatch">
      <div v-if="nameLengthError" class="error-message name-length-error">Player name must be at least three symbols long!</div>
      <div v-if="nameTakenError" class="error-message name-taken-error">Player-name is already taken!</div>
    </div>
    <button class="button next-button" :class="{ 'active': nameIsLongEnough }" @click="joinMatch">Next</button>
  </div>
</template>

<script>
import PlayerList from '@/components/PlayerList.vue'
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
      playerName: "",
      nameLengthError: false,
      nameTakenError: false,
    }
  },
  watch: {
    nameIsLongEnough() {
      this.nameIsLongEnough && (this.nameLengthError = false)
    },
    "$store.state.playerName"() {
      if(this.$store.state.playerName !== "") this.$router.push({name: "PlayerWaiting"})
    },
    "$store.state.nameIsAlreadyTaken"() {
      this.nameTakenError = this.$store.state.nameIsAlreadyTaken
    }
  },
  computed: {
    nameIsLongEnough() {
      return this.playerName.length >= 3
    },
    inputError() {
      return (this.nameLengthError || this.nameTakenError)
    },
  },
  mounted() {
    if(localStorage.getItem('playerName')) this.playerName = localStorage.getItem('playerName')
  },
  components: {
    PlayerList,
  },
  methods: {
    joinMatch({target}) {
      console.log("playerName in store is equivalent to playerName in Home view: ",this.$store.state.playerName === this.playerName);
      if (!this.nameIsLongEnough) this.nameLengthError = true
      else if( this.$store.state.playerName === this.playerName && !this.inputError ) this.$router.push({name: "PlayerWaiting"}) 
      else if ( this.playerName ) {
        console.log("got into else part in Hoome yis");
        // this.$store.commit("setNameIsAlreadyTaken", { state: this.$store.state, nameIsAlreadyTaken: true })
        localStorage.setItem('playerName', this.playerName)
        this.$store.dispatch("joinMatch")
      }
    }
  }
}
</script>

<style scoped lang="scss">
.input{
  outline: none;
}
.input.redText, .error-message {
  color: var(--red);
}
.error-message {
  margin: 4rem 0;
}
</style>