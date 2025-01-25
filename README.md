Portfolio Tracker API with Sentiment Analysis

This Flask-based API allows you to manage a stock portfolio, fetch stock prices using the Alpha Vantage API, and analyze sentiment based on recent news articles using a sentiment analysis model.
Features
![image](https://github.com/user-attachments/assets/c544b7d8-327a-4103-85c5-5393cf1fbe02)


    Stock Data: Fetch stock prices using Alpha Vantage API.
    Portfolio Management: Add, update, view, and delete stocks in your portfolio.
    Sentiment Analysis: Analyze sentiment of news articles related to stocks.
    Portfolio Summary: View the total value of your portfolio and sentiment analysis for each stock.

Installation
Prerequisites

    Python 3.x
    An Alpha Vantage API Key (Sign up here)

Setup

    Clone the repository.
    Install dependencies:

pip install flask flask-cors transformers feedparser alpha_vantage

Set your Alpha Vantage API key in the code:

api_key = 'YOUR_API_KEY'

Run the app:

    python app.py

API Endpoints
1. Get Stock Data: GET /api/stockA/<ticker>

    Fetch stock data from Alpha Vantage.

2. Manage Portfolio:

    Add/Update Stock: POST /api/portfolioA
    Get Portfolio: GET /api/portfolioA
    Delete Stock: DELETE /api/portfolioA

3. Get Sentiment: GET /api/sentimentA/<ticker>

    Fetch sentiment analysis for news articles about a stock.

4. Portfolio Summary: GET /api/portfolioA/summary

    View your portfolio's value and sentiment.

