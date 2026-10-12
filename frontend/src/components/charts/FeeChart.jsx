import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { FiDollarSign } from "react-icons/fi";

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 bg-ink-950/95 backdrop-blur-xl border border-flame-400/30 shadow-2xl">
        <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-flame-300">
          Rs. {payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const FeeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-white/40">
        <FiDollarSign size={32} className="opacity-50" />
        <p className="text-sm font-bold">No fee data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: `${MONTH_NAMES[item._id?.month]} ${item._id?.year}`,
    amount: item.total || item.totalAmount || 0,
  }));

  const max = Math.max(...chartData.map((d) => d.amount));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
        <defs>
          <linearGradient id="barGradBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1956A9" stopOpacity={1} />
            <stop offset="100%" stopColor="#0F3C82" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="barGradFlame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F06E23" stopOpacity={1} />
            <stop offset="100%" stopColor="#D45A15" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(240,110,35,0.06)", radius: 8 }} />
        <Bar dataKey="amount" radius={[10, 10, 0, 0]} maxBarSize={48}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.amount === max ? "url(#barGradFlame)" : "url(#barGradBlue)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FeeChart;