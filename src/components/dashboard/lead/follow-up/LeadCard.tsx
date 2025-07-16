"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Pencil, RefreshCw } from "lucide-react";
import { useState } from "react";
import { ActionBar } from "./ActionBar";
import { EditHistoryTimeline } from "./EditHistoryTimeline";
import { LeadStatusModal } from "./LeadStatusModal";

// Helper for date formatting
const fmt = (d: string) =>
  d && !isNaN(Date.parse(d))
    ? new Date(d).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

export function LeadCard({
  lead,
  onRefresh,
}: {
  lead: any;
  onRefresh?: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const last = lead.statusHistory[0];
  const prev = lead.statusHistory.slice(1);

  return (
    <Card className="p-0 max-w-4xl min-w-[450px] mx-auto rounded-md border border-gray-200 shadow-lg bg-white">
      {/* Header */}
      <div className="flex items-start justify-between px-8 pt-8 pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={lead.avatar} />
            <AvatarFallback>{lead.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-bold">{lead.name}</div>
            <div className="text-xs text-muted-foreground">{lead.phone}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onRefresh}>
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setExpanded((x) => !x)}
            >
              {expanded ? (
                <>
                  SHOW LESS <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  SHOW MORE <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            Updated {lead.updated}
          </span>
        </div>
      </div>

      {/* Next follow-up badge */}
      <div className="px-8 mt-2">
        <span className="text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded px-3 py-1">
          Next follow-up: {fmt(lead.nextFollowup)}
        </span>
      </div>

      {/* Main status/remarks box */}
      <div className="px-8 mt-5">
        <div className="flex items-start bg-gray-50 border rounded-lg px-6 py-4 gap-3">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">
              <span className="font-semibold">{last.user}</span> updated to{" "}
              <Badge className="bg-blue-100 text-blue-700">{last.status}</Badge>
              <span className="ml-2 text-xs text-gray-400">
                {fmt(last.datetime)}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">Remarks:</span>{" "}
              {last.remarks || (
                <span className="italic text-gray-400">No remarks</span>
              )}
            </div>
            <div className="text-xs mt-1 text-gray-600 flex flex-wrap gap-4">
              {last.appointment && (
                <div className="text-xs mt-1 text-gray-500">
                  <span className="font-semibold">Appointment:</span>{" "}
                  {fmt(last.appointment)}
                </div>
              )}

              {last.course && (
                <div>
                  <span className="font-semibold">Interested Course:</span>{" "}
                  {last.course}
                </div>
              )}
            </div>
            {prev.length > 0 && (
              <Button
                variant="link"
                size="sm"
                className="text-xs px-0 mt-2"
                onClick={() => setHistoryOpen((v) => !v)}
              >
                {historyOpen ? "Hide Previous" : "Show Previous"}
              </Button>
            )}
          </div>
          {/* Pencil (edit) button */}
          <Button
            variant="outline"
            size="icon"
            className="border-blue-200 hover:bg-blue-50 mt-1"
            title="Change Status"
            onClick={() => setStatusModalOpen(true)}
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </Button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-8 mt-4 flex justify-end">
        <ActionBar phone={lead.phone} email={lead.email} />
      </div>

      {/* History timeline */}
      {historyOpen && (
        <div className="px-8 mt-6 mb-4">
          <div className="bg-gray-50 border border-gray-100 rounded-xl shadow-sm px-5 py-5">
            <EditHistoryTimeline history={prev} />
          </div>
        </div>
      )}

      {/* Expandable Project Info and Actions */}
      {expanded && (
        <div className="px-8 pt-5 pb-8 border-t mt-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="text-xs text-gray-500 mb-1">PROJECT INFO</div>
            <div className="font-semibold text-base">{lead.projectInfo}</div>
            <div className="flex items-center gap-8 mt-3">
              <div>
                <div className="text-xs text-gray-500">EST. REVENUE</div>
                <div className="text-lg font-bold">{lead.revenue}</div>
              </div>
              <div className="w-32">
                <div className="text-xs text-gray-500">LIKELIHOOD</div>
                <div className="h-2 rounded-full bg-gray-200 w-full mt-1">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${lead.likelihood}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              Sales Rep
              {lead.salesRep.map((rep: any) => (
                <Avatar key={rep.name} className="w-7 h-7">
                  <AvatarImage src={rep.img} />
                  <AvatarFallback>{rep.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      <LeadStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        lead={lead}
        onStatusChange={() => {
          setStatusModalOpen(false);
          onRefresh?.();
        }}
      />
    </Card>
  );
}
