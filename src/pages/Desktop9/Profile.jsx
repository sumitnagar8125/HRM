import Image from "next/image";

export default function Profile({ user }) {
  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border min-h-[300px]">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
          <Image
            src={user?.avatar_url || "/logo.png"} // fallback if no image
            alt="Profile"
            width={120}
            height={120}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <p className="text-lg">
            <span className="font-semibold">Name:</span> {user?.name || "N/A"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Employee Code:</span> {user?.emp_code || "N/A"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email ID:</span> {user?.email || "N/A"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Phone:</span> {user?.phone || "N/A"}
          </p>
          {/* Edit Button */}
          <button className="mt-6 bg-[#4338CA] text-white px-8 py-3 rounded-md hover:bg-[#3730A3] transition">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
