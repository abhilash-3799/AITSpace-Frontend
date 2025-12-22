export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`
        w-full 
        bg-blue-600 
        hover:bg-blue-700 
        text-white 
        font-medium 
        text-sm
        py-2.5 
        rounded-lg 
        transition
        ${className}
      `}
    >
      {children}
    </button>
  );
}
