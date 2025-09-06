import LeftPanel from "./left"
import RightPanel from "./right"

export default function Desktop4() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Hexagonal Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
          {/* Hexagonal pattern elements */}
          <g stroke="#22d3ee" strokeWidth="2" fill="none">
            {/* Top right hexagons */}
            <polygon points="650,20 680,40 680,80 650,100 620,80 620,40" />
            <polygon points="680,80 710,100 710,140 680,160 650,140 650,100" />
            <polygon points="710,140 740,160 740,200 710,220 680,200 680,160" />

            {/* Right side hexagons */}
            <polygon points="720,280 750,300 750,340 720,360 690,340 690,300" />
            <polygon points="750,340 780,360 780,400 750,420 720,400 720,360" />

            {/* Left side hexagons */}
            <polygon points="50,150 80,170 80,210 50,230 20,210 20,170" />
            <polygon points="80,210 110,230 110,270 80,290 50,270 50,230" />
            <polygon points="110,270 140,290 140,330 110,350 80,330 80,290" />

            {/* Bottom hexagons */}
            <polygon points="200,450 230,470 230,510 200,530 170,510 170,470" />
            <polygon points="230,510 260,530 260,570 230,590 200,570 200,530" />

            {/* Additional scattered hexagons */}
            <polygon points="350,100 380,120 380,160 350,180 320,160 320,120" />
            <polygon points="500,50 530,70 530,110 500,130 470,110 470,70" />
            <polygon points="150,380 180,400 180,440 150,460 120,440 120,400" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  )
}
