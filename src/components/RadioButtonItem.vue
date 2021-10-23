<template>
  <ListItem class="list-item button" @click="onToggle()">
    {{content}}
    <div class="radio-button outer-circle" :class="{ 'is-selected': isSelected }">
      <div class="radio-button inner-circle"></div>
    </div>
  </ListItem>
</template>

<script>
import ListItem from '@/components/ListItem.vue'
// @ is an alias to /src

export default {
  name: 'RadioButtonItem',
  props: {
    resetButton: String,
    content: String,
  },
  data() {
    return {
      isSelected: false,
    }
  },
  mounted() {
  },
  components: {
    ListItem,
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
  color: black;
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
</style>