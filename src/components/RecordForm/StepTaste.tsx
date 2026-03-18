import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import RatingStars from '../RatingStars';
import FlavorTags from '../FlavorTags';
import { compressImageToBase64 } from '../../utils/imageUtils';
import type { CoffeeRecord, TasteScores } from '../../types';

const TASTE_AXES = [
  { key: 'acidity', label: '酸度', desc: '柑橘感、果酸亮度' },
  { key: 'sweetness', label: '甜度', desc: '蜂蜜感、甜圆润度' },
  { key: 'bitterness', label: '苦度', desc: '可可感、苦涩程度' },
  { key: 'body', label: '醇厚', desc: '口感重量、丝滑度' },
  { key: 'aroma', label: '香气', desc: '干香、湿香表现' },
  { key: 'finish', label: '余韵', desc: '收尾持久度' },
];

interface TasteSliderProps {
  label: string;
  desc: string;
  value: number;
  onChange: (v: number) => void;
}

function TasteSlider({ label, desc, value, onChange }: TasteSliderProps) {
  const pct = (((value - 1) / 4) * 100).toFixed(0);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div>
          <span className="text-sm font-medium text-espresso-600">{label}</span>
          <span className="ml-2 text-xs text-espresso-300 font-sans">{desc}</span>
        </div>
        <span className="text-sm font-display font-semibold text-espresso-600 w-6 text-right">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        style={{ '--value': `${pct}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-espresso-300 font-sans mt-0.5">
        <span>微弱</span>
        <span>强烈</span>
      </div>
    </div>
  );
}

type StepData = Pick<CoffeeRecord, 'taste' | 'flavors' | 'rating' | 'notes' | 'photo'>;

export default function StepTaste({ data, onChange }: { data: StepData; onChange: (d: StepData) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const set =
    <K extends keyof StepData>(key: K) =>
    (val: StepData[K]) =>
      onChange({ ...data, [key]: val });
  const setTaste = (key: keyof TasteScores) => (val: number) => onChange({ ...data, taste: { ...data.taste, [key]: val } });

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await compressImageToBase64(file);
      set('photo')(b64);
    } catch {
      // silently ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Taste sliders */}
      <div>
        <p className="text-sm font-medium text-espresso-600 mb-4">🎨 口感维度（各项 1–5）</p>
        <div className="space-y-4">
          {TASTE_AXES.map(({ key, label, desc }) => (
            <TasteSlider
              key={key}
              label={label}
              desc={desc}
              value={data.taste?.[key as keyof TasteScores] ?? 3}
              onChange={setTaste(key as keyof TasteScores)}
            />
          ))}
        </div>
      </div>

      {/* Flavor tags */}
      <div className="pt-2 border-t border-cream-300/50">
        <p className="text-sm font-medium text-espresso-600 mb-3">🫐 风味描述</p>
        <FlavorTags selected={data.flavors ?? []} onChange={set('flavors')} />
      </div>

      {/* Overall rating */}
      <div className="pt-2 border-t border-cream-300/50">
        <p className="text-sm font-medium text-espresso-600 mb-2">⭐ 综合评分</p>
        <RatingStars value={data.rating ?? 0} onChange={set('rating')} />
      </div>

      {/* Notes */}
      <div className="pt-2 border-t border-cream-300/50">
        <label className="block text-sm font-medium text-espresso-600 mb-2">📝 品味心得</label>
        <textarea
          value={data.notes ?? ''}
          onChange={(e) => set('notes')(e.target.value)}
          rows={4}
          placeholder="记录这杯咖啡带给你的感受，或调整冲煮参数的灵感…"
          className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 placeholder-espresso-300 text-sm resize-none focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors leading-relaxed"
        />
      </div>

      {/* Photo upload */}
      <div className="pt-2 border-t border-cream-300/50">
        <p className="text-sm font-medium text-espresso-600 mb-3">📷 冲煮照片</p>
        {data.photo ? (
          <div className="relative inline-block">
            <img src={data.photo} alt="preview" className="w-full max-w-xs h-48 object-cover rounded-xl border border-cream-300 shadow" />
            <button
              type="button"
              onClick={() => set('photo')(null)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-espresso-600 text-cream-100 flex items-center justify-center shadow"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center w-full max-w-xs h-36 border-2 border-dashed border-cream-300 rounded-xl text-espresso-400 hover:border-espresso-400 hover:text-espresso-500 hover:bg-cream-100 transition-all"
          >
            <Upload size={24} className="mb-2 opacity-50" />
            <span className="text-sm">点击上传照片</span>
            <span className="text-xs font-sans opacity-60 mt-0.5">支持 JPG / PNG，自动压缩</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
      </div>
    </div>
  );
}
