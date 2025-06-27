type EditCell = { cost: number; prev: "top" | "left" | "diagonal" };

// 編集距離のグラフを作成する
const buildEditGraph = (a: string, b: string): EditCell[][] => {
  const graph: (EditCell | undefined)[][] = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => undefined)
  );

  // 周辺部分の初期化
  graph[0][0] = { cost: 0, prev: "diagonal" };
  for (let i = 1; i <= a.length; i++) {
    graph[i][0] = { cost: i, prev: "top" };
  }
  for (let j = 1; j <= b.length; j++) {
    graph[0][j] = { cost: j, prev: "left" };
  }

  // 最短編集距離の計算
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

  return graph as EditCell[][];
};

// graph を辿って共通部分 common を作り、改行で分割。a, b それぞれの末尾に \n があることを前提とする
const getRoughCors = (graph: EditCell[][], a: string, b: string) => {
  const common: { char: string; ai: number; bi: number }[] = [];
  let pos = { i: a.length, j: b.length };

  // graph の右下から左上に向かって辿る
  while (pos.i >= 0 || pos.j >= 0) {
    const cell = graph[pos.i][pos.j]!;
    switch (cell.prev) {
      case "diagonal": {
        common.push({ char: a[pos.i - 1], ai: pos.i - 1, bi: pos.j - 1 });
        pos = { i: pos.i - 1, j: pos.j - 1 };
        break;
      }
      case "top": {
        pos = { i: pos.i - 1, j: pos.j };
        break;
      }
      case "left": {
        pos = { i: pos.i, j: pos.j - 1 };
        break;
      }
    }
  }

  common.pop();
  common.reverse();

  let cors: { ap: string; bp: string }[] = [];
  let lastAi = 0;
  let lastBi = 0;
  for (const { char, ai, bi } of common) {
    if (char === "\n") {
      cors.push({ ap: a.slice(lastAi, ai + 1), bp: b.slice(lastBi, bi + 1) });
      lastAi = ai + 1;
      lastBi = bi + 1;
    }
  }

  return cors;
};

// 2 つの文字列 a と b の部分文字列の対応を取得する
const getLineCors = (arp: string, brp: string): { al: string; bl: string }[] => {
  // 末尾の \n を含む分割
  const arpLines = arp.split(/(?<=\n)/).map((line) => ({ line, used: false }));
  const brpLines = brp.split(/(?<=\n)/).map((line) => ({ line, used: false }));
  const cors: { al: string; bl: string }[] = [];

  for (let i = 0; i < arpLines.length; i++) {
    for (let j = 0; j < brpLines.length; j++) {
      if (arpLines[i].used || brpLines[j].used) continue;
      if (arpLines[i].line === brpLines[j].line) {
        cors.push({ al: arpLines[i].line, bl: brpLines[j].line });
        arpLines[i].used = true;
        brpLines[j].used = true;
      }
    }
    if (!arpLines[i].used) {
      cors.push({ al: arpLines[i].line, bl: "" });
      arpLines[i].used = true;
    }
  }

  for (let j = 0; j < brpLines.length; j++) {
    if (!brpLines[j].used) {
      cors.push({ al: "", bl: brpLines[j].line });
      brpLines[j].used = true;
    }
  }

  return cors;
};

// a と b それぞれの部分文字列の対応を取得。末尾に \n を含む
export const getCors = (a: string, b: string): { ap: string; bp: string }[] => {
  a = a + "\n";
  b = b + "\n";
  const roughCors = getRoughCors(buildEditGraph(a, b), a, b);

  // 交互に片方が空文字列になっている部分を統合
  const result: { ap: string; bp: string }[] = [{ ap: "", bp: "" }];
  for (const { ap, bp } of roughCors) {
    for (const { al, bl } of getLineCors(ap, bp)) {
      if (al !== "" && bl !== "") {
        result.push({ ap: al, bp: bl });
        result.push({ ap: "", bp: "" });
      } else {
        result[result.length - 1].ap += al;
        result[result.length - 1].bp += bl;
        continue;
      }
    }
  }
  return result;
};
