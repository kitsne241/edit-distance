<script setup lang="ts">
import MarkdownEditor from "./components/MarkdownEditor.vue";
import { onMounted, ref } from "vue";
import { editGraph } from "./lib/edit-distance";

const text1 = ref("sta\nnda\nrd");
const text2 = ref("stu\ndent");

onMounted(() => {
  document.title = "Markdown Editor";
  console.log(editGraph("sta\nnda\nrd", "stu\ndent"));
});
</script>

<template>
  <div :class="$style.app">
    <div :class="$style.container">
      <div :class="$style.input1">
        <MarkdownEditor v-model:text="text1" color="#FF8000" />
      </div>
      <div :class="$style.input2">
        <MarkdownEditor v-model:text="text2" color="#00ff80" />
      </div>
      <div :class="$style.output">Hello1</div>
    </div>
  </div>
</template>

<style module>
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: min(1200px, 100%);
  height: min(800px, 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.input1 {
  position: absolute;
  top: 16px;
  left: 16px;
  width: calc(50% - 24px);
  height: 200px;
  outline: 1px solid #ff8000;
  border-radius: 8px;
}

.input2 {
  position: absolute;
  top: 16px;
  right: 16px;
  width: calc(50% - 24px);
  height: 200px;
  outline: 1px solid #00ff80;
  border-radius: 8px;
}

.output {
  position: absolute;
  bottom: 16px;
  left: 16px;
  width: calc(100% - 32px);
  height: calc(100% - 248px);
  outline: 1px solid #0080ff;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
