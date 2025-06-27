<script setup lang="ts">
import MarkdownEditor from "./components/MarkdownEditor.vue";
import TextViewer from "./components/TextViewer.vue";
import { onMounted, ref, watchEffect } from "vue";
import { commonLines } from "./lib/edit-distance";

const text1 = ref("sta\nnda\nrd");
const text2 = ref("stu\ndent");

const diff1 = ref<{ line: string; show: boolean }[]>([]);
const diff2 = ref<{ line: string; show: boolean }[]>([]);

watchEffect(() => {
  const pairs = commonLines(text1.value, text2.value);
  const arr: { line: string; show1: boolean; show2: boolean }[] = [];
  for (const { ar, br } of pairs) {
    if (ar === br) {
      for (const line of ar.split("\n")) {
        arr.push({ line, show1: true, show2: true });
      }
    } else {
      if (ar !== "") {
        for (const line of ar.split("\n")) {
          arr.push({ line, show1: true, show2: false });
        }
      }
      if (br !== "") {
        for (const line of br.split("\n")) {
          arr.push({ line, show1: false, show2: true });
        }
      }
    }
  }
  // 末尾の空行が混ざる場合は除外
  diff1.value = arr.map((l) => ({ line: l.line, show: l.show1 })).filter((l) => l.line !== undefined);
  diff2.value = arr.map((l) => ({ line: l.line, show: l.show2 })).filter((l) => l.line !== undefined);
});

onMounted(() => {
  document.title = "Diff";
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
      <div :class="$style.output">
        <div style="display: flex; width: 100%; height: 100%">
          <div style="width: 50%; height: 100%; border-right: 1px solid #ccc">
            <TextViewer :text="diff1" color="#FF8000" />
          </div>
          <div style="width: 50%; height: 100%">
            <TextViewer :text="diff2" color="#00ff80" />
          </div>
        </div>
      </div>
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
  overflow: auto;
}

.diffTable {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: "M PLUS Code Latin", "M PLUS 1p";
}

.diffRow {
  display: flex;
  flex-direction: row;
  min-height: 1.5em;
}

.diffCellLeft,
.diffCellRight {
  width: 50%;
  padding: 2px 8px;
  white-space: pre;
  box-sizing: border-box;
}

.diff .diffCellLeft {
  color: #ff8000;
}

.diff .diffCellRight {
  color: #00ff80;
}
</style>
