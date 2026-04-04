import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface RingData {
  name: string;
  value: number;
  fill: string;
}

export function ConcentricRings({ data, size = 300 }: { data: RingData[]; size?: number }) {
  return (
    <div className="neo-disc flex items-center justify-center p-2" style={{ width: size, height: size }}>
      <div className="neo-inset rounded-full flex items-center justify-center p-6 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%" innerRadius="30%" outerRadius="100%"
            barSize={12} data={data} startAngle={90} endAngle={-270}
          >
            <RadialBar
              background={{ fill: "hsl(var(--muted))" }}
              dataKey="value"
              cornerRadius={10}
              isAnimationActive={true}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
