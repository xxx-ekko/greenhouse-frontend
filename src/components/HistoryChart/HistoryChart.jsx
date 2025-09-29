// src/components/HistoryChart/HistoryChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./HistoryChart.css";

function HistoryChart({ data }) {
  // Recharts a besoin que les données soient dans l'ordre chronologique
  // Notre API nous donne l'inverse, donc on inverse le tableau.
  const formattedData = data
    .slice()
    .reverse() // On inverse toujours pour avoir le plus ancien en premier
    .map((m) => {
      // On utilise l'accès sécurisé avec '?' (optional chaining).
      // Si m.data.dht11 n'existe pas ou est en erreur, la valeur sera 'null'.
      const temperature =
        m.data?.dht11?.status === "ok"
          ? parseFloat(m.data.dht11.temperature)
          : null;
      const humidity =
        m.data?.dht11?.status === "ok"
          ? parseFloat(m.data.dht11.humidity)
          : null;

      return {
        // On formate le timestamp pour qu'il soit plus court (juste l'heure)
        time: new Date(m.createdAt).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: temperature,
        humidity: humidity,
      };
    });

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            yAxisId="left"
            label={{ value: "°C", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "%", angle: -90, position: "insideRight" }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="#ff6b6b"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="humidity"
            stroke="#4d96ff"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HistoryChart;
