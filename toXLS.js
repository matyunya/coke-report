import { processed, aggregated } from "./store.js";

function d(filename, blob) {
  let element = document.createElement('a');
  element.setAttribute('href', URL.createObjectURL(blob));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


export function dl(buffer, filename = "export.xlsx") {
  const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

  return d(filename, blob);
}

export async function download() {
  const { workbook } = require('./index.ellx');

  const wb = await workbook.get()();

  wb.sheet("Regionロー").cell("B21").value("FUCK YES");

  // TODO: move off main thread
  const buf = await wb.outputAsync("arraybuffer");

  return dl(buf, "report.xlsx");
}
