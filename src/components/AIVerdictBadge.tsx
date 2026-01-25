import { cn } from '@/lib/utils';
import { AIVerdict } from '@/types/roadGuardianX';
import { Brain, AlertTriangle, CheckCircle, Search, Ban, Eye } from 'lucide-react';

interface AIVerdictBadgeProps {
  verdict: AIVerdict;
  compact?: boolean;
}

const verdictIcons = {
  monitor: Eye,
  escalate: AlertTriangle,
  audit: Search,
  blacklist_recommendation: Ban,
  close: CheckCircle,
};

const verdictColors = {
  monitor: 'bg-success/15 text-success border-success/30',
  escalate: 'bg-warning/15 text-warning border-warning/30',
  audit: 'bg-info/15 text-info border-info/30',
  blacklist_recommendation: 'bg-destructive/15 text-destructive border-destructive/30',
  close: 'bg-muted text-muted-foreground border-border',
};

const severityColors = {
  routine: 'bg-success',
  attention: 'bg-info',
  urgent: 'bg-warning',
  critical: 'bg-destructive animate-pulse',
};

export function AIVerdictBadge({ verdict, compact = false }: AIVerdictBadgeProps) {
  const Icon = verdictIcons[verdict.decision] || Brain;
  
  if (compact) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium",
        verdictColors[verdict.decision]
      )}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{verdict.decision.replace('_', ' ')}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border",
      verdictColors[verdict.decision]
    )}>
      <div className="flex items-center gap-2">
        <div className={cn("p-1.5 rounded-lg bg-card")}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-sm capitalize">
            {verdict.decision.replace('_', ' ')}
          </p>
          <p className="text-xs opacity-70">
            {verdict.confidence}% confidence
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          severityColors[verdict.severity]
        )} />
        <span className="text-xs font-medium capitalize">
          {verdict.severity}
        </span>
      </div>
    </div>
  );
}

export function AIVerdictMini({ verdict }: { verdict: AIVerdict }) {
  const Icon = verdictIcons[verdict.decision] || Brain;
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
      verdict.severity === 'critical' && 'bg-destructive text-destructive-foreground',
      verdict.severity === 'urgent' && 'bg-warning text-warning-foreground',
      verdict.severity === 'attention' && 'bg-info text-info-foreground',
      verdict.severity === 'routine' && 'bg-success text-success-foreground'
    )}>
      <Icon className="w-2.5 h-2.5" />
      <span>{verdict.decision.replace('_', ' ').toUpperCase()}</span>
    </div>
  );
}
