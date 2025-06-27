<script setup lang="ts">
import { defineProps } from "vue";
import { simpleDecorated } from "@/lib/editor-parse";
defineProps<{ text: { line: string; show: boolean }[]; color?: string }>();
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
          <div :class="$style.dummy">
            <div v-for="(obj, i) in text" :key="i" :class="$style.dummyLine" :style="!obj.show ? { opacity: 0 } : {}">
              <div :class="$style.lineNumber">
                <p :class="$style.lineNumberText" :style="{ color: color }">
                  {{ i + 1 }}
                </p>
              </div>
              <span
                v-for="(part, j) in simpleDecorated(obj.line, { start: 0, end: 0 })[0]"
                :key="j"
                :class="$style.dummyLineText"
                :style="part.style"
              >
                {{ part.part }}
              </span>
            </div>
          </div>
        </div>
      </div>
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

.tools {
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding: 6px;
}
</style>
