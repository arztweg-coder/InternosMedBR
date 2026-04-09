interface InlineRadioProps {
  label: string;
  options: Array<{ value: any; label: string }>;
  value: any;
  onChange: (value: any) => void;
  name: string;
}

export default function InlineRadio({ label, options, value, onChange, name }: InlineRadioProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map(option => (
          <label
            key={String(option.value)}
            className={`flex items-center px-4 py-2 border-2 rounded-lg cursor-pointer transition-colors ${
              String(value) === String(option.value)
                ? 'border-teal-500 bg-teal-50 text-teal-700'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={String(value) === String(option.value)}
              onChange={() => onChange(option.value)}
              className="mr-2 h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
