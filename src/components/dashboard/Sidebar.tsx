"use client";
import { menuSections } from "@/constants/sidebarMenu";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Set all sections open by default (except if previously toggled)
  const defaultOpenState = Object.fromEntries(
    menuSections.map((s) => [s.label, true])
  );
  const [openSections, setOpenSections] = useState(defaultOpenState);

  const pathname = usePathname();

  // Properly toggle submenu even when sidebar is re-expanded
  const handleSectionToggle = (label: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-white border-r shadow-md flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{ minWidth: collapsed ? 64 : 240, zIndex: 40 }}
    >
      {/* Top (Logo and Collapse Button) */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        {!collapsed && (
          <span
            className={`font-extrabold text-lg tracking-tight text-[var(--color-primary)] transition-all duration-200 ${
              collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          >
            Admin Panel
          </span>
        )}
        <button
          className="p-1 border rounded hover:bg-gray-100 transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Scrollable menu area */}
      <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {menuSections.map((section) => (
          <div key={section.label} className="mb-2">
            {/* Section header */}
            <div
              className={`flex items-center px-3 py-1 text-xs font-semibold uppercase text-gray-400 ${
                collapsed ? "hidden" : ""
              }`}
            >
              <span>{section.label}</span>
              {section.items.length > 1 && (
                <button
                  className="ml-auto"
                  onClick={() => handleSectionToggle(section.label)}
                  tabIndex={-1}
                  aria-label={`Toggle ${section.label}`}
                  type="button"
                >
                  {openSections[section.label] ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </button>
              )}
            </div>
            <ul className={`space-y-1 ${collapsed ? "pl-0" : "pl-2 pr-2"}`}>
              {section.items.map((item) => {
                const Icon = item.icon;
                // Show if section is open, or if sidebar is collapsed (always show all in collapsed mode)
                const showItem =
                  section.items.length === 1 ||
                  openSections[section.label] ||
                  collapsed;

                return (
                  <li key={item.label} className={showItem ? "" : "hidden"}>
                    <TooltipOnCollapsed
                      label={item.label}
                      collapsed={collapsed}
                    >
                      <Link
                        href={item.href}
                        className={`group relative flex items-center gap-3 px-2 py-2 rounded-md transition
                          ${
                            pathname === item.href
                              ? "bg-[var(--color-primary)] text-white font-semibold"
                              : "hover:bg-gray-100 text-gray-700"
                          }
                          ${collapsed ? "justify-center" : ""}
                        `}
                      >
                        <span>
                          <Icon size={20} />
                        </span>
                        {/* Label hidden in collapsed mode */}
                        <span
                          className={`transition-all duration-150 ${
                            collapsed ? "hidden" : "block"
                          }`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </TooltipOnCollapsed>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

// Tooltip for collapsed mode
function TooltipOnCollapsed({
  children,
  label,
  collapsed,
}: {
  children: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  const [show, setShow] = useState(false);

  if (!collapsed) return <>{children}</>;
  return (
    <div
      className="relative flex justify-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="fixed left-16 z-50 top-auto bg-gray-900 text-white text-xs rounded px-3 py-1 ml-2 shadow-lg pointer-events-none whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}
