import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { FiActivity } from "react-icons/fi";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 bg-ink-950/95 backdrop-blur-xl border border-flame-400/30 shadow-2xl">
        <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-black capitalize flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AttendanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-white/40">
        <FiActivity size={32} className="opacity-50" />
        <p className="text-sm font-bold">No attendance data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.studentName,
    present: item.totalPresent,
    absent: item.totalAbsent,
    percentage: parseFloat(item.percentage?.toFixed(1) || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
        <defs>
          <linearGradient id="presentAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="absentAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={55}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#F06E23", strokeWidth: 1, strokeDasharray: "4 4" }} />
        <Area
          type="monotone" dataKey="present"
          stroke="#10b981" strokeWidth={2.5}
          fill="url(#presentAreaGrad)"
          dot={{ fill: "#10b981", r: 3, strokeWidth: 2, stroke: "#0a1929" }}
          activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
        />
        <Area
          type="monotone" dataKey="absent"
          stroke="#ef4444" strokeWidth={2.5}
          fill="url(#absentAreaGrad)"
          dot={{ fill: "#ef4444", r: 3, strokeWidth: 2, stroke: "#0a1929" }}
          activeDot={{ r: 6, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;