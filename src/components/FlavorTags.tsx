const PRESET_FLAVORS = [
  '茉莉花香',
  '玫瑰',
  '蜂蜜',
  '柑橘',
  '柠檬',
  '百香果',
  '蓝莓',
  '草莓',
  '覆盆子',
  '杏桃',
  '黑醋栗',
  '焦糖',
  '黑巧克力',
  '牛奶巧克力',
  '杏仁',
  '榛果',
  '核桃',
  '黑糖',
  '枫糖',
  '荔枝',
  '乌梅',
  '苹果',
  '李子',
];

interface FlavorTagsProps {
  selected?: string[];
  onChange?: (flavors: string[]) => void;
  readOnly?: boolean;
}

export default function FlavorTags({ selected = [], onChange, readOnly = false }: FlavorTagsProps) {
  const toggle = (flavor: string) => {
    if (readOnly) return;
    onChange?.(selected.includes(flavor) ? selected.filter((f) => f !== flavor) : [...selected, flavor]);
  };

  const addCustom = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const val = input.value.trim();
      if (val && !selected.includes(val)) {
        onChange?.([...selected, val]);
      }
      input.value = '';
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {PRESET_FLAVORS.map((f) => (
          <button
            key={f}
            type="button"
            disabled={readOnly}
            onClick={() => toggle(f)}
            className={`px-2.5 py-1 rounded-full text-xs border transition-all duration-150 ${
              selected.includes(f)
                ? 'bg-espresso-600 border-espresso-600 text-cream-100'
                : readOnly
                  ? 'bg-transparent border-cream-300 text-espresso-400 opacity-40'
                  : 'bg-transparent border-cream-300 text-espresso-500 hover:border-espresso-400 hover:bg-cream-200'
            }`}
          >
            {f}
          </button>
        ))}
        {/* Custom tags (not in preset) */}
        {selected
          .filter((f) => !PRESET_FLAVORS.includes(f))
          .map((f) => (
            <button
              key={f}
              type="button"
              disabled={readOnly}
              onClick={() => toggle(f)}
              className="px-2.5 py-1 rounded-full text-xs border bg-espresso-600 border-espresso-600 text-cream-100"
            >
              {f} {!readOnly && '×'}
            </button>
          ))}
      </div>
      {!readOnly && (
        <input
          type="text"
          placeholder="自定义风味，按 Enter 添加…"
          onKeyDown={addCustom}
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-cream-300 bg-cream-50 text-espresso-700 placeholder-espresso-300 focus:outline-none focus:border-gold-400 transition-colors"
        />
      )}
    </div>
  );
}
