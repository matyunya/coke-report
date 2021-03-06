import { tx, derived } from "tinyx";
import Papa from "papaparse";
import { DataFrame } from "data-forge@1.8.17/dist/esm/index.esm.js";

const initialState = {
  df: new DataFrame([]),
  sort: {},
  types: new Map(),
  title: "",
  source: `
  // Apply transformations to the data frame.
  // Docs: https://github.com/data-forge/data-forge-ts/blob/master/docs/guide.md
  df => df
`,
  // "editor" | "table" | "chart"
  viewport: "table",
};

export const store = tx(initialState);

export const sort = derived(store, s => s.sort);
export const title = derived(store, s => s.title);
export const types = derived(store, s => s.types);
export const viewport = derived(store, s => s.viewport);
export const source = derived(store, s => s.source);

// Could be useful? should be prepended to source?
// function sortSource(sort) {
//   return "df" + usedSortFields(sort)
//     .map((column, i) => [
//       column,
//       (i === 0 ? "orderBy" : "thenBy") + (sort[column] ? "" : "Descending")
//     ])
//     .reduce(
//       (acc, [col, method]) => `${acc}.${method}(r => r["${col}"])\n\t`,
//       ""
//     );
// }

const usedSortFields = sort => Object.keys(sort).filter(k => sort[k] !== undefined);

function sortsDescription(sort) {
  if (usedSortFields(sort).length === 0) {
    return "Original source sorting.";
  }

  return "Sorted by " + usedSortFields(sort)
    .map((col) => col + (sort[col] ? "" : " descending"))
    .join(", ") + ".";
}

function getOrderedSorts(sort) {
  return usedSortFields(sort)
    .map((column, i) => [
      column,
      (i === 0 ? "orderBy" : "thenBy") + (sort[column] ? "" : "Descending")
    ]);
}

export const transformed = derived(store, ({ df, sort, source }) => {
  const newDf = window.eval.call(window, source)(df);

  const sorts = usedSortFields(sort);
  if (!sorts.length) return newDf;

  return new DataFrame(
    getOrderedSorts(sort)
      .reduce((acc, [col, method]) => acc[method](r => r[col]), newDf)
      .toArray()
  );
});

const intl = new Intl.NumberFormat();

export const summary = derived(store, ({ sort, df }) => {
  return `Total ${intl.format(df.count())} rows. ${sortsDescription(sort)}`;
});

function SET_DF({ df, title }) {
  return ({ set }) => set({
    ...initialState,
    df,
    title,
  });
}

function SET_SORT(sort) {
  return ({ set }) => set("sort", sort);
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
      error: (error) => reject(error),
      complete: ({ data }) => resolve(
        store.commit(SET_DF, { df: new DataFrame(data), title: file.name })
      ),
    })
  })
}

const VIEWPORTS = new Set(["editor", "table", "chart"]);

export function setViewport(value) {
  if (!VIEWPORTS.has(value)) {
    throw new Error("Unknown viewport value");
  }

  return store.commit(() => ({ set }) => set("viewport", value));
}

export function saveSource(value) {
  return store.commit(() => ({ set }) => {
    set("source", value || "i => i");
    set("viewport", "table");
  });
}
