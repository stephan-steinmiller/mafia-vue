<template>
  <div class="day">
    <div class="page-info">Your role is: </div>
    <div class="page-info">Vote someone to kill!</div> 
    <PlayerList :isSelectionList="false"></PlayerList>
    <ToggleButton @active-changed="onActiveChanged(index, $event)">{{}}</ToggleButton>
  </div>
</template>

<script>
// @ is an alias to /src
import ToggleButton from '@/components/RoleSelection/ToggleButton.vue'

export default {
  name: "Day",
  data() {
      return {}
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