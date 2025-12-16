export default function Checkbox({ label, id, ...props }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-gray-700">
      <input
        id={id}
        type="checkbox"
        className="w-4 h-4"
        {...props}
      />
      {label}
    </label>
  );
}
