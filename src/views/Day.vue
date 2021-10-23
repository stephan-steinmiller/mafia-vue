<template>
  <div class="day view">
    <div class="page-content">
      <div class="page-info">It is Day</div>
      <div class="page-info">Your role is: {{$store.state.playerRole}}</div>
      <div class="page-info">Vote someone to execute!</div> 
      <PlayerList
        :isSelectionList="true"
        :selectableMaxCount="1"
      >
      </PlayerList>
    </div>
    <div class="vote-buttons">
      <div class="button skip-button next-button" @on-click="onSkip(index, $event)">Skip</div>
      <div class="button vote-button next-button" @on-click="onVote(index, $event)">Vote</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PlayerList from '@/components/PlayerList.vue'
import ToggleButton from '@/components/RoleSelection/ToggleButton.vue'

export default {
  name: "Day",
  data() {
      return {}
  },
  components: {
    PlayerList,
    ToggleButton,
  },
  computed: {
    selectablePlayers() {
      return this.$store.state.players
    }
  },
  watch: {
  },
  methods: {
    onSkip() {

    },
    onVote() {

    }
  },
}
</script>

<style scoped lang="scss">
  .vote-buttons {
    width: 80%;
    display: flex;
    justify-content: space-between;
  }
</style>