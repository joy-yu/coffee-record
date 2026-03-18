import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import RecordCard from '../components/RecordCard';
import { Link } from 'react-router-dom';

const BREW_METHODS = ['V60', 'Chemex', 'Kalita Wave', '爱乐压', '法压壶', '冰滴', '摩卡壶', '其他'];
const ROAST_LEVELS = ['浅烘', '中浅', '中烘', '中深', '深烘'];

export default function History() {
  const { records } = useCoffee();
  const [search, setSearch] = useState('');
  const [filterRoast, setFilterRoast] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...records];
    // search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          (r.beanName ?? '').toLowerCase().includes(q) ||
          (r.origin ?? '').toLowerCase().includes(q) ||
          (r.notes ?? '').toLowerCase().includes(q) ||
          (r.flavors ?? []).some((f) => f.toLowerCase().includes(q))
      );
    }
    // filters
    if (filterRoast) result = result.filter((r) => r.roastLevel === filterRoast);
    if (filterMethod) result = result.filter((r) => r.brewMethod === filterMethod);
    if (filterRating > 0) result = result.filter((r) => r.rating >= filterRating);
    // sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });
    return result;
  }, [records, search, filterRoast, filterMethod, filterRating, sortBy]);

  const activeFilters = [filterRoast, filterMethod, filterRating > 0 ? `≥${filterRating}星` : ''].filter(Boolean);

  const clearFilters = () => {
    setFilterRoast('');
    setFilterMethod('');
    setFilterRating(0);
    setSearch('');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-espresso-800">历史记录</h1>
          <p className="text-espresso-400 text-sm font-sans mt-1">{records.length} 次冲煮记录</p>
        </div>
        <Link
          to="/new"
          className="px-4 py-2 rounded-lg text-sm font-medium text-cream-100 transition-all hover:shadow"
          style={{ background: 'linear-gradient(135deg, #4a2c18, #a67c42)' }}
        >
          + 新建
        </Link>
      </div>

      {/* Search + filter bar */}
      <div className="mb-5 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索豆子、产地、风味、心得…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 placeholder-espresso-300 text-sm focus:outline-none focus:border-gold-400 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all ${
              showFilters || activeFilters.length > 0
                ? 'bg-espresso-600 border-espresso-600 text-cream-100'
                : 'border-cream-300 text-espresso-500 hover:bg-cream-100'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">筛选</span>
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-gold-400 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-espresso-600 text-sm focus:outline-none focus:border-gold-400 transition-colors"
          >
            <option value="newest">最新</option>
            <option value="oldest">最早</option>
            <option value="rating">评分</option>
          </select>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="paper-card rounded-xl p-4 space-y-4 animate-slide-up">
            {/* Roast */}
            <div>
              <p className="text-xs font-medium text-espresso-500 mb-2">烘焙度</p>
              <div className="flex flex-wrap gap-2">
                {ROAST_LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setFilterRoast(filterRoast === l ? '' : l)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      filterRoast === l
                        ? 'bg-espresso-600 border-espresso-600 text-cream-100'
                        : 'border-cream-300 text-espresso-500 hover:border-espresso-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {/* Method */}
            <div>
              <p className="text-xs font-medium text-espresso-500 mb-2">冲煮方式</p>
              <div className="flex flex-wrap gap-2">
                {BREW_METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFilterMethod(filterMethod === m ? '' : m)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      filterMethod === m
                        ? 'bg-espresso-600 border-espresso-600 text-cream-100'
                        : 'border-cream-300 text-espresso-500 hover:border-espresso-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {/* Rating */}
            <div>
              <p className="text-xs font-medium text-espresso-500 mb-2">最低评分</p>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFilterRating(n)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      filterRating === n
                        ? 'bg-espresso-600 border-espresso-600 text-cream-100'
                        : 'border-cream-300 text-espresso-500 hover:border-espresso-400'
                    }`}
                  >
                    {n === 0 ? '全部' : `≥${n}星`}
                  </button>
                ))}
              </div>
            </div>
            {/* Clear */}
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-espresso-400 hover:text-espresso-600 transition-colors"
              >
                <X size={12} /> 清除所有筛选
              </button>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {activeFilters.length > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-espresso-400">筛选：</span>
            {activeFilters.map((f) => (
              <span key={f} className="px-2 py-0.5 rounded-full bg-espresso-100 text-espresso-600 text-xs border border-espresso-200">
                {f}
              </span>
            ))}
            <button type="button" onClick={clearFilters} className="text-xs text-espresso-400 hover:text-espresso-600 underline">
              清除
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-20">🔍</div>
          <p className="text-espresso-400 text-sm">没有找到匹配的记录</p>
          <button type="button" onClick={clearFilters} className="mt-3 text-xs text-espresso-400 hover:text-espresso-600 underline">
            清除筛选
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-espresso-400 font-sans mb-4">{filtered.length} 条结果</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r, i) => (
              <div key={r.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                <RecordCard record={r} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
