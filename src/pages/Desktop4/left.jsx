import Button from "../../components/ui/Button"

export default function LeftPanel() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <polygon points="15,45 30,15 45,45" fill="#3b82f6" className="opacity-80" />
              <polygon points="20,35 35,20 50,35" fill="#22d3ee" className="opacity-90" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-600 mb-1">ZYTEXA</h1>
          <p className="text-blue-500 text-sm font-medium">Technology</p>
        </div>

        {/* Role Selection Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium" size="lg">
            Admin
          </Button>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium" size="lg">
            Employee
          </Button>
        </div>
      </div>
    </div>
  )
}
