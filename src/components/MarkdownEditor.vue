<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import { decorated } from "@/lib/editor-parse";
const text = defineModel<string>("text");

defineProps<{ color?: string }>();

const isComposing = ref(false);
const underline = ref<{ start: number; end: number }>({ start: 0, end: 0 });

// 変換部分を含まないテキスト
const textAll = ref("");

// 変換を含むテキスト全体
const ta = ref<HTMLTextAreaElement>();

const handleInput = () => {
  if (!ta.value) return;
  textAll.value = ta.value.value;
  let start = ta.value.selectionStart;
  let end = ta.value.selectionEnd;

  nextTick(() => {
    if (ta.value === undefined || text.value === undefined) return;
    if (isComposing.value) {
      if (start === end) {
        underline.value.start = end - (ta.value.value.length - text.value.length);
      } else {
        underline.value.start = start;
      }
    } else {
      underline.value.start = end;
    }
    underline.value.end = end;

    // カーソル位置を強制的に維持
    ta.value.setSelectionRange(start, end);
  });
};

watch(() => text.value, handleInput);
onMounted(() => nextTick(handleInput));

// 変換の開始・終了のハンドラ
const handleCompose = (state: boolean) => {
  isComposing.value = state;
  text.value = textAll.value;
  handleInput();
};

const enclose = (symbol: string) => {
  if (!ta.value || text.value === undefined) return;
  ta.value.focus();

  let start = ta.value.selectionStart;
  let end = ta.value.selectionEnd;

  let tempText = text.value; // text.value は ModelRef 型であり、即座に変更させてくれない
  tempText = tempText.slice(0, end) + symbol + tempText.slice(end, tempText.length);
  tempText = tempText.slice(0, start) + symbol + tempText.slice(start, tempText.length);
  text.value = tempText;
  const cursorPos = start === end ? end + symbol.length : end + 2 * symbol.length;
  nextTick(() => {
    if (!ta.value) return;
    ta.value.setSelectionRange(cursorPos, cursorPos);
    handleInput();
  });
};
</script>

<template>
  <div :class="$style.container">
    <div style="width: 100%; height: 100%; overflow-y: auto">
      <div
        style="
          width: 100%;
          height: 100%;
          padding: 10px 0 10px 10px;
          min-height: fit-content;
          display: flex;
          align-items: stretch;
        "
      >
        <div style="padding-left: 26px; flex-shrink: 0"></div>
        <div :style="{ flexShrink: 0, borderLeft: `1px dashed ${color}`, paddingRight: '6px' }"></div>
        <div :class="$style.main">
          <textarea
            ref="ta"
            v-model="text"
            @input="handleInput"
            @compositionstart="handleCompose(true)"
            @compositionend="handleCompose(false)"
            :class="$style.input"
          ></textarea>
          <div :class="$style.dummy">
            <div v-for="(line, i) in decorated(textAll, underline)" :key="i" :class="$style.dummyLine">
              <div :class="$style.lineNumber">
                <p :class="$style.lineNumberText" :style="{ color: color }">
                  {{ i + 1 }}
                </p>
              </div>
              <span v-for="(part, j) in line" :key="j" :class="$style.dummyLineText" :style="part.style">
                {{ part.part }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.tools">
      <slot></slot>
      <v-btn
        @click="enclose('**')"
        density="comfortable"
        elevation="0"
        icon="mdi-format-bold"
        baseColor="transparent"
      ></v-btn>
      <v-btn
        @click="enclose('*')"
        density="comfortable"
        elevation="0"
        icon="mdi-format-italic"
        baseColor="transparent"
      ></v-btn>
      <v-btn
        @click="enclose('~~')"
        density="comfortable"
        elevation="0"
        icon="mdi-format-strikethrough"
        baseColor="transparent"
      ></v-btn>
    </div>
  </div>
</template>

<style module>
.container {
  width: 100%;
  height: 100%;
  font-family: "M PLUS Code Latin", "M PLUS 1p";
  font-weight: 400;
  display: flex;
}

.main {
  width: calc(100% - 33px);
  height: 100%;
  min-height: fit-content;
  flex-shrink: 1;
  position: relative;
}

.dummy {
  top: 0px;
  width: 100%;
  padding-bottom: 4em;
  font-family: "M PLUS Code Latin", "M PLUS 1p";
  z-index: 0;
}

.dummyLine {
  position: relative;
  min-height: 1.4em;
  line-height: 1.4;
}

.lineNumber {
  position: absolute;
  left: -42px;
  width: 30px;
}

.lineNumberText {
  text-align: right;
}

.dummyLineText {
  position: relative;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.input {
  position: absolute;
  width: 100%;
  height: 100%;
  resize: none;
  line-height: 1.4;
  z-index: 1;
  color: transparent;
  caret-color: white;
}

.tools {
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding: 6px;
}
</style>
