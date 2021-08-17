<template>
  <div class="role-selection">
    <div class="page-info roles-info">Chose your citizens roles:</div>
    <div class="roles">
      <template v-for="(role, index) in roles" :key="role.roleName">
        <div v-if="index === 6" class="page-info roles-info mafia">Chose your mafia roles:</div>
        <CountButton v-if="role.countable" :roleName="role.roleName" @count-changed="onCountChanged(index, $event)">{{role.roleName}}</CountButton>
        <ToggleButton v-else @active-changed="onActiveChanged(index, $event)">{{role.roleName}}</ToggleButton>
      </template>
    </div>
  </div>
  <button class="button next-button" :class="{ 'active': roleSelectionIsSufficient }" @click="nextPage">Accept</button>
</template>

<script>
// @ is an alias to /src
import ToggleButton from '@/components/RoleSelection/ToggleButton.vue'
import CountButton from '@/components/RoleSelection/CountButton.vue'

export default {
  name: "RoleSelection",
  data() {
    return {
      selectionError: false,
      roles: [
        {
          roleName: "Normal Citizen",
          countable: true,
          count: 0,
        },
        {
          roleName: "Detective",
          count: 0,
        },
        {
          roleName: "Doctor",
          count: 0,
        },
        {
          roleName: "Joker",
          count: 0,
        },
        {
          roleName: "Eulenspiegel",
          count: 0,
        },
        {
          roleName: "Employment Agent",
          count: 0,
        },
        {
          roleName: "Normal Mafia",
          countable: true,
          count: 0,
        },
        {
          roleName: "Godfather",
          count: 0,
        },
        {
          roleName: "Cover",
          count: 0,
        },
      ],
    }
  },
  watch: {
    roleSelectionIsSufficient() {
      this.roleSelectionIsSufficient && (this.selectionError = false)
    },
    "$store.state.isHost" () {
      !this.$store.state.isHost && this.$router.push({path: "/playerWaiting"})
    },
  },
  computed: {
    roleSelectionIsSufficient() {
      return this.totalSelectedRolesCount >= this.$store.state.players.length
    },
    totalSelectedRolesCount() {
      let totalSelectedRolesCounter = 0
      this.roles.forEach(role => {
        totalSelectedRolesCounter += role.count
      });
      return totalSelectedRolesCounter
    },
  },
  components: {
    ToggleButton,
    CountButton,
  },
  mounted() {
    !this.$store.state.isHost && this.$router.push({path: "/playerWaiting"})
  },
  methods: {
    onActiveChanged(index, isActive) {
      this.roles[index].count = isActive ? 1 : 0
    },

    onCountChanged(index, count) {
      this.roles[index].count = count
    },
    nextPage() {
      if (this.$store.state.isHost) {
        if (this.roleSelectionIsSufficient) {
          this.$store.dispatch("setRolesPool", this.roles)
          this.$store.commit('setRolesSelectionFinished', true)    
          this.$router.push({path: "/playerWaiting"})      
        } else {
          this.selectionError = true
        }
      }
    }
  },
}
</script>

<style scoped lang="scss">

.roles-info{
  width: 100%;
  font-size: 4rem;
  margin-top: 6rem;
}

.roles{
  max-width: 100%;
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  gap: 1rem;
  margin: 6rem 0;
  
}

.roles-button {
  min-width: none;
}

.next-button{
  justify-self: flex-start; 
}
</style>