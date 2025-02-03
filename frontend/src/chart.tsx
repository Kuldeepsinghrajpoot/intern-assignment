import React, { useEffect } from "react";
import { AppDispatch, RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchStocks, fetchStockWithDuration } from "./redux/stockSlice";
import { Button } from "./ui/button";
import { CartesianGrid, XAxis } from "recharts";
import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function StockChart({ stockData }: { stockData: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Price Trend</CardTitle>
        <CardDescription>Stock price movement over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockData?.data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { stocks, stockData } = useSelector((state: RootState) => state.stock);

  const [selectedStock, setSelectedStock] = React.useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = React.useState<string | null>(null);
  const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const fetchStockDetails = () => {
    if (selectedStock && selectedDuration) {
      dispatch(fetchStockWithDuration({ stockId: selectedStock, duration: selectedDuration }));
    }
  };

  useEffect(() => {
    // Clear any existing interval before setting a new one
    if (intervalId) {
      clearInterval(intervalId);
    }

    if (selectedStock && selectedDuration) {
      fetchStockDetails(); // Fetch immediately
      const id = setInterval(() => {
        fetchStockDetails();
      }, 3000); // Fetch every 3 seconds

      setIntervalId(id);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedStock, selectedDuration]);

  return (
    <>
      <div className="flex space-x-4 px-10 my-4">
        <Select onValueChange={(value) => setSelectedStock(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Stocks</SelectLabel>
              {stocks.map((stock: any) => (
                <SelectItem key={stock.id} value={stock.id}>
                  {stock.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedDuration(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Duration</SelectLabel>
              {selectedStock &&
                Object.entries(
                  stocks.find((stock) => stock.id.trim() === selectedStock.trim())
                    .available as Record<string, string>
                ).map(([_, key]) => (
                  <SelectItem key={key} value={key}>
                    {String(key)}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Submit Button */}
        <Button
          variant="destructive"
          disabled={!selectedStock || !selectedDuration}
          onClick={fetchStockDetails}
        >
          Submit
        </Button>
      </div>
      <div className="p-10">{stockData && <StockChart stockData={stockData} />}</div>
    </>
  );
}

export default Home;
