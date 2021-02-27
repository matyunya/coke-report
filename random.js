import { prefectures, pick, pickMap, zip } from "./prefectures.js";

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

export default function getRandomData() {
  return [...new Array(1000)].map(randomEntry);
}
