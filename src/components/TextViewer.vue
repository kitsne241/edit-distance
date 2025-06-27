<script setup lang="ts">
import { defineProps } from "vue";
import { simpleDecorated } from "@/lib/editor-parse";
type ShowType = "hidden" | "shown" | "colored";

defineProps<{ text: { line: string; show: ShowType }[]; color?: string }>();

function hexToRgba(hex: string, alpha: number) {
  if (!hex) return "";
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  if (c.length !== 6) return "";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
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
            <div
              v-for="(obj, i) in text"
              :key="i"
              :class="$style.dummyLine"
              :style="
                obj.show === 'hidden'
                  ? { opacity: 0 }
                  : obj.show === 'colored' && color
                  ? { background: hexToRgba(color, 0.1) }
                  : {}
              "
            >
              <div :class="$style.lineNumber">
                <p v-if="obj.show !== 'hidden'" :class="$style.lineNumberText" :style="{ color: color }">
                  {{ text.slice(0, i + 1).filter((x) => x.show !== "hidden").length }}
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
  margin-right: 6px;
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
