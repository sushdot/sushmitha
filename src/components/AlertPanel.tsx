import { Alert } from '@/types/pothole';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  Clock, 
  Shield, 
  TrendingDown,
  Bell,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertPanelProps {
  alerts: Alert[];
}

const alertIcons = {
  delay: Clock,
  quality: Shield,
  safety: AlertTriangle,
  performance: TrendingDown,
};

const severityColors = {
  low: 'border-l-info bg-info/5',
  medium: 'border-l-warning bg-warning/5',
  high: 'border-l-agent-alert bg-agent-alert/5',
  critical: 'border-l-destructive bg-destructive/5 animate-pulse-slow',
};

const severityBadge = {
  low: 'bg-info/15 text-info',
  medium: 'bg-warning/15 text-warning',
  high: 'bg-agent-alert/15 text-agent-alert',
  critical: 'bg-destructive/15 text-destructive',
};

export function AlertPanel({ alerts }: AlertPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-card p-6 text-center animate-fade-in">
        <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Bell className="w-6 h-6 text-success" />
        </div>
        <h3 className="font-semibold text-foreground">All Clear</h3>
        <p className="text-sm text-muted-foreground mt-1">No active alerts at this time</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <AlertTriangle className="w-5 h-5 text-agent-alert" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Accountability Alerts</h3>
          </div>
          <span className="px-2 py-1 bg-destructive/15 text-destructive text-xs font-medium rounded-full">
            {alerts.length} Active
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {alerts.map((alert, index) => {
          const Icon = alertIcons[alert.type];
          
          return (
            <div 
              key={alert.id}
              className={cn(
                "p-4 border-l-4 animate-slide-up",
                severityColors[alert.severity]
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-card rounded-lg shadow-sm">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground">{alert.title}</h4>
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full uppercase",
                      severityBadge[alert.severity]
                    )}>
                      {alert.severity}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                  
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    {alert.potholeId && (
                      <span className="font-mono">ID: {alert.potholeId}</span>
                    )}
                    {alert.contractor && (
                      <span>Contractor: {alert.contractor}</span>
                    )}
                    <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
