import { TimeEvent } from "@/lib/time-event.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TimeEventType } from "@/lib/enums";

interface RecentLogsProps {
  events: TimeEvent[];
}

const getActionBadgeClass = (type: TimeEventType): string => {
  switch (type) {
    case TimeEventType.CLOCK_IN:
      return "bg-time-in text-time-in-foreground";
    case TimeEventType.CLOCK_OUT:
      return "bg-time-out text-time-out-foreground";
    case TimeEventType.BREAK_IN:
      return "bg-break-in text-break-in-foreground";
    case TimeEventType.BREAK_OUT:
      return "bg-break-out text-break-out-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const RecentLogs = ({ events = [] }: RecentLogsProps) => {
  const recentEvents = (events || []).slice(0, 5);

  return (
    <div className="w-full">
      {recentEvents.length === 0 ? (
        <div className="text-center py-8 bg-card rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground italic">No recent activity detected.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Action</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Badge className={getActionBadgeClass(event.type)}>
                      {event.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {event.employee ? `${event.employee.firstName} ${event.employee.lastName}` : 'N/A'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        #{event.employee?.employeeNumber || '---'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {new Date(event.happenedAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
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
