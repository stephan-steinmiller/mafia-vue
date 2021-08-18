<template>
  <router-view/>
  <div id="toolbar" v-if="$store.state.gameState !== 'active'">
    <template v-if="$store.state.gameState !== 'active'">
      <router-link to="/">change Name</router-link> |
      <template v-if="$store.state.isHost">
        <router-link to="/roles">Role-Selection</router-link> |
      </template>
      <router-link to="/PlayerWaiting">Lobby</router-link>
      <!-- <router-link v-if="$store.state.gameState === 'active' && $store.state.rolesSelectionFinished" to="/game">Game</router-link> -->
    </template>
  </div>
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

:root {
  --bg-color: #EDF0F1;
  --dark-grey: #505050;
  --text-color: #2c3e50;
  --green: rgb(95, 177, 95);
  --blue: #4A7FFF;
  --red: #FF4A7B;
  --subgreen-gradient: linear-gradient(to top left, rgb(95, 177, 95), rgb(157, 255, 157));
  --green-gradient: linear-gradient(to top left, rgb(95, 177, 95), rgb(135, 231, 135));
  --blue-gradient: linear-gradient(to left, #4A7FFF, #85CAFF);
  --red-gradient: linear-gradient(to top left, #FF4A7B, #FF8585);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  font-size: 0.5625vh;
}
#app {
  display: flex;
  flex-direction: column;
  align-items: center;  
    // justify-items: center;  
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-size: 16px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--bg-color);

  .view {
    display: flex;
    flex-direction: column;
    align-items: center;  
    justify-content: space-between;
    height: 100%;
    width: 100vw;
    padding: 4rem 4rem 12rem;
    flex: 1;
    border-radius: 8rem;
    background-color: white;
    text-align: center;

    .page-content {
      display: flex;
      width: 100%;
      flex-direction: column;
      text-align: center;
      align-items: center;  

    }
  }
}

#toolbar {
  // position: absolute;
  // bottom: 4rem;
  display: flex;
  padding: 4rem 0;
  a {
    flex: 1;
    font-weight: bold;
    text-align: center;
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
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4rem 4rem;
  height: 10rem;
  background: var(--green-gradient);
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
        border: none;
        background: var(--green-gradient);
      }
    }
  }

  &.next-button {
    min-width: 24rem;
    // width: 24rem;
    // max-width: 100%;
    // position: absolute;
    // bottom: 12rem;
  }
}
</style>
