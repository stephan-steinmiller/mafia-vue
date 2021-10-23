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
  props: {
    isActiveDefault: Boolean,
  },
  data() {
    return {
      isActive: this.isActiveDefault || false,
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
.button:not(.active) {
  padding: 0 3.65rem;
}
</style>