"use client";

import Header from "./Header";
import Support from "./Support";
import MyTickets from "./MyTickets";
import Contact from "./Contact";
import RateSupport from "./RateSupport";

export default function DashboardLayout() {
  const dummyData = {
    phoneNumber: "+918888888888",
    whatsappLink: "https://wa.me/918888888888",
  };

  // 🔹 Dummy links
  const dummyLinks = {
    faqLink: "/support/faqs",
    ticketsLink: "/support/my-tickets",
    feedbackLink: "/support/feedback",
  };

  // 🔹 Dummy support hours & contact
  const contactInfo = {
    hours: {
      weekdays: "9:00 AM – 6:00 PM",
      saturday: "10:00 AM – 4:00 PM",
    },
    contact: {
      email: "support@company.com",
      phone: "+1 (800) 123-4567",
    },
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {/* ✅ Removed max-w-7xl, now full width */}
        <div className="w-full space-y-8">
          <Support
            phoneNumber={dummyData.phoneNumber}
            whatsappLink={dummyData.whatsappLink}
          />

          <MyTickets
            faqLink={dummyLinks.faqLink}
            ticketsLink={dummyLinks.ticketsLink}
          />

          <Contact
            hours={contactInfo.hours}
            contact={contactInfo.contact}
          />

          <RateSupport feedbackLink={dummyLinks.feedbackLink} />
        </div>
      </main>
    </div>
  );
}
