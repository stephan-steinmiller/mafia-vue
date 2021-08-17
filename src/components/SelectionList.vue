<template>
    <button class="button roles-button" :class="{ 'active': isActive }" @click="onToggle()">
      <slot>Role</slot>
    </button>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'SelectionList',
  props: {
    type: Boolean,
  },
  data() {
    return {
      isActive: false,
    }
  },
  methods: {
    onToggle() {
      this.isActive = !this.isActive
      this.$emit('active-changed', this.isActive)
    },
  },
}
</script>

<style scoped lang="scss">

.button.active {
  color: white;
  background-color: rgb(95, 177, 95);
  border-color: rgb(95, 177, 95);
}
</style>