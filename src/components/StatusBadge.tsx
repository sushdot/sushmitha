import { cn } from '@/lib/utils';
import { PotholeStatus, SLAStatus } from '@/types/pothole';

interface StatusBadgeProps {
  status: PotholeStatus | SLAStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<PotholeStatus | SLAStatus, { label: string; className: string }> = {
  reported: { label: 'Reported', className: 'bg-info/15 text-info border-info/30' },
  assigned: { label: 'Assigned', className: 'bg-agent-detection/15 text-agent-detection border-agent-detection/30' },
  in_progress: { label: 'In Progress', className: 'bg-warning/15 text-warning border-warning/30' },
  repaired: { label: 'Repaired', className: 'bg-success/15 text-success border-success/30' },
  closed: { label: 'Closed', className: 'bg-muted text-muted-foreground border-border' },
  on_track: { label: 'On Track', className: 'bg-success/15 text-success border-success/30' },
  at_risk: { label: 'At Risk', className: 'bg-warning/15 text-warning border-warning/30' },
  breached: { label: 'SLA Breached', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border font-medium",
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      config.className
    )}>
      {config.label}
    </span>
  );
}
