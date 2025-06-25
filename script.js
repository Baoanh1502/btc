
let countdownEl = document.getElementById("countdown");
let aiStatus = document.getElementById("aiStatus");
let decisionEl = document.getElementById("decision");
let ratioEl = document.getElementById("ratio");
const adviceText = document.getElementById("adviceText");
const orderBtns = document.getElementById("orderBtns");

let offset = 0;

async function fetchServerTime() {
  const res = await fetch("https://api.coinex.com/v2/common/time");
  const data = await res.json();
  return data.data.timestamp;
}

async function initTimer() {
  const serverTs = await fetchServerTime();
  offset = serverTs - Date.now();
  const endTs = serverTs + 30000;

  function tick() {
    const now = Date.now() + offset;
    const remain = endTs - now;
    countdownEl.textContent = remain > 0 ? Math.ceil(remain / 1000) + "s" : "0s";
    if (remain <= 0) {
      clearInterval(tickTimer);
      onTimerEnd();
    }
  }

  const tickTimer = setInterval(tick, 200);
}

function onTimerEnd() {
  aiStatus.textContent = "Hãy vào lệnh";
  let decision = Math.random() > 0.5 ? "buy" : "sell";
  if (decision === "buy") {
    ratioEl.textContent = "Ratio: 92%";
    adviceText.textContent = "Khuyến nghị: MUA (Giá có thể tăng)";
    orderBtns.innerHTML = `<button class="buy">MUA</button>`;
  } else {
    ratioEl.textContent = "Ratio: 93%";
    adviceText.textContent = "Khuyến nghị: BÁN (Giá có thể giảm)";
    orderBtns.innerHTML = `<button class="sell">BÁN</button>`;
  }
}

// Biểu đồ cột giá BTC realtime
let chart;
let labels = [];
let dataSet = [];

async function fetchPrice() {
  const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
  const data = await res.json();
  return parseFloat(data.price);
}

function updateChart(price) {
  const now = new Date();
  labels.push(now.toLocaleTimeString());
  dataSet.push(price);
  if (dataSet.length > 20) {
    labels.shift();
    dataSet.shift();
  }
  chart.data.labels = labels;
  chart.data.datasets[0].data = dataSet;
  chart.update();
}

async function setupChart() {
  const ctx = document.getElementById("btcChart").getContext("2d");
  const price = await fetchPrice();
  dataSet.push(price);
  labels.push(new Date().toLocaleTimeString());

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Giá BTC",
        data: dataSet,
        backgroundColor: "#00ffc6",
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#ccc" } }
      },
      scales: {
        y: {
          ticks: { color: "#ccc" },
          grid: { color: "#333" }
        },
        x: {
          ticks: { color: "#ccc" },
          grid: { color: "#333" }
        }
      }
    }
  });

  setInterval(async () => {
    const newPrice = await fetchPrice();
    updateChart(newPrice);
  }, 5000);
}

// Khởi chạy
setupChart();
initTimer();
