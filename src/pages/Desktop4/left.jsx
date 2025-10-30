// LeftPanel.jsx
"use client";
import Image from "next/image";
import Button from "../../components/ui/Button";

export default function LeftPanel({ selectedRole, setSelectedRole }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-full mb-0 sm:mb-4">
            <Image
              src="/logo.png"
              alt="Zytexa Logo"
              width={220}   // increased width
              height={100}  // increased height
              className="object-contain mx-auto"
              priority
            />
          </div>
          {/* You can style this text further as needed */}
          <p className="mt-6 text-lg sm:text-xl font-semibold text-blue-700">
            Zytexa Technology
          </p>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Empowering Smarter Workplaces
          </p>
        </div>

        {/* <div className="space-y-3">
          <Button
            variant="purple"
            size="lg"
            className={`w-full font-medium ${selectedRole === "admin" ? "opacity-100" : "opacity-60"}`}
            onClick={() => setSelectedRole("admin")}
          >
            Admin
          </Button>
          <Button
            variant="purple"
            size="lg"
            className={`w-full font-medium ${selectedRole === "employee" ? "opacity-100" : "opacity-60"}`}
            onClick={() => setSelectedRole("employee")}
          >
            Employee
          </Button>
        </div> */}
      </div>
    </div>
  );
}
