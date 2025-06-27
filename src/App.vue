<script setup lang="ts">
import MarkdownEditor from "./components/MarkdownEditor.vue";
import { onMounted } from "vue";
import { editGraph } from "./lib/edit-distance";

onMounted(() => {
  document.title = "Markdown Editor";
  console.log(editGraph("shoe", "ghost"));
});
</script>

<template>
  <div :class="$style.app">
    <div :class="$style.container">
      <div :class="$style.input">
        <div :class="$style.input1">
          <MarkdownEditor text="ここにテキストを入力してください" color="#FF8000" />
        </div>
        <div :class="$style.input2">
          <MarkdownEditor text="ここにテキストを入力してください" color="#00ff80" />
        </div>
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
  width: min(1000px, 100%);
  height: min(500px, 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.input {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input1 {
  height: 100%;
  border: 1px solid #ff8000;
  border-radius: 8px;
  margin-bottom: 20px;
}

.input2 {
  height: 100%;
  border: 1px solid #00ff80;
  border-radius: 8px;
}

.output {
  width: 60%;
  height: 100%;
  margin-left: 20px;
  border: 1px solid #0080ff;
  border-radius: 8px;
}
</style>
