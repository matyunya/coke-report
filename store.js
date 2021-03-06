import { tx, derived } from "tinyx";
import Papa from "papaparse";
import { DataFrame } from 'data-forge@1.8.17/dist/esm/index.esm.js';

export const store = tx({
  df: new DataFrame([]),
  sort: {},
  types: new Map(),
  title: "",
});

// window.eval.call(window,'(function (element) {'+src+'})')(element);

export const sort = derived(store, s => s.sort);
export const title = derived(store, s => s.title);
export const types = derived(store, s => s.types);

function getOrderedSorts(sort) {
  return usedSortFields(sort)
    .map((column, i) => [
      column,
      (i === 0 ? "orderBy" : "thenBy") + (sort[column] ? "" : "Descending")
    ]);
}

export const transformed = derived(store, ({ df, sort }) => {
  if (!sort) return df;

  return new DataFrame(
    getOrderedSorts(sort)
      .reduce(
        (acc, [col, method]) => acc[method](r => r[col]),
        df
      ).toArray()
  );
});

const usedSortFields = sort => Object.keys(sort).filter(k => sort[k] !== undefined);

function sortsDescription(sort) {
  if (usedSortFields(sort).length === 0) {
    return "Original source sorting.";
  }

  return "Sorted by " + usedSortFields(sort)
    .map((col) => col + (sort[col] ? "" : " descending"))
    .join(", ") + ".";
}

const intl = new Intl.NumberFormat();

export const summary = derived(store, ({ sort, df }) => {
  return `Total ${intl.format(df.count())} rows. ${sortsDescription(sort)}`;
});

function SET_DF({ df, title }) {
  return ({ set }) => set({
    df,
    title,
    sort: {},
    types: new Map()
  });
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
