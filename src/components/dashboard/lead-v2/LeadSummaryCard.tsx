// components/LeadSummaryCard.tsx
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Minus,
  PauseCircle,
  PhoneCall,
  Star,
  UserCheck,
  X,
} from "lucide-react";

const STATUS_CONFIG = [
  {
    label: "New",
    key: "New",
    icon: <PauseCircle className="w-5 h-5 text-gray-500" />,
    iconBox: "bg-white border border-gray-300",
    iconText: "text-gray-600",
    color: "text-blue-700",
    primary: false,
  },
  {
    label: "Qualified",
    key: "Qualified",
    icon: <Star className="w-5 h-5 text-yellow-400" />,
    iconBox: "bg-white border border-yellow-200",
    iconText: "text-yellow-600",
    color: "text-yellow-700",
    primary: false,
  },
  {
    label: "Interested",
    key: "Interested",
    icon: <UserCheck className="w-5 h-5 text-teal-500" />,
    iconBox: "bg-white border border-teal-200",
    iconText: "text-teal-600",
    color: "text-teal-700",
    primary: false,
  },
  {
    label: "Follow Up",
    key: "Follow Up",
    icon: <PhoneCall className="w-5 h-5 text-blue-500" />,
    iconBox: "bg-white border border-blue-200",
    iconText: "text-blue-600",
    color: "text-blue-700",
    primary: false,
  },
  {
    label: "Admitted",
    key: "Admitted",
    icon: <Check className="w-5 h-5 text-green-500" />,
    iconBox: "bg-white border border-green-200",
    iconText: "text-green-600",
    color: "text-green-700",
    primary: true,
  },
  {
    label: "Canceled",
    key: "Canceled",
    icon: <X className="w-5 h-5 text-red-400" />,
    iconBox: "bg-white border border-red-200",
    iconText: "text-red-600",
    color: "text-red-700",
    primary: false,
  },
  {
    label: "Unqualified",
    key: "Unqualified",
    icon: <X className="w-5 h-5 text-gray-400" />,
    iconBox: "bg-white border border-gray-200",
    iconText: "text-gray-600",
    color: "text-gray-700",
    primary: false,
  },
];

export function LeadSummaryCard({ statusCounts = {}, trends = {}, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-4 bg-white animate-pulse flex gap-2"
          >
            <div className="w-9 h-9 rounded-full bg-gray-100" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-100 rounded w-3/5"></div>
              <div className="h-3 bg-gray-100 rounded w-2/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function getTrendIcon(trend: number) {
    if (trend > 0) return <ArrowUpRight className="w-3 h-3" />;
    if (trend < 0) return <ArrowDownRight className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  }
  function getTrendColor(trend: number) {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-500";
    return "text-gray-400";
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
      {STATUS_CONFIG.map((item) => {
        const value = statusCounts?.[item.key] ?? 0;
        const trend = trends?.[item.key] ?? 0;

        return (
          <div
            key={item.key}
            className="flex flex-col justify-between border border-gray-200 bg-white rounded-xl px-5 py-4 shadow-sm min-w-[210px] transition hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center rounded-full w-8 h-8 ${item.iconBox} mr-2`}
              >
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-semibold ${
                    item.primary ? "text-xl" : "text-base"
                  } leading-5`}
                >
                  {value}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {item.label}
                </span>
              </div>
            </div>
            <div className="flex items-center mt-2 pl-1">
              <span
                className={`text-xs font-medium flex items-center gap-1 ${getTrendColor(
                  trend
                )}`}
              >
                {getTrendIcon(trend)}
                {Math.abs(trend)}%
              </span>
              <span className="ml-1 text-xs text-gray-400 font-normal">
                vs last month
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
