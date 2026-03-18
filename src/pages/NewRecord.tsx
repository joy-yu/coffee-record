import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import StepBrewing from '../components/RecordForm/StepBrewing';
import StepEnvironment from '../components/RecordForm/StepEnvironment';
import StepTaste from '../components/RecordForm/StepTaste';
import type { CoffeeRecord } from '../types';

const STEPS = [
  { label: '冲煮参数', icon: '⚗️', sub: '豆子、水温、研磨' },
  { label: '环境器具', icon: '🌤', sub: '天气、设备、价格' },
  { label: '口感心得', icon: '✍️', sub: '评分、风味、照片' },
];

function getDefaultData() {
  return {
    // Step 1 – Brewing
    beanName: '',
    origin: '',
    roastLevel: '',
    process: '',
    brewMethod: '',
    grindSize: 5,
    coffeeAmount: '',
    waterAmount: '',
    waterTemp: 93,
    bloomWater: '',
    bloomTime: 30,
    brewTime: '',
    // Step 2 – Environment
    brewDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    weather: '',
    temperature: '',
    humidity: '',
    grinderBrand: '',
    kettleBrand: '',
    dripperBrand: '',
    beanPrice: '',
    priceRating: 0,
    // Step 3 – Taste
    taste: { acidity: 3, sweetness: 3, bitterness: 3, body: 3, aroma: 3, finish: 3 },
    flavors: [],
    rating: 0,
    notes: '',
    photo: null,
  };
}

export default function NewRecord() {
  const { addRecord } = useCoffee();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Omit<CoffeeRecord, 'id' | 'createdAt'>>(getDefaultData);
  const [saving, setSaving] = useState(false);

  const update = (partial: Partial<Omit<CoffeeRecord, 'id' | 'createdAt'>>) => setData((d) => ({ ...d, ...partial }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSave = async () => {
    setSaving(true);
    try {
      const id = addRecord(data);
      navigate(`/record/${id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-espresso-800">新建冲煮记录</h1>
        <p className="text-espresso-400 text-sm font-sans mt-1">记录此刻的每一个细节</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 transition-all ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                  i < step
                    ? 'bg-espresso-600 border-espresso-600 text-cream-100'
                    : i === step
                      ? 'bg-cream-100 border-espresso-500 text-espresso-600 shadow-md'
                      : 'bg-cream-100 border-cream-300 text-espresso-300'
                }`}
              >
                {i < step ? <Check size={14} /> : s.icon}
              </div>
              <div className="hidden sm:block text-left">
                <p className={`text-xs font-medium leading-none mb-0.5 ${i === step ? 'text-espresso-700' : 'text-espresso-400'}`}>{s.label}</p>
                <p className="text-[10px] text-espresso-300 font-sans">{s.sub}</p>
              </div>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 transition-all duration-500 ${i < step ? 'bg-espresso-400' : 'bg-cream-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="paper-card rounded-2xl p-6 mb-6 animate-slide-up">
        {step === 0 && <StepBrewing data={data} onChange={update} />}
        {step === 1 && <StepEnvironment data={data} onChange={update} />}
        {step === 2 && <StepTaste data={data} onChange={update} />}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-espresso-500 border border-cream-300 hover:bg-cream-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} /> 上一步
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-cream-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #4a2c18, #a67c42)' }}
          >
            下一步 <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-medium text-cream-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #4a2c18, #a67c42)' }}
          >
            <Check size={16} /> {saving ? '保存中…' : '保存记录'}
          </button>
        )}
      </div>
    </div>
  );
}
