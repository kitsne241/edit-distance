type EditCell = { cost: number; prev: "top" | "left" | "diagonal" };
type Operation = { type: "insert" | "delete"; char: string; index: number };

export const editGraph = (a: string, b: string): Operation[] => {
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

  // 編集を逆算
  const operations: Operation[] = [];
  let i = a.length;
  let j = b.length;
  while (i >= 0 || j >= 0) {
    const cell = graph[i][j]!;
    switch (cell.prev) {
      case "diagonal": {
        i--;
        j--;
        break;
      }
      case "top": {
        operations.push({ type: "delete", char: a[i - 1], index: i - 1 });
        i--;
        break;
      }
      case "left": {
        operations.push({ type: "insert", char: b[j - 1], index: j - 1 });
        j--;
        break;
      }
    }
  }

  return operations.reverse();
};
