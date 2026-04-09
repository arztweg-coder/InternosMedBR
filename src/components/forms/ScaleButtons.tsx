interface ScaleButtonsProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export default function ScaleButtons({ label, min, max, value, onChange }: ScaleButtonsProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(num => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`w-12 h-12 rounded-lg border-2 font-bold text-sm transition-colors ${
              value === num
                ? 'border-teal-500 bg-teal-500 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
