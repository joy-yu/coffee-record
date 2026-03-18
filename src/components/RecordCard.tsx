import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Star, Droplets, Thermometer, Timer } from 'lucide-react';
import type { CoffeeRecord } from '../types';

const ROAST_COLORS: Record<string, string> = {
  浅烘: 'bg-amber-100 text-amber-700 border-amber-200',
  中浅: 'bg-orange-100 text-orange-700 border-orange-200',
  中烘: 'bg-orange-200 text-orange-800 border-orange-300',
  中深: 'bg-red-100 text-red-700 border-red-200',
  深烘: 'bg-stone-200 text-stone-700 border-stone-300',
};

const WEATHER_ICON: Record<string, string> = { 晴: '☀️', 阴: '☁️', 雨: '🌧️', 雪: '❄️' };

export default function RecordCard({ record }: { record: CoffeeRecord }) {
  const {
    id,
    beanName,
    origin,
    roastLevel,
    brewMethod,
    coffeeAmount,
    waterAmount,
    waterTemp,
    brewTime,
    rating,
    flavors = [],
    notes,
    photo,
    weather,
    createdAt,
  } = record;

  const ratio = coffeeAmount && waterAmount ? `1:${(Number(waterAmount) / Number(coffeeAmount)).toFixed(1)}` : null;

  return (
    <Link to={`/record/${id}`} className="block group">
      <article className="paper-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        {/* Photo or placeholder */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-cream-200 to-cream-300">
          {photo ? (
            <img src={photo} alt={beanName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-20 select-none">☕</div>
          )}
          {/* Roast badge */}
          {roastLevel && (
            <span
              className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full border font-sans font-medium ${ROAST_COLORS[roastLevel] ?? 'bg-cream-100 text-espresso-500 border-cream-300'}`}
            >
              {roastLevel}
            </span>
          )}
          {weather && <span className="absolute top-2 left-2 text-base leading-none">{WEATHER_ICON[weather] ?? ''}</span>}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <h3 className="font-display font-semibold text-espresso-700 text-base leading-tight line-clamp-1">{beanName || '未命名豆子'}</h3>
              {origin && <p className="text-xs text-espresso-400 mt-0.5">{origin}</p>}
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-0.5 shrink-0">
                <Star size={12} fill="#c4965a" stroke="none" />
                <span className="text-xs text-gold-500 font-medium">{rating}</span>
              </div>
            )}
          </div>

          {/* Brew method */}
          {brewMethod && (
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-espresso-50 text-espresso-500 border border-espresso-100 mb-2 font-sans">
              {brewMethod}
            </span>
          )}

          {/* Params row */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-espresso-400 font-sans mb-2">
            {ratio && (
              <span className="flex items-center gap-0.5">
                <Droplets size={10} />
                {ratio}
              </span>
            )}
            {waterTemp && (
              <span className="flex items-center gap-0.5">
                <Thermometer size={10} />
                {waterTemp}°C
              </span>
            )}
            {brewTime && (
              <span className="flex items-center gap-0.5">
                <Timer size={10} />
                {brewTime}s
              </span>
            )}
          </div>

          {/* Flavor tags */}
          {flavors.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {flavors.slice(0, 3).map((f) => (
                <span key={f} className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream-200 text-espresso-500">
                  {f}
                </span>
              ))}
              {flavors.length > 3 && <span className="text-[10px] text-espresso-400">+{flavors.length - 3}</span>}
            </div>
          )}

          {/* Notes preview */}
          {notes && <p className="text-xs text-espresso-500 italic line-clamp-2 leading-relaxed">&ldquo;{notes}&rdquo;</p>}

          {/* Date */}
          <p className="text-[10px] text-espresso-300 font-sans mt-2">{format(new Date(createdAt), 'yyyy年M月d日 HH:mm', { locale: zhCN })}</p>
        </div>
      </article>
    </Link>
  );
}
