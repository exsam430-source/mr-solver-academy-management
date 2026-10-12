import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { FiUsers } from "react-icons/fi";

const COLORS = ["#1956A9", "#F06E23", "#10b981", "#fbbf24", "#3b82f6", "#a78bfa", "#ec4899", "#06b6d4", "#14b8a6", "#f43f5e"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 bg-ink-950/95 backdrop-blur-xl border border-flame-400/30 shadow-2xl">
        <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">
          {payload[0].name}
        </p>
        <p className="text-lg font-black text-white">
          {payload[0].value}{" "}
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Students</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-2">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: entry.color, boxShadow: `0 0 8px ${entry.color}80` }}
        />
        <span className="text-[11px] text-white/70 font-bold">{entry.value}</span>
      </div>
    ))}
  </div>
);

const StudentChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-white/40">
        <FiUsers size={32} className="opacity-50" />
        <p className="text-sm font-bold">No student data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.courseName,
    value: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="42%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
          stroke="#0a1929"
          strokeWidth={3}
        >
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length]}
              style={{ filter: `drop-shadow(0 0 6px ${COLORS[i % COLORS.length]}50)` }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StudentChart;