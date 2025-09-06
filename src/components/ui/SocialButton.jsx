export default function SocialButton({ icon, text, ...props }) {
  return (
    <button
      className="w-full py-3 border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 bg-transparent rounded-md"
      {...props}
    >
      {icon}
      <span className="text-gray-700">{text}</span>
    </button>
  )
}
