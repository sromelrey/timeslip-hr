import { TimeLog, TimeAction } from "@/components/TimeEntryForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface RecentLogsProps {
  logs: TimeLog[];
}

const getActionBadgeClass = (action: TimeAction): string => {
  switch (action) {
    case "Time In":
      return "bg-time-in/10 text-time-in border-time-in/20 hover:bg-time-in/20";
    case "Time Out":
      return "bg-time-out/10 text-time-out border-time-out/20 hover:bg-time-out/20";
    case "Break In":
      return "bg-break-in/10 text-break-in border-break-in/20 hover:bg-break-in/20";
    case "Break Out":
      return "bg-break-out/10 text-break-out border-break-out/20 hover:bg-break-out/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const RecentLogs = ({ logs }: RecentLogsProps) => {
  const recentLogs = logs.slice(0, 5);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Recent Logs</h2>
        <span className="text-sm text-muted-foreground">
          (Last {recentLogs.length} entries)
        </span>
      </div>

      {recentLogs.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Clock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">No time entries recorded yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Enter your employee number and log your time above
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-soft">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Employee No.</TableHead>
                <TableHead className="font-semibold">Action</TableHead>
                <TableHead className="font-semibold text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs.map((log, index) => (
                <TableRow
                  key={log.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-mono font-medium">
                    #{log.employeeNo}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-medium ${getActionBadgeClass(log.action)}`}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    {log.timestamp.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RecentLogs;
