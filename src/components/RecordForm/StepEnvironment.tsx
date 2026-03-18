import type { CoffeeRecord } from '../../types';

const WEATHER_OPTIONS = [
  { label: '晴', icon: '☀️' },
  { label: '阴', icon: '☁️' },
  { label: '雨', icon: '🌧️' },
  { label: '雪', icon: '❄️' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-espresso-600 mb-1">{label}</label>
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

function TextInput({ value, onChange, placeholder }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 placeholder-espresso-300 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors"
    />
  );
}

function NumberInput({ value, onChange, unit, ...rest }: InputProps) {
  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 pr-10 rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
        {...rest}
      />
      {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-espresso-400 pointer-events-none">{unit}</span>}
    </div>
  );
}

type StepData = Pick<
  CoffeeRecord,
  'brewDate' | 'weather' | 'temperature' | 'humidity' | 'grinderBrand' | 'kettleBrand' | 'dripperBrand' | 'beanPrice' | 'priceRating'
>;

export default function StepEnvironment({ data, onChange }: { data: StepData; onChange: (d: StepData) => void }) {
  const set = (key: keyof StepData) => (val: string | number) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-5">
      {/* Datetime */}
      <Field label="📅 冲煮时间">
        <input
          type="datetime-local"
          value={data.brewDate}
          onChange={(e) => set('brewDate')(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
        />
      </Field>

      {/* Weather */}
      <Field label="🌤 天气">
        <div className="flex gap-3">
          {WEATHER_OPTIONS.map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => set('weather')(label)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl border text-xs transition-all ${
                data.weather === label
                  ? 'bg-espresso-600 border-espresso-600 text-cream-100'
                  : 'border-cream-300 text-espresso-500 hover:border-espresso-400 hover:bg-cream-200'
              }`}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </Field>

      {/* Env numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="🌡 气温">
          <NumberInput value={data.temperature} onChange={set('temperature')} unit="°C" min="-20" max="50" />
        </Field>
        <Field label="💧 湿度">
          <NumberInput value={data.humidity} onChange={set('humidity')} unit="%" min="0" max="100" />
        </Field>
      </div>

      {/* Equipment */}
      <div className="pt-2 border-t border-cream-300/50">
        <p className="text-sm font-medium text-espresso-600 mb-3">🛠 器具品牌</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="磨豆机">
            <TextInput value={data.grinderBrand} onChange={set('grinderBrand')} placeholder="如：Comandante C40" />
          </Field>
          <Field label="手冲壶">
            <TextInput value={data.kettleBrand} onChange={set('kettleBrand')} placeholder="如：Hario V60 烧水壶" />
          </Field>
          <Field label="滤杯 / 冲煮器">
            <TextInput value={data.dripperBrand} onChange={set('dripperBrand')} placeholder="如：Hario V60 01 树脂" />
          </Field>
        </div>
      </div>

      {/* Price */}
      <div className="pt-2 border-t border-cream-300/50">
        <p className="text-sm font-medium text-espresso-600 mb-3">💰 豆子经济账</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="豆子价格">
            <NumberInput value={data.beanPrice} onChange={set('beanPrice')} unit="元/100g" min="0" />
          </Field>
          <div>
            <label className="block text-sm font-medium text-espresso-600 mb-1">性价比评分</label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set('priceRating')(n)}
                  className={`w-8 h-8 rounded-full text-xs border transition-all ${
                    data.priceRating >= n ? 'bg-gold-400 border-gold-400 text-white' : 'border-cream-300 text-espresso-400 hover:border-gold-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
