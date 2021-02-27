import { createWorkbook, download as dl } from "~matyunya/ellxcel";
import { processed, aggregated } from "./store.js";


function create() {
  const wb = createWorkbook();
  const processedSheet = wb.addWorksheet("Filtered");
  const aggSheet = wb.addWorksheet("Aggregated");

  addData(processedSheet, processed.get());
  addData(aggSheet, aggregated.get());

  return wb;
}


function addData(sheet, data) {
  addColumns(sheet, data);
  addRows(sheet, data);
}

function addColumns(sheet, data) {
  if (!data.length) return;

  const cols = Object.keys(data[0]).map(key => ({
    header: key,
    key,
    width: 11,
  }));
  sheet.columns = cols;
}

function addRows(sheet, data) {
  if (!data.length) return;

  sheet.addRows(data.map(d => ({
    ...d,
  })));
}

export async function download() {
  const wb = create();
  const buf = await wb.xlsx.writeBuffer();

  return dl(buf, "report.xlsx");
}
