import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { PlusCircle, Coffee, TrendingUp, Award, Zap } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import RecordCard from '../components/RecordCard';
import type { CoffeeRecord } from '../types';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
}

function StatCard({ icon: Icon, label, value, sub }: StatCardProps) {
  return (
    <div className="paper-card rounded-xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #5c3d21, #a67c42)' }}
      >
        <Icon size={18} className="text-cream-100" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-espresso-700">{value}</p>
        <p className="text-xs text-espresso-400 font-sans">{label}</p>
        {sub && <p className="text-[10px] text-espresso-300 font-sans">{sub}</p>}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="text-8xl mb-6 opacity-30 select-none">☕</div>
      <h2 className="font-display text-2xl text-espresso-600 mb-2 italic">&ldquo;第一杯，从此刻开始&rdquo;</h2>
      <p className="text-espresso-400 text-sm mb-8 font-sans">记录每一次冲煮，留住那杯令你心动的咖啡</p>
      <Link
        to="/new"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-cream-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg, #4a2c18, #a67c42)' }}
      >
        <PlusCircle size={16} />
        创建第一条记录
      </Link>
    </div>
  );
}

export default function Home() {
  const { records } = useCoffee();

  if (records.length === 0) return <EmptyState />;

  // Stats
  const totalBrews = records.length;
  const avgRating =
    records.filter((r) => r.rating).length > 0
      ? (records.filter((r) => r.rating).reduce((s, r) => s + r.rating, 0) / records.filter((r) => r.rating).length).toFixed(1)
      : '—';

  const methodCount: Record<string, number> = {};
  records.forEach((r) => {
    if (r.brewMethod) methodCount[r.brewMethod] = (methodCount[r.brewMethod] ?? 0) + 1;
  });
  const topMethod = Object.entries(methodCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const originCount: Record<string, number> = {};
  records.forEach((r) => {
    if (r.origin) originCount[r.origin] = (originCount[r.origin] ?? 0) + 1;
  });
  const topOrigin = Object.entries(originCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const recent = records.slice(0, 6);

  // Group by date for timeline
  const grouped: Record<string, CoffeeRecord[]> = {};
  records.forEach((r) => {
    const day = format(new Date(r.createdAt), 'yyyy-MM-dd');
    grouped[day] = grouped[day] ?? [];
    grouped[day].push(r);
  });
  const sortedDays = Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 7);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-espresso-800 mb-1">手冲日志</h1>
        <p className="text-espresso-400 font-sans text-sm">{format(new Date(), 'yyyy年M月d日，EEEE', { locale: zhCN })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard icon={Coffee} label="总冲煮次数" value={totalBrews} />
        <StatCard icon={TrendingUp} label="平均评分" value={avgRating} sub="满分 5" />
        <StatCard icon={Zap} label="最爱冲法" value={topMethod} />
        <StatCard icon={Award} label="最常豆子产地" value={topOrigin} />
      </div>

      {/* Recent records */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-espresso-700">最近记录</h2>
          <Link to="/history" className="text-xs text-espresso-400 hover:text-espresso-600 font-sans transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recent.map((r) => (
            <RecordCard key={r.id} record={r} />
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="font-display text-xl font-semibold text-espresso-700 mb-5">冲煮时间轴</h2>
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-cream-400 to-transparent" />
          <div className="space-y-6 pl-10">
            {sortedDays.map((day, di) => (
              <div key={day} className="animate-slide-up" style={{ animationDelay: `${di * 60}ms` }}>
                {/* Date bubble */}
                <div className="absolute left-0 w-7 h-7 rounded-full border-2 border-cream-400 bg-cream-100 flex items-center justify-center -translate-x-px">
                  <span className="text-[9px] font-bold text-espresso-500 leading-none">{format(new Date(day), 'dd')}</span>
                </div>
                <p className="text-xs text-espresso-400 font-sans mb-2">{format(new Date(day), 'M月d日 EEEE', { locale: zhCN })}</p>
                <div className="flex flex-wrap gap-2">
                  {grouped[day].map((r) => (
                    <Link
                      key={r.id}
                      to={`/record/${r.id}`}
                      className="paper-card rounded-lg px-3 py-1.5 text-sm text-espresso-600 hover:shadow transition-all duration-150 hover:-translate-y-0.5"
                    >
                      <span className="font-medium">{r.beanName || '未命名'}</span>
                      {r.brewMethod && <span className="ml-1 text-xs text-espresso-400">· {r.brewMethod}</span>}
                      {r.rating > 0 && <span className="ml-1 text-xs text-gold-500">★{r.rating}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAB */}
      <Link
        to="/new"
        className="fixed bottom-8 right-6 w-14 h-14 rounded-full flex items-center justify-center text-cream-100 shadow-xl transition-all duration-200 hover:scale-110 hover:shadow-2xl z-40"
        style={{ background: 'linear-gradient(135deg, #4a2c18, #a67c42)' }}
        title="新建记录"
      >
        <PlusCircle size={24} />
      </Link>
    </div>
  );
}
