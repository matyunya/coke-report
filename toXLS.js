import download from "~ellx-hub/lib/utils/download.js";
import { generateExcel, uploadTemplate } from "./worker.js";
import { transformed } from "./store.js";
import { runSaga } from 'redux-saga';

// Suppress logging errors bubbled up from spawned tasks
const onError = () => {};

export const dispatch = runSaga.bind(null, { onError });
export const run = (flow, ...args) => dispatch(flow, ...args).toPromise();

// TODO: convert to generator to allow canceling logic
export default async function dl() {
  const buf = await run(generateExcel, transformed.get().toArray());
  const blob = new Blob([buf], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

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
