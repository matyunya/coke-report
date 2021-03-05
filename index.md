# Tidying data with Ellx

In this project we're attempting to provide a customizable dashboard
for operating on tabular data.

## Steps

- Upload CSV;
- Create data frame;
- Tidy data, cast to proper types, catch errors;
- Allow multi-step manipulation on the data frame using data-forge (filter, aggregate etc);
- Export any step to CSV/Excel;
- Allow custom Excel template;
- Add visualizations (either Ellx plot, or Voyager?).

## Ellx propositions

- Cache intermediate calculations;
- Automatically delegate operations on large scale data to server-side cells;
- Enable deployment of final calculations only.


## Links

- Tidy data: [[1]](https://cran.r-project.org/web/packages/tidyr/vignettes/tidy-data.html), [[2]](https://vita.had.co.nz/papers/tidy-data.pdf);
- [Databricks workflow example](https://databricks.com/discover/demos/machine-learning-with-mlflow);
- Example project from [js4ds.org](https://js4ds.org/#s:dataforge-real).
