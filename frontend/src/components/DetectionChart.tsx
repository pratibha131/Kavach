import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", detections: 12, authentic: 45 },
  { day: "Tue", detections: 19, authentic: 38 },
  { day: "Wed", detections: 8, authentic: 52 },
  { day: "Thu", detections: 25, authentic: 41 },
  { day: "Fri", detections: 31, authentic: 36 },
  { day: "Sat", detections: 15, authentic: 48 },
  { day: "Sun", detections: 22, authentic: 43 },
];

const DetectionChart = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Detection Activity (7 days)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAuthentic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
          <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={12} label={{ value: 'Day of Week', position: 'insideBottom', offset: -15, fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
          <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} label={{ value: 'Daily Detections', angle: -90, position: 'insideLeft', offset: 10, fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "hsl(222, 41%, 9%)",
              border: "1px solid hsl(222, 30%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 92%)",
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="detections" stroke="hsl(190, 100%, 50%)" fill="url(#colorDetections)" strokeWidth={2} />
          <Area type="monotone" dataKey="authentic" stroke="hsl(142, 76%, 46%)" fill="url(#colorAuthentic)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetectionChart;
