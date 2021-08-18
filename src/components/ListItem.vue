<template>
  <div class="list-item">
    <slot>Player Name</slot>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'ListItem',
  data() {
    return {
    }
  },
  watch: {
  },
  methods: {
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
  border-bottom: 0.5rem solid #333333;
  padding: 2rem 8rem;
  width: 100%;
  font-size: 4rem;
  text-decoration: none;
  color: #2c3e50;
  border-radius: 0;
}
</style>