<template>
  <div class="role-selection view">
    <div class="page-content">
      <div class="page-info roles-info">Chose your citizens roles:</div>
      <div class="roles">
        <template v-for="(role, index) in roles" :key="role.roleName">
          <div v-if="index === 6" class="page-info roles-info mafia">Chose your mafia roles:</div>
          <CountButton
            v-if="role.countable"
            :roleName="role.roleName"
            :roleCountDefault="1"
            @count-changed="onCountChanged(index, $event)"
          >
          {{role.roleName}}
          </CountButton>
          <ToggleButton 
            v-else
            :isActiveDefault="true"
            @active-changed="onActiveChanged(index, $event)"
          >
          {{role.roleName}}
          </ToggleButton>
        </template>
      </div>
    </div>
    <button class="button next-button" :class="{ 'active': roleSelectionIsSufficient }" @click="nextPage">Accept</button>
  </div>
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
          count: 1,
        },
        {
          roleName: "Detective",
          count: 1,
        },
        {
          roleName: "Doctor",
          count: 1,
        },
        {
          roleName: "Joker",
          count: 1,
        },
        {
          roleName: "Eulenspiegel",
          count: 1,
        },
        {
          roleName: "Employment Agent",
          count: 1,
        },
        {
          roleName: "Normal Mafia",
          countable: true,
          count: 1,
        },
        {
          roleName: "Godfather",
          count: 1,
        },
        {
          roleName: "Cover",
          count: 1,
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
    this.$store.state.roles.length > 0 && (this.roles = this.$store.state.roles)
  },
  methods: {
    onActiveChanged(index, isActive) {
      this.roles[index].count = isActive ? 1 : 0
      this.$store.commit("setRoles", this.roles)
    },

    onCountChanged(index, count) {
      this.roles[index].count = count
      this.$store.commit("setRoles", this.roles)
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
}

.roles{
  max-width: 100%;
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  gap: 1rem;
  
}

.roles-button {
  min-width: none;
}
</style>