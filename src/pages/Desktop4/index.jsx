import LeftPanel from "./left"
import RightPanel from "./right"

export default function Desktop4() {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Panel */}
      <div className="flex-1 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center">
          <LeftPanel />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center">
          <RightPanel />
        </div>
      </div>
    </div>
  )
}
