"use client";
import Image from "next/image";
import Button from "../../components/ui/Button";

export default function LeftPanel({ selectedRole, setSelectedRole }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-30 h-40 mb-4">
            <Image
              src="/logo.png"
              alt="Zytexa Logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
        </div>

        <div className="space-y-3">
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
        </div>
      </div>
    </div>
  );
}
