import "./index.css";

import React, { useState } from "react";
import PortfolioTable from "./components/PortfolioTable";
import SentimentChart from "./components/SentimentChart";

const App = () => {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");

  return (
    <div>
      {/* Main Content Grid */}
      <div className="w-full p-6 bg-blue-800 shadow-lg rounded-b-2xl">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2 text-center text-white">
          Enter Ticker and View Portfolio
        </h2>
      </div>

      {/* Grid Section for Portfolio Table and Sentiment Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
        {/* Portfolio Table */}
        <div className="w-full p-6 bg-white shadow-lg rounded-2xl">
          {/* Input Field */}
          <div className="flex justify-center mb-6 items-center">
            <label>Ticker:</label>
            <input
              type="text"
              value={selectedTicker}
              onChange={(e) => setSelectedTicker(e.target.value)}
              placeholder="Enter Ticker"
              className="p-2 border border-gray-300 rounded-lg w-64 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
            />
          </div>
          <PortfolioTable />
        </div>

        {/* Sentiment Chart */}
        <div className="w-full p-6 bg-white shadow-lg rounded-2xl">
          <SentimentChart ticker={selectedTicker} />
        </div>
      </div>
    </div>
  );
};

export default App;
