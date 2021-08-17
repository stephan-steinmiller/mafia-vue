<template>
  <div class="night">
      <ul>
      <ToggleButton class="player" v-for="player in $store.state.players" :key="player.playerName">
        {{player.playerName}}
      </ToggleButton>
    </ul>
      <ToggleButton @active-changed="onActiveChanged(index, $event)">{{}}</ToggleButton>
  </div>
</template>

<script>
// @ is an alias to /src
import ToggleButton from '@/components/RoleSelection/ToggleButton.vue'

export default {
  name: "Night",
  data() {
      return {}
  },
  mounted() {
    if (condition) {
      
    }
  },
  components: {
    ToggleButton
  },
  computed: {
    selectablePlayers() {
      return this.$store.state.players
    }
  },
  watch: {
  },
  methods: {
    onActiveChanged() {

    },
  },
}
</script>

<style scoped lang="scss">
</style>