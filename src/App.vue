<script setup lang="ts">
import MarkdownEditor from "./components/MarkdownEditor.vue";
</script>

<template>
  <div :class="$style.app">
    <MarkdownEditor text="ここにテキストを入力してください" color="#FF8000" />
  </div>
</template>

<style module>
.app {
  width: 100vw;
  height: 100vh;
}
</style>
