export default function Input({ label, id, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={id}
        {...props}
        className="
          border border-gray-300 
          rounded-lg 
          px-3 py-2 
          text-sm
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:border-transparent
        "
      />
    </div>
  );
}
