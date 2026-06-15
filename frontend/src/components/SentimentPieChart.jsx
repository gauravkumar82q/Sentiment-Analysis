import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = {
  positive: '#22c55e',
  neutral: '#94a3b8',
  negative: '#ef4444',
}

export default function SentimentPieChart({ summary }) {
  const data = ['positive', 'neutral', 'negative']
    .filter((key) => summary[key] > 0)
    .map((key) => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value: summary[key], key }))

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Sentiment Distribution</h2>
      <p className="text-xs text-gray-400 mb-4">{total} items analyzed</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={COLORS[entry.key]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} items`, '']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
