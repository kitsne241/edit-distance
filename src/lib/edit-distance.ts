type EditCell = { cost: number; prev: "top" | "left" | "diagonal" };

export const getCorrespondence = (a: string, b: string) => {
  const graph: (EditCell | undefined)[][] = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => undefined)
  );

  // 左上のセルを初期化
  graph[0][0] = { cost: 0, prev: "diagonal" };

  // 上と左のセルを初期化
  for (let i = 1; i <= a.length; i++) {
    graph[i][0] = { cost: i, prev: "top" };
  }
  for (let j = 1; j <= b.length; j++) {
    graph[0][j] = { cost: j, prev: "left" };
  }

  // グラフを埋める
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        const diagonal = graph[i - 1][j - 1];
        graph[i][j] = { cost: diagonal!.cost, prev: "diagonal" };
        continue;
      }

      const top = graph[i - 1][j];
      const left = graph[i][j - 1];

      if (top!.cost > left!.cost) {
        graph[i][j] = { cost: left!.cost + 1, prev: "left" };
      } else {
        graph[i][j] = { cost: top!.cost + 1, prev: "top" };
      }
    }
  }

  // 共通部分を算出
  const common: { char: string; ai: number; bi: number }[] = [];
  let traceI = a.length;
  let j = b.length;
  while (traceI >= 0 || j >= 0) {
    const cell = graph[traceI][j]!;
    switch (cell.prev) {
      case "diagonal": {
        common.push({ char: a[traceI - 1], ai: traceI - 1, bi: j - 1 });
        traceI--;
        j--;
        break;
      }
      case "top": {
        traceI--;
        break;
      }
      case "left": {
        j--;
        break;
      }
    }
  }

  common.pop();
  common.reverse();

  // common に含まれる改行で a, b を分割
  let cors: { ar: string; br: string }[] = [];
  let lastAi = 0;
  let lastBi = 0;

  for (const { char, ai, bi } of common) {
    if (char === "\n") {
      cors = [...cors, ...analyzePart(a.slice(lastAi, ai), b.slice(lastBi, bi))];
      lastAi = ai + 1;
      lastBi = bi + 1;
    }
  }
  cors = [...cors, ...analyzePart(a.slice(lastAi, a.length), b.slice(lastBi, b.length))];

  // ar が "" であるものからスタートして、交互に "" になっている限り進み、結果をまとめる
  const merged: { ar: string; br: string }[] = [];
  let mergeI = 0;
  while (mergeI < cors.length) {
    if ((cors[mergeI].ar === "" && cors[mergeI].br !== "") || (cors[mergeI].ar !== "" && cors[mergeI].br === "")) {
      let arGroup: string[] = [];
      let brGroup: string[] = [];
      let j = mergeI;
      while (
        j < cors.length &&
        ((cors[j].ar === "" && cors[j].br !== "") || (cors[j].ar !== "" && cors[j].br === ""))
      ) {
        if (cors[j].ar !== "") arGroup.push(cors[j].ar);
        if (cors[j].br !== "") brGroup.push(cors[j].br);
        j++;
      }
      merged.push({ ar: arGroup.join("\n"), br: brGroup.join("\n") });
      mergeI = j;
    } else {
      merged.push(cors[mergeI]);
      mergeI++;
    }
  }
  return merged;
};

const analyzePart = (a: string, b: string): { ar: string; br: string }[] => {
  const cor: { ar: string; br: string }[] = [];
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const usedB = new Array(bLines.length).fill(false);

  for (let i = 0; i < aLines.length; i++) {
    let matched = false;
    for (let j = 0; j < bLines.length; j++) {
      if (!usedB[j] && aLines[i] === bLines[j]) {
        cor.push({ ar: aLines[i], br: bLines[j] });
        usedB[j] = true;
        matched = true;
        break;
      }
    }
    if (!matched) {
      cor.push({ ar: aLines[i], br: "" });
    }
  }

  for (let j = 0; j < bLines.length; j++) {
    if (!usedB[j]) {
      cor.push({ ar: "", br: bLines[j] });
    }
  }
  return cor;
};
