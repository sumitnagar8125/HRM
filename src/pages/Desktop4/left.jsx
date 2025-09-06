import Image from "next/image";
import Button from "../../components/ui/Button";

export default function LeftPanel() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-30 h-40 mb-4">
            <Image
              src="/logo.png"
              alt="Zytexa Logo"
              width={150}   // bigger width
              height={150}  // bigger height
              className="object-contain"
            />

          </div>

        </div>

        {/* Role Selection Buttons */}
        <div className="space-y-3">
          <Button variant="purple" size="lg" className="w-full font-medium">
            Admin
          </Button>

          <Button variant="purple" size="lg" className="w-full font-medium">
            Employee
          </Button>

        </div>
      </div>
    </div>
  );
}
