import { derived, select, tx } from "tinyx";
import { writable } from "svelte/store";
import { fromCSV, DataFrame } from 'data-forge@1.8.17/dist/esm/index.esm.js';
import { prefectures, pick, pickMap, zip } from "./prefectures.js";
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

const brands = {
  'Sparkling Soft Drinks':['Coca-Cola', 'Sprite', 'Fanta', 'Schweppes', 'Appletiser', 'Fresca', "Barq's"], 'Waters & Hydration':['DASANI', 'smartwater', 'POWERADE', 'vitaminwater', 'Topo Chico', 'Aquarius', 'I LOHAS', 'Ciel'], 'Juices, Dairy and Plant-Based':['Minute Maid', 'innocent', 'Simply', 'fairlife', 'AdeS'], 'Coffees':['Georgia Coffee', 'Costa Coffee'], 'Teas':['Fuze Tea', 'Honest', 'Gold Peak', 'Peace Tea', 'Ayataka', 'Doğadan']
};

const years = [...new Array(10)].map((_, i) => i + 2011);
const months = [...new Array(12)].map((_, i) => i + 1);

function randomEntry() {
  return Object.assign({
    amount: String(Math.ceil(Math.random() * 100)),
    year: String(pick(years)),
    month: String(pick(months))
  },
    Object.fromEntries(zip(['category', 'brand'], pickMap(brands))),
    Object.fromEntries(zip(['region', 'prefecture'], pickMap(prefectures))),
  )
}

function getRandomData() {
  return [...new Array(1000)].map(randomEntry);
}

export const processedCSV = derived(store, ({ useGeneratedData, csv }) => {
  return useGeneratedData ? new DataFrame(getRandomData()) : fromCSV(csv);
});

export const preprocessed = derived(
  processedCSV,
  $v => $v
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

