import download from "~ellx-hub/lib/utils/download.js";
import { generateExcel, uploadTemplate } from "./worker.js";
import { get } from "svelte/store";
import { csvData } from "./store.js";
import { runSaga } from 'redux-saga';

// Suppress logging errors bubbled up from spawned tasks
const onError = () => {};

export const dispatch = runSaga.bind(null, { onError });
export const run = (flow, ...args) => dispatch(flow, ...args).toPromise();

// TODO: convert to generator to allow canceling logic
export default async function dl() {
  console.log(new Date(), 'init');
  const buf = await run(generateExcel, get(csvData).toArray());

  const blob = new Blob([buf], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

  console.log(new Date(), 'downloading');

  return download("report.xlsx", blob);
}

export function fetchTemplate(file) {
  const reader = new FileReader();
  reader.onload = async (e) =>  {
    const data = new Uint8Array(e.target.result);
    await run(uploadTemplate, data);
  };
  reader.readAsArrayBuffer(file);
}
