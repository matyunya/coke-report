import { writable, derived } from "svelte/store";
import Papa from "papaparse";
import { DataFrame } from 'data-forge@1.8.17/dist/esm/index.esm.js';

export const csvData = writable(new DataFrame([]));
export const sort = writable({});

// TODO: to tinyx v2
export const transformed = derived([csvData, sort], ([$df, $sort]) => {
  if (!$sort) return $df;

  const sorts = Object.keys($sort)
    .filter(k => $sort[k] !== undefined)
    .map((column, i) => [
      column,
      (i === 0 ? "orderBy" : "thenBy") + ($sort[column] ? "" : "Descending")
    ]);

  return new DataFrame(sorts
    .reduce(
      (acc, [col, method]) => acc[method](r => r[col]),
      $df
    ).toArray());
})

export function readCSV(file) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      worker: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: ({ data }) => resolve(csvData.set(new DataFrame(data))),
    })
  })
}
