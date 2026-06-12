import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

/* ---------- COLORS ---------- */

const METHOD_COLORS = {
  MM: "#E74C3C",
  TM: "#E67E22",
  IM: "#2ECC71",
  MTFM: "#3498DB",
  IMFM: "#9B59B6",
  ITFM: "#1ABC9C",
  IMTFM: "#F39C12"
};

/* ---------- DATA ---------- */

const AP_DATA = {
  "4-class-II": {
    MM: 0.464,
    TM: 0.484,
    IM: 0.974,
    MTFM: 0.464,
    IMFM: 0.885,
    ITFM: 0.938,
    IMTFM: 0.818
  }
};

const METHODS = ["MM", "TM", "IM", "MTFM", "IMFM", "ITFM", "IMTFM"];

/* ---------- COMPONENTS ---------- */

function StatusBadge({ level }) {

  const colors = {
    SAFE: "green",
    CAUTION: "orange",
    DANGER: "red"
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "6px",
        background: colors[level],
        color: "white",
        fontWeight: "bold"
      }}
    >
      {level}
    </span>
  );
}

function MetricCard({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center"
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: "12px" }}>{title}</div>
      <div style={{ fontSize: "28px", fontWeight: "bold" }}>{value}</div>
    </div>
  );
}

/* ---------- TOOLTIP ---------- */

const CustomTooltip = ({ active, payload }) => {

  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        background: "#020617",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid gray"
      }}
    >
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {(p.value * 100).toFixed(1)}%
        </p>
      ))}
    </div>
  );
};

/* ---------- MAIN APP ---------- */

export default function App() {

  const [friction, setFriction] = useState(0.41);

  useEffect(() => {

    const interval = setInterval(() => {
      setFriction((Math.random() * 0.8).toFixed(2));
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const chartData = METHODS.map((m) => ({
    method: m,
    AP: AP_DATA["4-class-II"][m]
  }));

  const risk =
    friction < 0.25
      ? "DANGER"
      : friction < 0.45
      ? "CAUTION"
      : "SAFE";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "40px",
        fontFamily: "monospace"
      }}
    >
      <h1 style={{ color: "#22d3ee", marginBottom: "30px" }}>
        Climate Resilient Transportation System
      </h1>

      {/* METRICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "40px"
        }}
      >
        <MetricCard title="Surface Classes" value="5" />
        <MetricCard title="Best Method AP" value="70%" />
        <MetricCard title="SIWNet MAE" value="0.089" />
        <MetricCard title="Equations Used" value="27" />
      </div>

      {/* CHART */}

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "40px"
        }}
      >
        <h3>Average Precision Comparison</h3>

        <div style={{ width: "100%", height: 300 }}>

          <ResponsiveContainer>
            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="method" />

              <YAxis />

              <Tooltip content={<CustomTooltip />} />

              <Legend />

              <Bar dataKey="AP">

                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={Object.values(METHOD_COLORS)[index]}
                  />
                ))}

              </Bar>

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* LIVE MONITOR */}

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px"
        }}
      >
        <h3>Live Road Monitor</h3>

        <p>Friction: {friction}</p>

        <StatusBadge level={risk} />

      </div>

    </div>
  );
}