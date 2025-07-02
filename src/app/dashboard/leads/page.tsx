import { List, Plus, Rocket, RefreshCcw, FileSpreadsheet } from "lucide-react";
import React from "react";

export default function LeadPage() {
  return (
    <div className="w-full max-w-[100vw] flex flex-col items-center justify-center">
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* -- Everything else inside this card -- */}
        {/* Top buttons */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border rounded-md px-4 py-2 bg-white hover:bg-blue-50 transition text-sm font-medium">
              <List size={18} /> New List
            </button>
            <button className="flex items-center gap-2 border rounded-md px-4 py-2 bg-white hover:bg-blue-50 transition text-sm font-medium">
              <Plus size={18} /> Add lead
            </button>
            <button className="flex items-center gap-2 border rounded-md px-4 py-2 bg-white hover:bg-blue-50 transition text-sm font-medium">
              <Rocket size={18} /> Prompts
            </button>
          </div>
          <button className="flex items-center gap-2 border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold rounded-md px-4 py-2 transition text-sm">
            <RefreshCcw size={18} className="text-orange-600" /> Sync Hubspot
          </button>
        </div>

        {/* Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          {/* Current Lead Dropdown (fake) */}
          <div className="bg-[#F5F8FB] px-3 py-2 rounded-lg border border-gray-200 flex flex-col gap-1 min-w-[180px]">
            <span className="text-xs font-medium text-gray-500 mb-1">
              Current Lead
            </span>
            <select className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm">
              <option>B2B Bussines Fintech</option>
              <option>Another Lead</option>
            </select>
          </div>

          {/* Current Prompt Dropdown (fake) */}
          <div className="bg-[#F5F8FB] px-3 py-2 rounded-lg border border-gray-200 flex flex-col gap-1 min-w-[180px]">
            <span className="text-xs font-medium text-gray-500 mb-1">
              Current Prompt
            </span>
            <select className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm">
              <option>Write a Google Ad description</option>
              <option>Another prompt</option>
            </select>
          </div>

          {/* LinkedIn URL Input */}
          <div className="bg-[#F5F8FB] px-3 py-2 rounded-lg border border-gray-200 flex flex-col gap-1 min-w-[220px]">
            <span className="text-xs font-medium text-gray-500 mb-1">
              Enter LinkedIn URL past here
            </span>
            <input
              type="text"
              placeholder="https://linkedin.com/in/"
              className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
            />
          </div>

          {/* Upload CSV */}
          <div className="flex flex-col justify-end">
            <label
              htmlFor="csv-upload"
              className="flex items-center justify-center w-full h-12 px-3 py-2 rounded-lg border border-dashed border-blue-300 bg-[#F5F8FB] hover:bg-blue-50 cursor-pointer transition"
            >
              <FileSpreadsheet size={20} className="text-blue-600 mr-2" />
              <span className="font-medium text-blue-700">Upload CSV</span>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
