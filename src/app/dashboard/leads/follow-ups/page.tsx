"use client";
import { LeadCard } from "@/components/dashboard/lead/follow-up/LeadCard";
import { useEffect, useState } from "react";

// Dummy Data

const MOCK_LEADS = [
  {
    id: 101,
    name: "Leslie Alexander",
    phone: "01722-448922",
    email: "leslie.alexander@email.com",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "Follow Up",
    nextFollowup: "2025-07-21T10:00:00",
    updated: "10 min ago",
    projectInfo: "IELTS Mock Test - Package C",
    revenue: "$12,000",
    likelihood: 78,
    salesRep: [
      {
        name: "Brooklyn Simmons",
        img: "https://randomuser.me/api/portraits/men/67.jpg",
      },
      {
        name: "Filipe Almeida",
        img: "https://randomuser.me/api/portraits/men/47.jpg",
      },
    ],
    statusHistory: [
      {
        user: "Brooklyn Simmons",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        datetime: "2025-07-15T09:00:00",
        status: "Follow Up",
        remarks: "Student is interested but needs a call after July 20.",
        appointment: "2025-07-21T10:00:00",
        course: "IELTS Advanced",
      },
      {
        user: "Filipe Almeida",
        avatar: "https://randomuser.me/api/portraits/men/47.jpg",
        datetime: "2025-07-10T14:30:00",
        status: "Interested",
        remarks: "Shared course details and pricing via WhatsApp.",
        appointment: "",
        course: "IELTS Basic",
      },
      {
        user: "Leslie Alexander",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        datetime: "2025-07-08T11:10:00",
        status: "New",
        remarks: "",
        appointment: "",
        course: "",
      },
    ],
  },
];

export default function LeadFollowUpPage() {
  const [leads, setLeads] = useState([]);

  async function fetchLeadsAgain() {
    alert("refreshed");
  }

  useEffect(() => {
    // Replace with your API call
    setLeads(MOCK_LEADS);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-2">
      <div className="mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </div>
    </div>
  );
}
