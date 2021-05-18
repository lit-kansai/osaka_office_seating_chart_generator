<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="stylus">
.tokumasa-title {
  cursor: pointer;
  width: fit-content;
  transition: 0.15s;

  &:hover {
    opacity: 0.7;
  }
}
</style>
