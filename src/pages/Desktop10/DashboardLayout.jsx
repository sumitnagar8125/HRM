"use client";
import React from "react";
import Header from "./Header";
import Details from "./Details";
import About from "./About";

export default function DashboardLayout() {
    return (
        <div className="flex flex-col flex-1 bg-gray-50 h-screen overflow-y-auto">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="space-y-6">
                    <Details />
                    <About />
                </div>
            </main>

        </div>
    );
}
