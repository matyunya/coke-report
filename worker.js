import { cps } from 'redux-saga/effects';

function createWorker(fn) {
  const code = fn.toString().replace(/^function.+?\{/g, '').slice(0, -1);
  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);

  return new Worker(url);
}

function makeWorker(bodyFunction) {
  const worker = createWorker(bodyFunction);
  const runningTasks = new Map();

  worker.onmessage = event => {
    const { type, taskId, entityId, output } = event.data;
    const request = runningTasks.get(entityId);

    console.log({request, type, taskId, entityId, output})

    if (!request || request.taskId !== taskId) return;
    const response = type === 'error' ? [new Error(output)] : [null, output];

    runningTasks.delete(entityId);
    for (let cb of request.callbacks) cb(...response);
  };

  return function runTask(entityId, params, cb) {
    const taskId = String(Math.random());
    const { callbacks } = runningTasks.get(entityId) || { callbacks: [] };
    callbacks.push(cb);

    runningTasks.set(entityId, { taskId, callbacks });

    console.log(runningTasks.get(entityId));

    worker.postMessage({ taskId, entityId, ...params });
  }
}


function xlsxWorker() {
  importScripts(
    "https://cdn.jsdelivr.net/npm/xlsx-populate/browser/xlsx-populate.min.js",
    );

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  const alphabet = [...letters, ...letters.map(i => "A" + i)];
  let wb;

  const prepare = fetch("http://localhost:7778/template.xlsx")
    .then(res => res.arrayBuffer())
    .then(template => XlsxPopulate.fromDataAsync(template))
    .then(workbook => wb = workbook);

  async function build(params) {
    await prepare;
    params.data.forEach((row, i) => {
      Object.keys(row).forEach((key, j) => {
        wb.sheet("d1").cell(alphabet[j + 1] + (i + 13)).value(row[key]);
        wb.sheet("dMkt").cell(alphabet[j + 1] + (i + 13)).value(row[key]);
        wb.sheet("SSDTTL").cell(alphabet[j + 23] + (i + 13)).value(row[key]);
        wb.sheet("SSDTTL2").cell(alphabet[j + 23] + (i + 13)).value(row[key]);
      });
    });

    return wb.outputAsync("arraybuffer");
  }

  self.addEventListener('message', async (event) => {
    if (event.data.type === 'build') {
      const {
        taskId,
        id,
        ...params
      } = event.data;

      try {
        const output = await build(params);
        self.postMessage({
          taskId,
          output,
          entityId: "test",
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error('Unknown message type');
    }
  });
}

const requestGenerate = makeWorker(xlsxWorker);

export function* generateExcel(data) {
  return yield cps(requestGenerate, "test", { data, type: 'build' });
}
