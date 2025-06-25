import requests
import time

def get_price():
    url = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    response = requests.get(url)
    data = response.json()
    return float(data['price'])

def analyze(prices):
    if len(prices) < 3:
        return "Đang thu thập dữ liệu..."

    delta1 = prices[-1] - prices[-2]
    delta2 = prices[-2] - prices[-3]

    if delta1 > 0 and delta2 > 0:
        return "⏫ Xu hướng TĂNG"
    elif delta1 < 0 and delta2 < 0:
        return "⏬ Xu hướng GIẢM"
    else:
        return "⏸️ Trung lập"

prices = []

while True:
    try:
        price = get_price()
        prices.append(price)
        print(f"📈 Giá BTC hiện tại: {price} USDT")
        print(analyze(prices))
        print("-" * 40)
        time.sleep(10)  # chờ 10 giây để lấy dữ liệu tiếp
    except Exception as e:
        print("Lỗi:", e)
        time.sleep(5)