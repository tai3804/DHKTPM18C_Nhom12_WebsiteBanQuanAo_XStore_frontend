// Component Select chung
export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-gray-700 text-sm mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
