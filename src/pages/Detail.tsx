import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ArrowLeft, Trash2, Droplets, Thermometer, Timer, Flame, Leaf, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import TasteRadar from '../components/TasteRadar';
import RatingStars from '../components/RatingStars';
import FlavorTags from '../components/FlavorTags';
import type { TasteScores } from '../types';

const WEATHER_ICON: Record<string, string> = { 晴: '☀️', 阴: '☁️', 雨: '🌧️', 雪: '❄️' };
const ROAST_COLORS: Record<string, string> = {
  浅烘: 'bg-amber-100 text-amber-700',
  中浅: 'bg-orange-100 text-orange-700',
  中烘: 'bg-orange-200 text-orange-800',
  中深: 'bg-red-100 text-red-700',
  深烘: 'bg-stone-200 text-stone-700',
};

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-2 border-b border-cream-200/60 last:border-0">
      <Icon size={14} className="text-espresso-400 mt-0.5 shrink-0" />
      <span className="text-xs text-espresso-400 w-20 shrink-0">{label}</span>
      <span className="text-sm text-espresso-700 font-medium">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="paper-card rounded-xl p-5 mb-4">
      <h3 className="font-display text-base font-semibold text-espresso-700 mb-4 pb-2 border-b border-cream-200/80">{title}</h3>
      {children}
    </div>
  );
}

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecord, deleteRecord } = useCoffee();
  const record = getRecord(id ?? '');

  if (!record) {
    return (
      <div className="text-center py-20">
        <p className="text-espresso-400">记录不存在或已被删除</p>
        <Link to="/" className="mt-4 inline-block text-sm text-espresso-500 hover:text-espresso-700 underline">
          返回首页
        </Link>
      </div>
    );
  }

  const {
    beanName,
    origin,
    roastLevel,
    process,
    brewMethod,
    grindSize,
    coffeeAmount,
    waterAmount,
    waterTemp,
    bloomWater,
    bloomTime,
    brewTime,
    brewDate,
    weather,
    temperature,
    humidity,
    grinderBrand,
    kettleBrand,
    dripperBrand,
    beanPrice,
    priceRating,
    taste = {} as TasteScores,
    flavors = [],
    rating,
    notes,
    photo,
    createdAt,
  } = record;

  const ratio = coffeeAmount && waterAmount ? `1 : ${(Number(waterAmount) / Number(coffeeAmount)).toFixed(1)}` : null;

  const handleDelete = () => {
    if (window.confirm('确定删除这条记录吗？此操作不可撤销。')) {
      deleteRecord(id ?? '');
      navigate('/history');
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-espresso-500 hover:text-espresso-700 transition-colors"
        >
          <ArrowLeft size={16} /> 返回
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-all"
        >
          <Trash2 size={13} /> 删除记录
        </button>
      </div>

      {/* Hero section */}
      <div className="paper-card rounded-2xl overflow-hidden mb-4">
        {photo && (
          <div className="h-56 sm:h-72 overflow-hidden">
            <img src={photo} alt={beanName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-espresso-800 leading-tight">{beanName || '未命名豆子'}</h1>
              {origin && <p className="text-espresso-500 font-sans mt-1">{origin}</p>}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {roastLevel && (
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${ROAST_COLORS[roastLevel] ?? 'bg-cream-200 text-espresso-600'}`}>
                  {roastLevel}
                </span>
              )}
              {rating > 0 && <RatingStars value={rating} readOnly />}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-cream-200/60">
            {brewMethod && (
              <div className="text-center">
                <p className="text-xs text-espresso-400">冲煮方式</p>
                <p className="text-sm font-semibold text-espresso-700 mt-0.5">{brewMethod}</p>
              </div>
            )}
            {ratio && (
              <div className="text-center">
                <p className="text-xs text-espresso-400">粉水比</p>
                <p className="text-sm font-semibold text-espresso-700 mt-0.5">{ratio}</p>
              </div>
            )}
            {waterTemp && (
              <div className="text-center">
                <p className="text-xs text-espresso-400">水温</p>
                <p className="text-sm font-semibold text-espresso-700 mt-0.5">{waterTemp}°C</p>
              </div>
            )}
            {brewTime && (
              <div className="text-center">
                <p className="text-xs text-espresso-400">总时长</p>
                <p className="text-sm font-semibold text-espresso-700 mt-0.5">{brewTime}s</p>
              </div>
            )}
            {grindSize && (
              <div className="text-center">
                <p className="text-xs text-espresso-400">研磨度</p>
                <p className="text-sm font-semibold text-espresso-700 mt-0.5">{grindSize} / 10</p>
              </div>
            )}
          </div>

          <p className="text-xs text-espresso-300 font-sans mt-3">记录于 {format(new Date(createdAt), 'yyyy年M月d日 HH:mm', { locale: zhCN })}</p>
        </div>
      </div>

      {/* Taste Radar */}
      {Object.keys(taste).length > 0 && (
        <Section title="🎨 口感雷达">
          <TasteRadar taste={taste} />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
            {[
              { key: 'acidity', label: '酸度' },
              { key: 'sweetness', label: '甜度' },
              { key: 'bitterness', label: '苦度' },
              { key: 'body', label: '醇厚' },
              { key: 'aroma', label: '香气' },
              { key: 'finish', label: '余韵' },
            ].map(({ key, label }) => (
              <div key={key} className="text-center p-2 rounded-lg bg-cream-100/60">
                <p className="text-xs text-espresso-400 mb-0.5">{label}</p>
                <p className="text-lg font-display font-bold text-espresso-700">{taste[key as keyof TasteScores] ?? '—'}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Flavor tags */}
      {flavors.length > 0 && (
        <Section title="🫐 风味描述">
          <FlavorTags selected={flavors} readOnly />
        </Section>
      )}

      {/* Notes */}
      {notes && (
        <Section title="📝 品味心得">
          <p className="text-espresso-600 leading-relaxed font-body italic text-sm whitespace-pre-wrap">&ldquo;{notes}&rdquo;</p>
        </Section>
      )}

      {/* Brewing params detail */}
      <Section title="⚗️ 冲煮参数">
        <InfoRow icon={Flame} label="烘焙度" value={roastLevel} />
        <InfoRow icon={Leaf} label="处理法" value={process} />
        <InfoRow icon={Droplets} label="咖啡粉量" value={coffeeAmount ? `${coffeeAmount}g` : null} />
        <InfoRow icon={Droplets} label="注水量" value={waterAmount ? `${waterAmount}ml` : null} />
        <InfoRow icon={Droplets} label="粉水比" value={ratio} />
        <InfoRow icon={Thermometer} label="水温" value={waterTemp ? `${waterTemp}°C` : null} />
        <InfoRow icon={Timer} label="焖蒸" value={bloomWater || bloomTime ? `${bloomWater ?? '—'}ml / ${bloomTime ?? '—'}s` : null} />
        <InfoRow icon={Timer} label="总时长" value={brewTime ? `${brewTime}s` : null} />
      </Section>

      {/* Environment */}
      {(weather || temperature || humidity || brewDate) && (
        <Section title="🌤 冲煮环境">
          {brewDate && (
            <div className="flex items-start gap-2 py-2 border-b border-cream-200/60">
              <span className="text-sm">📅</span>
              <span className="text-xs text-espresso-400 w-20 shrink-0">冲煮时间</span>
              <span className="text-sm text-espresso-700 font-medium">{format(new Date(brewDate), 'yyyy年M月d日 HH:mm', { locale: zhCN })}</span>
            </div>
          )}
          {weather && (
            <div className="flex items-start gap-2 py-2 border-b border-cream-200/60">
              <span className="text-sm">{WEATHER_ICON[weather] ?? '🌤'}</span>
              <span className="text-xs text-espresso-400 w-20 shrink-0">天气</span>
              <span className="text-sm text-espresso-700 font-medium">{weather}</span>
            </div>
          )}
          {temperature && (
            <div className="flex items-start gap-2 py-2 border-b border-cream-200/60">
              <Thermometer size={14} className="text-espresso-400 mt-0.5 shrink-0" />
              <span className="text-xs text-espresso-400 w-20 shrink-0">气温</span>
              <span className="text-sm text-espresso-700 font-medium">{temperature}°C</span>
            </div>
          )}
          {humidity && (
            <div className="flex items-start gap-2 py-2">
              <Droplets size={14} className="text-espresso-400 mt-0.5 shrink-0" />
              <span className="text-xs text-espresso-400 w-20 shrink-0">湿度</span>
              <span className="text-sm text-espresso-700 font-medium">{humidity}%</span>
            </div>
          )}
        </Section>
      )}

      {/* Equipment */}
      {(grinderBrand || kettleBrand || dripperBrand) && (
        <Section title="🛠 器具品牌">
          <InfoRow icon={Wrench} label="磨豆机" value={grinderBrand} />
          <InfoRow icon={Wrench} label="手冲壶" value={kettleBrand} />
          <InfoRow icon={Wrench} label="滤杯" value={dripperBrand} />
        </Section>
      )}

      {/* Price */}
      {(beanPrice || priceRating > 0) && (
        <Section title="💰 豆子价格">
          {beanPrice && (
            <div className="flex items-center gap-2 py-2 border-b border-cream-200/60">
              <span className="text-xs text-espresso-400 w-20">价格</span>
              <span className="text-sm text-espresso-700 font-medium">¥{beanPrice} / 100g</span>
            </div>
          )}
          {priceRating > 0 && (
            <div className="flex items-center gap-2 py-2">
              <span className="text-xs text-espresso-400 w-20">性价比</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${n <= priceRating ? 'bg-gold-400 text-white' : 'bg-cream-200 text-espresso-300'}`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      <div className="h-10" />
    </div>
  );
}
