import type { CoffeeRecord } from '../../types';

const BREW_METHODS = ['V60', 'Chemex', 'Kalita Wave', '爱乐压', '法压壶', '冰滴', '摩卡壶', '其他'];
const ROAST_LEVELS = ['浅烘', '中浅', '中烘', '中深', '深烘'];
const PROCESSES = ['日晒', '水洗', '蜜处理', '厌氧日晒', '厌氧水洗', '双重发酵', '葡萄干处理', '其他'];

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-espresso-600 mb-1">{label}</label>
      {hint && <p className="text-xs text-espresso-300 mb-1.5 font-sans">{hint}</p>}
      {children}
    </div>
  );
}

interface InputProps {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  unit?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  className?: string;
}

function TextInput({ value, onChange, placeholder, ...rest }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 placeholder-espresso-300 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors"
      {...rest}
    />
  );
}

function NumberInput({ value, onChange, placeholder, unit, ...rest }: InputProps) {
  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-10 rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 placeholder-espresso-300 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors"
        {...rest}
      />
      {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-espresso-400 font-sans pointer-events-none">{unit}</span>}
    </div>
  );
}

type StepData = Pick<
  CoffeeRecord,
  | 'beanName'
  | 'origin'
  | 'roastLevel'
  | 'process'
  | 'brewMethod'
  | 'grindSize'
  | 'coffeeAmount'
  | 'waterAmount'
  | 'waterTemp'
  | 'bloomWater'
  | 'bloomTime'
  | 'brewTime'
>;

export default function StepBrewing({ data, onChange }: { data: StepData; onChange: (d: StepData) => void }) {
  const set = (key: keyof StepData) => (val: string | number) => onChange({ ...data, [key]: val });

  const coffeeAmount = parseFloat(String(data.coffeeAmount));
  const waterAmount = parseFloat(String(data.waterAmount));
  const ratio = !isNaN(coffeeAmount) && !isNaN(waterAmount) && coffeeAmount > 0 ? `1 : ${(waterAmount / coffeeAmount).toFixed(1)}` : null;

  const gripPct = (((parseFloat(String(data.grindSize)) - 1) / 9) * 100).toFixed(0);

  return (
    <div className="space-y-5">
      {/* Bean info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="☕ 豆子名称">
          <TextInput value={data.beanName} onChange={set('beanName')} placeholder="如：耶加雪菲 G1" />
        </Field>
        <Field label="🌍 产地 / 庄园">
          <TextInput value={data.origin} onChange={set('origin')} placeholder="如：埃塞俄比亚 Yirgacheffe" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="🔥 烘焙度">
          <div className="flex flex-wrap gap-2">
            {ROAST_LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => set('roastLevel')(l)}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${
                  data.roastLevel === l
                    ? 'bg-espresso-600 border-espresso-600 text-cream-100'
                    : 'border-cream-300 text-espresso-500 hover:border-espresso-400'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </Field>
        <Field label="🍒 处理法">
          <select
            value={data.process}
            onChange={(e) => set('process')(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
          >
            <option value="">选择处理法…</option>
            {PROCESSES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="🧪 冲煮方式">
          <select
            value={data.brewMethod}
            onChange={(e) => set('brewMethod')(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
          >
            <option value="">选择冲法…</option>
            {BREW_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Grind */}
      <Field label={`⚙️ 研磨度  ${data.grindSize ? `— ${data.grindSize}` : ''}`} hint="1 = 极细 · 10 = 极粗">
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={data.grindSize || 5}
          style={{ '--value': `${gripPct}%` } as React.CSSProperties}
          onChange={(e) => set('grindSize')(e.target.value)}
          className="w-full mt-1"
        />
        <div className="flex justify-between text-[10px] text-espresso-300 font-sans mt-0.5">
          <span>极细 (Espresso)</span>
          <span>极粗 (French Press)</span>
        </div>
      </Field>

      {/* Amounts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
        <Field label="💧 咖啡粉量">
          <NumberInput value={data.coffeeAmount} onChange={set('coffeeAmount')} unit="g" min="1" />
        </Field>
        <Field label="🫗 注水量">
          <NumberInput value={data.waterAmount} onChange={set('waterAmount')} unit="ml" min="1" />
        </Field>
        <Field label="🌡 水温">
          <NumberInput value={data.waterTemp} onChange={set('waterTemp')} unit="°C" min="50" max="100" />
        </Field>
        <div className="text-center">
          <p className="text-xs text-espresso-400 mb-1">粉水比</p>
          <p className="text-xl font-display text-espresso-600 font-semibold">{ratio ?? '—'}</p>
        </div>
      </div>

      {/* Brew details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="💦 焖蒸注水量">
          <NumberInput value={data.bloomWater} onChange={set('bloomWater')} unit="ml" />
        </Field>
        <Field label="⏱ 焖蒸时间">
          <NumberInput value={data.bloomTime} onChange={set('bloomTime')} unit="秒" />
        </Field>
        <Field label="⏱ 总冲煮时间">
          <NumberInput value={data.brewTime} onChange={set('brewTime')} unit="秒" />
        </Field>
      </div>
    </div>
  );
}
