import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}

export default function RatingStars({ value, onChange, size = 5, readOnly = false }: RatingStarsProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: size }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`transition-transform ${readOnly ? 'cursor-default' : 'hover:scale-110 cursor-pointer'}`}
        >
          <Star size={readOnly ? 16 : 22} fill={star <= value ? '#c4965a' : 'none'} stroke={star <= value ? '#c4965a' : '#d4aa80'} />
        </button>
      ))}
    </div>
  );
}
