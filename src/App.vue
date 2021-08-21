<template>
  <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
    <linearGradient id="my-cool-gradient" x2="1" y2="1">
      <stop offset="0%" stop-color="#87E787" />
      <stop offset="100%" stop-color="#5FB15F" />
    </linearGradient>
  </svg>

  <router-view/>
  <div id="toolbar" v-if="$store.state.gameState !== 'active'">
    <!-- <router-link v-if="$store.state.isHost" to="/roles">Role-Selection</router-link> -->
    <router-link to="/PlayerWaiting">
      <svg class="toolbar-icon" width="238" height="239" viewBox="0 0 238 239" fill="black" xmlns="http://www.w3.org/2000/svg">
        <path d="M166.809 185.725C157.864 187.434 153.325 195.161 154.701 199.808C177.958 194.009 177.361 212.381 206.186 205.194C223.941 200.767 229.917 176.932 229.005 166.313C229.104 170.193 219.525 182.994 201.909 188.037C182.472 193.602 177.991 183.587 166.809 185.725Z" fill="inerhit" stroke-linejoin="round"/>
        <path d="M133.109 194.127C141.81 191.437 149.445 196.129 150.412 200.877C127.155 206.676 136.307 222.617 107.481 229.804C89.7267 234.231 73.2602 215.991 69.0801 206.186C70.8137 209.659 85.2813 216.465 103.203 212.647C122.978 208.435 122.232 197.49 133.109 194.127Z" fill="inerhit" stroke-linejoin="round"/>
        <path d="M184.879 87.2912C194.855 86.522 225.418 87.6961 229 103C234.5 126.5 212 139 194 148.5C175.5 156 149.19 159.923 129 156C126.101 155.437 123.36 154.603 120.715 153.567C91.424 147.17 84.8731 171.626 54 183C35 190 13 177 7.5 159C3.17892 144.858 14.3622 125.367 48 125.5C53.0786 124.654 86 126.169 115 131.121C146.5 136.5 162.511 130.008 174 120.5C188.5 108.5 184.879 98.5 184.879 87.2912C178 103 176.217 114.274 154 122.5C126.419 132.713 91.4577 116.059 47 118C34.1806 88.0307 32.1056 61.4304 34.4266 45.8144C36.7477 30.1983 48.8411 9.15071 95.3446 31.1432C121.488 -0.527325 150.516 -1.09161 163.69 14.6463C177.5 31.1432 183.636 58.8183 184.879 87.2912Z" fill="inerhit"/>
      </svg>
    </router-link>
    <!-- <router-link v-if="$store.state.gameState === 'active' && $store.state.rolesSelectionFinished" to="/game"></router-link> -->
    <router-link to="/">
      <svg class="toolbar-icon" width="144" height="226" viewBox="0 0 144 226" fill="black" xmlns="http://www.w3.org/2000/svg">
        <path d="M72 146C32.2355 146 0 178.236 0 218C0 222.418 3.58173 226 8 226C12.4183 226 16 222.418 16 218C16 187.072 41.0721 162 72 162C102.928 162 128 187.072 128 218C128 222.418 131.582 226 136 226C140.418 226 144 222.418 144 218C144 178.236 111.765 146 72 146Z" fill="inerhit"/>
        <circle cx="72" cy="94" r="40" fill="inerhit"/>
        <ellipse cx="72" cy="58" rx="64" ry="26" fill="inerhit"/>
        <rect x="36" width="72" height="64" rx="16" fill="inerhit"/>
      </svg>
    </router-link>
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
      (this.$store.state.gameState === GAME_STATES.ACTIVE) && (this.$router.push({path: "/game"}))
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
  --green: #5FB15F;
  --blue: #4A7FFF;
  --red: #FF4A7B;
  --subgreen-gradient: linear-gradient(to top left, #5FB15F, #9DFF9D);
  --green-gradient: linear-gradient(to top left, #5FB15F, #87E787);
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
  // align-items: center;  
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
@media (orientation: portrait) {
}
#toolbar {
  display: flex;
  // justify-content: space-between;
    padding: 4rem 4rem;
  a {
    height: 8rem;
    width: 8rem;
    flex: 1;
    font-weight: bold;
    text-align: center;
    color: var(--text-color);

    .toolbar-icon {
      fill: #888888;
      height: 100%;
      width: 100%;
    }
    &.router-link-exact-active .toolbar-icon {
      fill: var(--green);
      fill: url(#my-cool-gradient) var(--green);
    }
  }
}

@media (orientation: landscape) {
  #app {
    flex-direction: row-reverse;
  }

  #toolbar {
    flex-direction: column;

    a {
      margin: 4rem 0;
      flex: 0;
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
