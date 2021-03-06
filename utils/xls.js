import download from "~ellx-hub/lib/utils/download.js";
import { transformed, title } from "/store.js";
import { runSaga } from 'redux-saga';
import { cps } from 'redux-saga/effects';
import makeWorker from "/utils/worker.js";

function xlsxWorker() {
  importScripts(
    "https://cdn.jsdelivr.net/npm/xlsx-populate/browser/xlsx-populate.min.js",
  );
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  const alphabet = [...letters, ...letters.map(i => "A" + i)];
  let wb;

  // TODO: API to pass rows/columns to write
  async function build(params) {
    params.data.forEach((row, i) => {
      Object.keys(row).forEach((key, j) => {
        wb.sheet(0).cell(`${alphabet[j]}${i + 1}`).value(row[key]);
      });
    });

    return wb.outputAsync("arraybuffer");
  }

  self.addEventListener('message', async (event) => {
    if (event.data.type === 'template') {
      wb = await XlsxPopulate.fromDataAsync(event.data.data);
      return;
    }

    if (event.data.type === 'build') {
      let {
        taskId,
        id,
        ...params
      } = event.data;

      if (!wb) {
        wb = await XlsxPopulate.fromBlankAsync();
      }

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

export function* uploadTemplate(arrayBuffer) {
  return yield cps(requestGenerate, "set template", { data: arrayBuffer, type: 'template' });
}

// Suppress logging errors bubbled up from spawned tasks
const onError = () => {};

export const dispatch = runSaga.bind(null, { onError });
export const run = (flow, ...args) => dispatch(flow, ...args).toPromise();

// TODO: convert to generator to allow canceling logic
export default async function dl() {
  const buf = await run(generateExcel, transformed.get().toArray());
  const blob = new Blob([buf], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

  return download(title.get().replace(/\.(.*)$/, ".xlsx"), blob);
}

export function fetchTemplate(file) {
  const reader = new FileReader();
  reader.onload = async (e) =>  {
    const data = new Uint8Array(e.target.result);
    await run(uploadTemplate, data);
  };
  reader.readAsArrayBuffer(file);
}
