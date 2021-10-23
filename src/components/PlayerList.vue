<template>
  <div class="player-list" v-if="$store.state.players.length>0">
    <template v-if="this.isSelectionList">
      <template v-for="player in $store.state.players">
        <ListItem
          :isSelectable="true"
          :content="player.playerName"
          :resetButton="resetButtonWithContent"
          @is-selected-changed="selectionChanged(player.playerName, $event)"
          :key="player.playerName"
          v-if="player.playerName !== $store.state.playerName"
        >
        </ListItem>
      </template>
    </template>

    <ListItem
      v-else
      class="player-list-item"
      :isSelectable="false"
      v-for="player in $store.state.players"
      :key="player.playerName"
      :class="{
        'host': player.isHost,
        'client': player.playerName === $store.state.playerName,
        'disconnected': !player.isConnected,
      }"
    >
      {{player.playerName}}
      <button
        v-if="$store.state.isHost && (player.playerName !== $store.state.playerName)"
        class="button kick-button"
        @click="kickPlayer(player.playerName)"
      >kick</button>
    </ListItem>
  </div>
</template>

<script>
import ListItem from '@/components/ListItem.vue'
// @ is an alias to /src

export default {
  name: 'PlayerList',
  props: {
    isSelectionList: Boolean,
    selectableMaxCount: Number,
  },
  data() {
    return {
      resetButtonWithContent: "",
      selectedPlayerName: "",
      selectedPlayerNames: [],
    }
  },
  mounted() {
  },
  components: {
    ListItem,
  },
  methods: {
    kickPlayer(playerName) {
      this.$store.commit("setPlayerToKickName", playerName)
      this.$store.dispatch("kickPlayer")
    },
    selectionChanged(playerName, isSelected) {
      if( this.selectableMaxCount===1 ) {
        // first Selection
        if( this.selectedPlayerName === "" && isSelected )
          this.selectedPlayerName = playerName
        // unselected
        else if( playerName === this.selectedPlayerName && !isSelected )
          this.selectedPlayerName = ""
        // new Selection
        else if( playerName !== this.selectedPlayerName && isSelected ) {
          this.resetSelection()
          this.selectedPlayerName = playerName
        }
        this.$emit( 'is-selected-changed', this.selectedPlayerName )

      } else if( this.selectableMaxCount>1 ) {
        // a Selection
        if( this.selectedPlayerNames.length < selectableMaxCount && isSelected )
          this.selectedPlayerNames.push(playerName)
        // unselected
        else if( !isSelected )
          this.selectedPlayerNames.filter( element => element !== playerName )
        // too many Selections
        else if( selectedPlayerNames === selectableMaxCount && isSelected ) {
          this.selectedPlayerName = playerName
          this.resetSelection()
        }
        this.$emit( 'is-selected-changed', this.selectedPlayerNames )
      }
    },
    resetSelection() {
      this.resetButtonWithContent = this.selectedPlayerName
    },
  },
}
</script>

<style scoped lang="scss">
.player-list {
  padding: 2rem 0rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 80%;
  border: 0.5rem solid #777676;
  border-radius: 5rem;
  .list-item:last-child {
    border-bottom: none;
  }
  &:not(.selection-list) {
    .list-item {
      width: auto;
    }
  }
}

.kick-button {
  background: var(--red-gradient);
}

.player-list-item {
  &.disconnected {
    color: var(--red);
  }
  .client {
    color: var(--green);
  }
  &.host {
    color: var(--blue);
  }
}
</style>