export default function Divider({ text = "or" }) {
  return (
    <div className="flex items-center my-6">
      <div className="flex-1 border-t border-gray-200"></div>
      <span className="px-4 text-sm text-gray-500">{text}</span>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>
  )
}
