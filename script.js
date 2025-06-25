// Giao diện sáng / tối theo giờ hệ thống
const hour = new Date().getHours();
document.body.classList.add(hour >= 6 && hour < 18 ? "light" : "dark");

let chart;
let labels = [];
let prices = [];

async function fetchPrice() {
  const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
  const data = await res.json();
  return parseFloat(data.price);
}

async function fetchCandles() {
  const res = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=5");
  const data = await res.json();
  return data.map(c => ({
    open: parseFloat(c[1]),
    close: parseFloat(c[4])
  }));
}

function analyze(candles) {
  let up = 0, down = 0;
  for (let c of candles) {
    if (c.close > c.open) up++;
    else if (c.close < c.open) down++;
  }

  if (up >= 3) {
    return {
      trend: "📈 TĂNG",
      advice: "🔻 BÁN (giá đang lên)"
    };
  } else if (down >= 3) {
    return {
      trend: "📉 GIẢM",
      advice: "💰 MUA (canh bắt đáy)"
    };
  } else {
    return {
      trend: "⚖️ TRUNG LẬP",
      advice: "⏸️ CHỜ tín hiệu rõ hơn"
    };
  }
}

function renderChart() {
  const ctx = document.getElementById("btcChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Giá BTC (USDT)",
        data: prices,
        borderColor: "#58a6ff",
        borderWidth: 2,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: false },
        y: {
          ticks: { color: "#ccc" },
          grid: { color: "#444" }
        }
      },
      plugins: {
        legend: { labels: { color: "#ccc" } }
      }
    }
  });
}

function updateChart(price) {
  const time = new Date().toLocaleTimeString();
  labels.push(time);
  prices.push(price);
  if (labels.length > 20) {
    labels.shift();
    prices.shift();
  }
  chart.update();
}

async function updateAll() {
  try {
    const price = await fetchPrice();
    const candles = await fetchCandles();
    const analysis = analyze(candles);

    document.getElementById("price").textContent = `💰 Giá BTC: ${price.toFixed(2)} USDT`;
    document.getElementById("trend").textContent = `📈 Xu hướng: ${analysis.trend}`;
    document.getElementById("advice").textContent = `📌 Khuyến nghị: ${analysis.advice}`;

    updateChart(price);
  } catch (e) {
    document.getElementById("advice").textContent = "⚠️ Không thể tải dữ liệu!";
  }
}

window.onload = async () => {
  const price = await fetchPrice();
  labels.push(new Date().toLocaleTimeString());
  prices.push(price);
  renderChart();
  updateAll();
  setInterval(updateAll, 30000);
};