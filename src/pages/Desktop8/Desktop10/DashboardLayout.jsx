"use client";
import Header from "./Header";
import Details from "./Details";
import About from "./About";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <Header />
      {/* Page Content */}
      <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="space-y-6 max-w-5xl mx-auto w-full">
          <Details />
          <About />
        </div>
      </main>
    </div>
  );
}
