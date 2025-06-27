type EditCell = { cost: number; prev: "top" | "left" | "diagonal" };

export const editGraph = (a: string, b: string) => {
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
  let i = a.length;
  let j = b.length;
  while (i >= 0 || j >= 0) {
    const cell = graph[i][j]!;
    switch (cell.prev) {
      case "diagonal": {
        common.push({ char: a[i - 1], ai: i - 1, bi: j - 1 });
        i--;
        j--;
        break;
      }
      case "top": {
        i--;
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

  console.log("common", common);

  // common に含まれる改行で a, b を分割
  const commonNewLines: { ar: string; br: string }[] = [];
  let lastAi = 0;
  let lastBi = 0;

  for (const { char, ai, bi } of common) {
    if (char === "\n") {
      commonNewLines.push({ ar: a.slice(lastAi, ai), br: b.slice(lastBi, bi) });
      lastAi = ai + 1;
      lastBi = bi + 1;
    }
  }
  commonNewLines.push({ ar: a.slice(lastAi, a.length), br: b.slice(lastBi, b.length) });

  console.log("commonNewLines", commonNewLines);
};
