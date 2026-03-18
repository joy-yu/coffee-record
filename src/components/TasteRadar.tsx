import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const AXES = [
  { key: 'acidity', label: '酸度' },
  { key: 'sweetness', label: '甜度' },
  { key: 'bitterness', label: '苦度' },
  { key: 'body', label: '醇厚' },
  { key: 'aroma', label: '香气' },
  { key: 'finish', label: '余韵' },
];

import type { TasteScores } from '../types';

interface TasteRadarProps {
  taste?: Partial<TasteScores>;
}

export default function TasteRadar({ taste = {} }: TasteRadarProps) {
  const data = AXES.map(({ key, label }) => ({
    label,
    value: taste[key as keyof TasteScores] ?? 0,
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="68%">
        <PolarGrid stroke="#d4b896" strokeOpacity={0.5} />
        <PolarAngleAxis dataKey="label" tick={{ fill: '#5c3d21', fontSize: 12, fontFamily: 'Noto Serif SC, serif' }} />
        <Radar dataKey="value" stroke="#a67c42" fill="#c4965a" fillOpacity={0.25} strokeWidth={2} dot={{ fill: '#5c3d21', r: 3 }} />
        <Tooltip
          formatter={(v, _n, { payload }) => [`${v} / 5`, payload.label]}
          contentStyle={{
            background: '#fffdf7',
            border: '1px solid #d4aa80',
            borderRadius: 8,
            fontSize: 12,
            fontFamily: 'Noto Serif SC, serif',
            color: '#3a2010',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
