function rows(data, type) {
  return data.reduce((acc, row, i) => [
    ...acc,
    ...Object.keys(row).map((k, j) => [
      `row:${i}:${j}:${type}`,
      {
        position: [i + 1, j, i + 1, j],
        value: row[k],
      }
    ])
  ], []
  );
}

export function UPDATE_ORDER({ value }) {
  value = value.replace(/(↓|↑)/, "");

  return ({ update }) => update(v => ({
    column: value,
    asc: v.column === value ? !v.asc : true,
  }));
}

function headers(data, type, orderBy) {
  const { column, asc } = orderBy.get();
  return Object.keys(data[0]).map((header, i) => [
    `header:${header}:${type}`,
    {
      position: [0, i, 0, i],
      value: header + (column === header ? (asc ? "↑" : "↓") : ""),
      classes: "font-bold capitalize cursor-pointer select-none",
      onClick: () => orderBy.commit(UPDATE_ORDER, { value: header }),
    }
  ]);
}

export function toBlocks(data, type, orderBy) {
  if (!data || !data.length) return [];
  return [
    ...headers(data, type, orderBy),
    ...rows(data, type),
  ]
}

export const calcRowsCols = $v => ({
  nRows: $v && $v.length ? $v.length + 1 : 0,
  nCols: $v && $v.length ? Object.keys($v[0]).length - 1 : 0,
});
