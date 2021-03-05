import { tx, derived } from "tinyx";
import Papa from "papaparse";
import { DataFrame } from 'data-forge@1.8.17/dist/esm/index.esm.js';

export const store = tx({
  df: new DataFrame([]),
  sort: {},
});

export const sort = derived(store, s => s.sort);

export const transformed = derived(store, ({ df, sort }) => {
  if (!sort) return df;

  const sorts = Object.keys(sort)
    .filter(k => sort[k] !== undefined)
    .map((column, i) => [
      column,
      (i === 0 ? "orderBy" : "thenBy") + (sort[column] ? "" : "Descending")
    ]);

  return new DataFrame(
    sorts
      .reduce(
        (acc, [col, method]) => acc[method](r => r[col]),
        df
      ).toArray()
  );
});

function SET_DF(data) {
  return ({ set }) => set('df', data);
}

function SET_SORT(sort) {
  return ({ set }) => set('sort', sort);
}

export function setSort(v) {
  return store.commit(SET_SORT, v);
}

export function readCSV(file) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      worker: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: ({ data }) => resolve(store.commit(SET_DF, new DataFrame(data))),
    })
  })
}
