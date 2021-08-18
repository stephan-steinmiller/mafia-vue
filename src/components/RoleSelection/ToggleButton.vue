<template>
  <div class="home">
      <button class="button roles-button" :class="{ 'active': isActive }" @click="onToggle()">
        <slot>Role</slot>
      </button>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'ToggleButton',
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
  background: var(--green-gradient);
  border: none;
}
</style>