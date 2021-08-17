<template>
  <div id="nav">
    <template v-if="$store.state.gameState !== 'active'">
      <router-link to="/">change Name</router-link> |
      <template v-if="$store.state.isHost">
        <router-link to="/roles">Role-Selection</router-link> |
      </template>
      <router-link to="/PlayerWaiting">Lobby</router-link>
      <router-link v-if="$store.state.gameState === 'active' && $store.state.rolesSelectionFinished" to="/game">Game</router-link>
    </template>
  </div>
  <router-view/>
</template>

<script>
const { GAME_STATES } = require('./constants')
// @ is an alias to /src

export default {
  mounted() {
    this.$store.dispatch("connectToApi")
    if (localStorage.getItem('playerName') && localStorage.getItem('playerId')) {
      this.$store.dispatch('joinMatch')
      if (this.$store.state.gameState === GAME_STATES.ACTIVE) {
        this.$router.push({path: "/game"})
      } else {
        this.$router.push({path: "/playerWaiting"})
      }
    }
  },
  watch: {
    "$store.state.gameState"() {
      (this.$store.state.gameState === GAME_STATES.ACTIVE) && this.$router.push({path: "/game"})
    }
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');  
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  font-size: 0.5625vh;
}
#app {
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  overflow: hidden;
  height: 100vh;
  padding: 2rem;
  font-size: 16px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.page-info {
  width: 100%;
  font-size: 4rem;
  margin: 6rem 0;  
}

.button, .input {
  padding: 2rem 4rem;
  height: 9.5rem;
  background: rgb(95, 177, 95);
  color: white;
  border: none;
  border-radius: 999999px;
  cursor: pointer;
  text-decoration: none;
  font-size: 4rem;
  font-family: inherit;

  &.roles-button, &.next-button:not(.active), &.input {
    color: black;
    border: 0.5rem solid #333333;
    background: none;

    @media (orientation: landscape) {
      &:hover:not(.input) {
        color: white;
        border-color: rgb(95, 177, 95);
        background: rgb(95, 177, 95);
      }
    }
  }

  &.next-button {
    min-width: 24rem;
    position: absolute;
    bottom: 12rem;
  }
}
</style>
