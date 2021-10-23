<template>
  <div v-if="isSelectable" class="list-item button" @click="onToggle()">
    <slot>{{content}}</slot>
    <div class="radio-button outer-circle" :class="{ 'is-selected': isSelected }">
      <div class="radio-button inner-circle"></div>
    </div>
  </div>
  <div v-else class="list-item">
    <slot>{{content}}</slot>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'ListItem',
  props: {
    isSelectable: Boolean,
    resetButton: String,
    content: String,
  },
  data() {
    return {
      isSelected: false,
    }
  },
  watch: {
    resetButton(content) {
      this.content === content && this.isSelected
        && (this.isSelected = false)
    },
  },
  methods: {
    onToggle() {
      this.isSelected = !this.isSelected
      this.$emit('is-selected-changed', this.isSelected)
    },
  },
}
</script>

<style scoped lang="scss">
.list-item {
  background: none;
  box-sizing: content-box;
  display: flex;
  height: 10rem;
  justify-content: space-between;
  align-items: center;
  // border-bottom: 0.5rem solid #333333;
  padding: 2rem 8rem;
  width: 100%;
  // width: auto;
  font-size: 4rem;
  text-decoration: none;
  color: #2c3e50;
  border-radius: 0;
  .radio-button.outer-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 6rem;
    width: 6rem;
    background: none;
    border: 0.5rem solid #333333;
    border-radius: 999999px;
    cursor: pointer;
    text-decoration: none;

    &.is-selected {
      border-color: var(--green);

      .inner-circle {
        height: 4rem;
        width: 4rem;

        border-radius: 999999px;
        background: var(--green-gradient);
      }
    }
  }
}

// @media (orientation: portrait) {
//   .list-item {
//     padding: 2rem 4rem;
//   }
// }
</style>