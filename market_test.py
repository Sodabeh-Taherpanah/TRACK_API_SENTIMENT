import ssl
from flask import Flask, jsonify, request
from flask_cors import CORS 
from transformers import pipeline
import feedparser
import yfinance as yf
import logging
from alpha_vantage.timeseries import TimeSeries

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

# Initialize the sentiment analysis pipeline
sentiment_pipeline = pipeline("sentiment-analysis", model="ProsusAI/finbert")


portfolio = {}


# Fetch stock data from Alpha Vantage (replacing Yahoo Finance)
@app.route("/api/stockA/<ticker>", methods=["GET"])
def get_stock_dataA(ticker):
    try:
        price = get_alpha_vantage_data(ticker)
        if price is not None:
            return jsonify({
                "ticker": ticker,
                "price": price
            })
        else:
            return jsonify({"error": "Unable to fetch stock data"}), 500
    except Exception as e:
        logging.error(f"Error fetching stock data: {e}")
        return jsonify({"error": str(e)}), 500

#  the portfolio (CRUD operations)
@app.route("/api/portfolioA", methods=["GET", "POST", "DELETE"])
def manage_portfolioA():
    global portfolio
    if request.method == "POST":
        data = request.json
        ticker = data.get("ticker")
        shares = data.get("shares", 0)
        logging.debug(f"Adding/updating portfolio: {ticker}, {shares} shares")  # Log input
        if ticker in portfolio:
            portfolio[ticker]["shares"] += shares
        else:
            portfolio[ticker] = {"shares": shares}
        logging.debug(f"Updated portfolio: {portfolio}")  # Log the updated portfolio
        return jsonify({"message": "Stock added/updated", "portfolio": portfolio})
    elif request.method == "GET":
        logging.debug(f"Portfolio: {portfolio}")  # Log portfolio on GET
        return jsonify(portfolio)
    elif request.method == "DELETE":
        data = request.json
        ticker = data.get("ticker")
        if ticker in portfolio:
            del portfolio[ticker]
            return jsonify({"message": "Stock removed", "portfolio": portfolio})
        else:
            return jsonify({"error": "Stock not found"}), 404


# Fetch sentiment analysis for news headlines
@app.route("/api/sentimentA/<ticker>", methods=["GET"])
def get_sentimentA(ticker):
    feed_url = f"https://finance.yahoo.com/rss/headline?s={ticker}"
    feed = feedparser.parse(feed_url)
    if not feed.entries:
        return jsonify({"error": "No articles found for this ticker"}), 404

    sentiment_results = []
    for entry in feed.entries[:5]:  # Limit to 5 articles for performance
        sentiment = sentiment_pipeline(entry.title)[0]
        sentiment_results.append({
            "title": entry.title,
            "sentiment": sentiment
        })

    return jsonify(sentiment_results)
# Your Alpha Vantage API Key
api_key = 'RJZ3S3C62PU3XU5V'

# Create an instance of TimeSeries
ts = TimeSeries(key=api_key, output_format='pandas')

# Fetch daily stock data for a ticker (e.g., Apple - AAPL)
def get_alpha_vantage_data(ticker):
    try:
        data, meta_data = ts.get_daily(symbol=ticker, outputsize='compact')
        # Return the most recent close price from the data
        price = data['4. close'].iloc[-1]  # Get the latest closing price
        return price
    except Exception as e:
        logging.error(f"Error fetching data for {ticker} from Alpha Vantage: {e}")
        return None


# Fetch portfolio summary (with sentiment)
@app.route("/api/portfolioA/summary", methods=["GET"])
def portfolio_summaryA():
    summary = []
    total_value = 0
    logging.debug(f"Current portfolio: {portfolio}")  # Log the portfolio
    for ticker, data in portfolio.items():
        try:
            price = get_alpha_vantage_data(ticker)
            if price is not None:
                value = data["shares"] * price
                logging.debug(f"Current price: {price}, Shares: {data['shares']}, Total Value: {value}")  # Log the portfolio value
                total_value += value
                summary.append({
                    "ticker": ticker,
                    "shares": data["shares"],
                    "price": price,
                    "value": value
                })
        except Exception as e:
            logging.error(f"Error fetching data for {ticker}: {e}")

    return jsonify({"portfolio": summary, "total_value": total_value})
if __name__ == "__main__":
    app.run(debug=True)
