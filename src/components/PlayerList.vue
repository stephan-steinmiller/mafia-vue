<template>
  <div class="player-list">
    <template v-if="this.isSelectionList">
      <RadioButtonItem class="player-list-item selection-list" :content="player.playerId" :resetButton="resetButtonWithContent" @is-selected-changed="selectionChanged(player.playerId, $event)" v-for="player in $store.state.players" :key="player.playerId">
        {{player.playerName}}
      </RadioButtonItem>
    </template>
      <ListItem v-else class="player-list-item" v-for="player in $store.state.players" :key="player.playerId" :class="{ 'host': player.isHost, 'disconnected': !player.isConnected, }">
        {{player.playerName}}
      <button v-if="$store.state.isHost && (player.playerId !== $store.state.playerId)" class="button kick-button" @click="kickPlayer(player.playerId)">X</button>
    </ListItem>
  </div>
</template>

<script>
import RadioButtonItem from '@/components/RadioButtonItem.vue'
import ListItem from '@/components/ListItem.vue'
// @ is an alias to /src

export default {
  name: 'SelectionList',
  props: {
    isSelectionList: Boolean,
  },
  data() {
    return {
      resetButtonWithContent: "",
      selectedPlayerId: "",
    }
  },
  mounted() {
  },
  components: {
    RadioButtonItem,
    ListItem,
  },
  methods: {
    kickPlayer(playerId) {

    },
    selectionChanged(playerId, isSelected) {
      this.selectedPlayerId === "" && isSelected
        ? this.selectedPlayerId = playerId
        : playerId === this.selectedPlayerId && !isSelected
          ? this.selectedPlayerId = ""
          : playerId !== this.selectedPlayerId && isSelected
            && this.resetSelection()
            && (this.selectedPlayerId = playerId)
    },
    resetSelection() {
      this.resetButtonWithContent = this.selectedPlayerId
      return true
    },
  },
}
</script>

<style scoped lang="scss">
.player-list {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 0.5rem solid #333333;
  border-radius: 5rem;
  .list-item:last-child {
    border-bottom: none;
  }
  &:not(selection-list) {
    .list-item {
      width: auto;
    }
  }
}

.kick-button {
  background-color: rgb(238, 55, 55);
}

.player-list-item {
  &.disconnected {
    color: rgb(238, 55, 55);
  }
  &.host {
    color: rgb(59, 59, 255);
  }
}

.button.active {
  color: white;
  background-color: rgb(95, 177, 95);
  border-color: rgb(95, 177, 95);
}
</style>