import { tx, derived } from "tinyx";
import Papa from "papaparse";
import { DataFrame } from 'data-forge@1.8.17/dist/esm/index.esm.js';

export const store = tx({
  df: new DataFrame([]),
  sort: {},
  title: "",
});

// window.eval.call(window,'(function (element) {'+src+'})')(element);

export const sort = derived(store, s => s.sort);
export const title = derived(store, s => s.title);

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

function SET_DF({ df, title }) {
  return ({ set }) => {
    set('df', df);
    set('title', title);
  }
}

function SET_SORT(sort) {
  return ({ set }) => set('sort', sort);
}

export function setSort(v) {
  return store.commit(SET_SORT, v);
}

export function readCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      worker: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      error: (error) => reject(error),
      complete: ({ data }) => resolve(
        store.commit(SET_DF, { df: new DataFrame(data), title: file.name })
      ),
    })
  })
}
