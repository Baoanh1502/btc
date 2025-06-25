let countdownEl = document.getElementById("countdown");
let aiStatus = document.getElementById("aiStatus");
let decisionEl = document.getElementById("decision");
let directionIcon = document.getElementById("directionIcon");
let ratioEl = document.getElementById("ratio");

let time = 30;
let timer = setInterval(() => {
  time--;
  countdownEl.textContent = time + "s";
  if (time <= 0) {
    clearInterval(timer);
    aiStatus.textContent = "Hãy vào lệnh";
    decisionEl.classList.remove("hidden");
    let decision = Math.random() > 0.5 ? "buy" : "sell";
    if (decision === "buy") {
      directionIcon.src = "https://cdn-icons-png.flaticon.com/512/109/109617.png";
      ratioEl.textContent = "Ratio: 92%";
    } else {
      directionIcon.src = "https://cdn-icons-png.flaticon.com/512/1828/1828665.png";
      ratioEl.textContent = "Ratio: 93%";
    }
  }
}, 1000);

// Biểu đồ giá BTC realtime
let chart;
let labels = [];
let prices = [];

async function fetchPrice() {
  const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
  const data = await res.json();
  return parseFloat(data.price);
}

function updateChart(price) {
  const now = new Date().toLocaleTimeString();
  labels.push(now);
  prices.push(price);
  if (labels.length > 20) {
    labels.shift();
    prices.shift();
  }
  chart.data.labels = labels;
  chart.data.datasets[0].data = prices;
  chart.update();
}

async function setupChart() {
  const ctx = document.getElementById("btcChart").getContext("2d");
  const price = await fetchPrice();
  labels.push(new Date().toLocaleTimeString());
  prices.push(price);

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Giá BTC",
        data: prices,
        borderColor: "#00ffcc",
        borderWidth: 2,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: { color: "#ccc" },
          grid: { color: "#333" }
        },
        x: {
          ticks: { color: "#ccc" },
          grid: { color: "#333" }
        }
      },
      plugins: {
        legend: { labels: { color: "#ccc" } }
      }
    }
  });

  setInterval(async () => {
    const newPrice = await fetchPrice();
    updateChart(newPrice);
  }, 5000);
}

setupChart();