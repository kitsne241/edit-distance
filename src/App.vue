<script setup lang="ts">
import MarkdownEditor from "./components/MarkdownEditor.vue";
import TextViewer from "./components/TextViewer.vue";
import { onMounted, ref, watchEffect } from "vue";
import { getCors } from "./lib/edit-distance";

const text1 = ref("ABC");
const text2 = ref("DEF");

type ShowType = "hidden" | "shown" | "colored";
const diff1 = ref<{ line: string; show: ShowType }[]>([]);
const diff2 = ref<{ line: string; show: ShowType }[]>([]);

watchEffect(() => {
  const cors = getCors(text1.value, text2.value);
  console.log("cors:", cors);
  const arr: { line: string; show1: ShowType; show2: ShowType }[] = [];
  for (let { ap, bp } of cors) {
    if (ap === "" && bp === "") continue;
    if (ap === bp) {
      for (const line of ap.split("\n").slice(0, -1)) {
        arr.push({ line, show1: "shown", show2: "shown" });
      }
      continue;
    } else {
      for (const line of ap.split("\n").slice(0, -1)) {
        arr.push({ line, show1: "colored", show2: "hidden" });
      }
      for (const line of bp.split("\n").slice(0, -1)) {
        arr.push({ line, show1: "hidden", show2: "colored" });
      }
    }
  }
  console.log("arr:", arr);

  diff1.value = arr.map((l) => ({ line: l.line, show: l.show1 }));
  diff2.value = arr.map((l) => ({ line: l.line, show: l.show2 }));
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
        <div :class="$style.output1">
          <TextViewer :text="diff1" color="#FF8000" />
        </div>
        <div :class="$style.output2">
          <TextViewer :text="diff2" color="#00ff80" />
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
  display: flex;
}

.output1 {
  position: absolute;
  width: calc(50% - 8px);
  height: 100%;
}

.output2 {
  position: absolute;
  right: 0px;
  width: calc(50% - 8px);
  height: 100%;
}
</style>
