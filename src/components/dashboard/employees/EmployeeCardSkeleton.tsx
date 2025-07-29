import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeCardSkeleton() {
  return (
    <Card className="w-full min-w-[255px] gap-1 rounded-md shadow-[0_4px_16px_0_#E6ECF1] border-0 px-5 py-5 flex flex-col items-center ">
      {/* Top: Status and Eye icon row */}
      <div className="w-full flex items-center justify-between mb-1">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="w-14 h-6 rounded-lg" />
      </div>
      <div className="absolute top-4 right-5">
        <Skeleton className="w-7 h-7 rounded-full" />
      </div>

      {/* Avatar */}
      <div className="mt-7 mb-2">
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>

      {/* Name */}
      <Skeleton className="h-5 w-32 mb-2 rounded" />
      {/* Job Title */}
      <Skeleton className="h-4 w-28 mb-1 rounded" />
      {/* ID */}
      <Skeleton className="h-4 w-20 mb-3 rounded" />

      {/* Info box */}
      <div className="bg-[#F6FAFC] w-full rounded-xl p-3 mb-3 mt-1 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#90A3BF] font-semibold">Department:</span>
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#90A3BF] font-semibold">Joining:</span>
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#90A3BF] font-semibold">Salary:</span>
          <Skeleton className="h-4 w-12 rounded" />
        </div>
      </div>

      {/* Email */}
      <Skeleton className="h-4 w-40 mb-1 rounded" />
      {/* Phone */}
      <Skeleton className="h-4 w-32 rounded" />
    </Card>
  );
}
