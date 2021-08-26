<template>
  <div class="night">
    <div class="page-info role-info" :class="{ 'mafia-role' = playerRole =   }">Your role is: </div>
    <div class="page-info">Vote someone to kill!</div> 
    <PlayerList :isSelectionList="false"></PlayerList>
    <ToggleButton @active-changed="onActiveChanged(index, $event)">{{}}</ToggleButton>
  </div>

</template>

<script>
// @ is an alias to /src
const { ROLE_NAMES } = require('./constants')
import ToggleButton from '@/components/RoleSelection/ToggleButton.vue'

export default {
  name: "Night",
  data() {
      return {}
  },
  mounted() {
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