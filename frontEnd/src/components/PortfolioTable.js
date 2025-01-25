import React, { useEffect, useState } from "react";
import axios from "axios";

const PortfolioTable = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/portfolioA/summary")
      .then((response) => {
        setPortfolio(response.data.portfolio);
        setTotalValue(response.data.total_value);
      });
  }, []);

  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Ticker
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Shares
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item) => (
              <tr
                key={item.ticker}
                className={item.ticker % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {item.ticker}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.shares}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${item.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${item.value.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="text-xl font-semibold mt-4 text-center">
        Total Portfolio Value: ${totalValue.toFixed(2)}
      </h3>
    </div>
  );
};

export default PortfolioTable;
