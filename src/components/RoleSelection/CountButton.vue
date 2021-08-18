<template>
      <button  class="button roles-button" :class="{ 'inactive-button': roleCount === 0 }">
        <button class="count-button subtract" @click="onChange(false)">-</button>
        {{roleCount}} <slot>Default Role</slot>
        <button class="count-button add" @click="onChange(true)">+</button>
      </button>
</template>

<script>
const { ROLE_NAMES } = require('../../constants')
console.log("rolename:",ROLE_NAMES.NORMAL_MAFIA);
// @ is an alias to /src

export default {
  name: 'CountButton',
  props: {
    roleName: String,
  },
  data() {
    return {
      roleCount: 0,
    }
  },
  mounted() {
    (this.roleName === ROLE_NAMES.NORMAL_MAFIA) && this.onChange(true)
  },
  methods: {
    onChange(isAdd) {
      if (isAdd) {
        this.roleCount++
      } else {
        if (this.roleCount >= 2 && this.roleName === ROLE_NAMES.NORMAL_MAFIA || this.roleCount >= 1 && this.roleName === ROLE_NAMES.NORMAL_CITIZEN ) {
          this.roleCount--
        }
      }
      this.$emit('count-changed', this.roleCount)
    },
  },
}
</script>

<style scoped lang="scss">

.button.roles-button {
  padding: 2rem 0;
  color: white;
  background: var(--green-gradient);
  border: none;
  display: flex;
  flex-direction: row;

  &.inactive-button {
    color: black;
    border: 0.5rem solid #333333;
    background: none;

    .count-button {
      color: black;
    }
  }

  .count-button {
    height: 9.5rem;
    width: 9.5rem;
    background: none;
    border: none;
    color: white;
    border-radius: 999999px;
    cursor: pointer;
    text-decoration: none;
    font-size: 4rem;
    font-family: inherit;
    // &.subtract {
    //   padding: 0 2rem;
    // }
    // &.add {
    //   padding: 0 2rem;
    // }
  }
}
</style>