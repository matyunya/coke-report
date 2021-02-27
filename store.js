import { derived, select, tx } from "tinyx";
import { writable } from "svelte/store";
import { fromCSV, DataFrame } from 'data-forge@1.8.17/dist/esm/index.esm.js';
import getRandomData from "./random.js";
import {
  toBlocks,
  calcRowsCols,
} from "./blocks.js";

export const store = tx(writable({
  orderBy: {
    column: "year",
    asc: false,
  },
  csv: "",
  prefecture: "Kanagawa (神奈川県)",
  df: null,
  useGeneratedData: false,
  aggregated: null,
  orderByAggregated: {
    column: "year",
    asc: false,
  },
}));

export const orderBy = select(store, () => ['orderBy']);
export const orderByAggregated = select(store, () => ['orderByAggregated']);
export const prefecture = derived(store, s => s.prefecture);
export const csv = derived(store, s => s.csv);
export const useGeneratedData = derived(store, s => s.useGeneratedData);
export const df = select(store, () => ['df']);

const orderByDirFn = val => val.asc ? "orderBy" : "orderByDescending";
const orderByColFn = val => row => row[val.column];

export const orderMethod = derived(
  orderBy,
  orderByDirFn,
);

export const orderPred = derived(
  orderBy,
  orderByColFn,
);

export const orderMethodAgg = derived(
  orderByAggregated,
  orderByDirFn,
);

export const orderPredAgg = derived(
  orderByAggregated,
  orderByColFn,
);

const randomData = getRandomData();

export const processedCSV = derived(useGeneratedData, $v => {
  return $v ? new DataFrame(randomData) : fromCSV(csv.get());
});

export const preprocessed = derived(
  store,
  () => processedCSV
    .get()
    .parseFloats(["amount"])
    .dropSeries(prefecture.get() ? ["region", "month"] : ["month"])
);

export const processed = derived(
  preprocessed,
  $v => $v[orderMethod.get()](orderPred.get())
    .where(row => prefecture.get() ? row.prefecture === prefecture.get() : true)
    .dropSeries(prefecture.get() ? ["prefecture"] : [])
    .toArray()
);

function aggregate(df) {
  return df
    .groupBy(r => r.year)
    .inflate(br => ({
      year: br.first().year,
      total: br.deflate(r => r.amount).sum(),
      ["best brand"]: br.aggregate({ brand: "", amount: 0 }, (acc, cur) => {
        return cur.amount > acc.amount ? cur : acc;
      }).brand,
      ["best amount"]: br.aggregate({ brand: "", amount: 0 }, (acc, cur) => {
        return cur.amount > acc.amount ? cur : acc;
      }).amount,
      ["worst brand"]: br.aggregate({ brand: "", amount: 100000000 }, (acc, cur) => {
        return cur.amount < acc.amount ? cur : acc;
      }).brand,
      ["worst amount"]: br.aggregate({ brand: "", amount: 100000000 }, (acc, cur) => {
        return cur.amount < acc.amount ? cur : acc;
      }).amount,
    }))
    [orderMethodAgg.get()](orderPredAgg.get())
    .toArray();
}

export const aggregated = derived(
  preprocessed,
  $v => aggregate($v),
);

export let blocks = derived(processed, $v => ({
  blocks: toBlocks($v, "filtered", orderBy),
  ...calcRowsCols($v),
}));

export let aggregatedBlocks = derived(aggregated, $v => ({
  blocks: toBlocks($v, "aggregated", orderByAggregated),
  ...calcRowsCols($v),
}));

const checkIsEmpty = $v => !$v || $v.length === 0;

export let isEmpty = derived(processed, checkIsEmpty);

export let isEmptyAggregated = derived(aggregated, checkIsEmpty);

export function UPDATE_PREFECTURE(value) {
  return ({ set }) => set("prefecture", value);
}

export function UPDATE_CSV(value) {
  return ({ set }) => set("csv", value);
}

export function TOGGLE_USE_GENERATED_DATA() {
  return ({ update }) => update("useGeneratedData", v => Boolean(!v));
}

