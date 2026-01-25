import { cn } from '@/lib/utils';
import { TimelineEvent } from '@/types/bharatGuardian';
import { format } from 'date-fns';
import { CheckCircle, Circle, Clock, Wrench, Flag, FileCheck, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  potholeId: string;
}

const statusIcons: Record<string, LucideIcon> = {
  reported: Flag,
  assigned: FileCheck,
  in_progress: Wrench,
  repaired: CheckCircle,
  closed: Circle,
  // Supply chain statuses
  ingested: Package,
  validated: CheckCircle,
  flagged: AlertTriangle,
  resolved: TrendingUp,
  monitoring: Clock,
};

const statusColors: Record<string, string> = {
  reported: 'bg-info text-info-foreground',
  assigned: 'bg-agent-detection text-white',
  in_progress: 'bg-warning text-warning-foreground',
  repaired: 'bg-success text-success-foreground',
  closed: 'bg-muted text-muted-foreground',
  // Supply chain statuses
  ingested: 'bg-info text-info-foreground',
  validated: 'bg-success text-success-foreground',
  flagged: 'bg-destructive text-destructive-foreground',
  resolved: 'bg-success text-success-foreground',
  monitoring: 'bg-warning text-warning-foreground',
};

export function Timeline({ events, potholeId }: TimelineProps) {
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-agent-transparency" />
          <h3 className="text-lg font-semibold text-foreground">Public Transparency Timeline</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Track progress for Entity <span className="font-mono text-primary">{potholeId}</span>
        </p>
      </div>
      
      <div className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {events.map((event, index) => {
              const Icon = statusIcons[event.status] || Circle;
              const colorClass = statusColors[event.status] || 'bg-muted text-muted-foreground';
              const isLast = index === events.length - 1;
              
              return (
                <div 
                  key={index}
                  className="relative flex gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div className={cn(
                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center",
                    colorClass,
                    isLast && "ring-4 ring-offset-2 ring-offset-card"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground capitalize">
                        {event.status.replace('_', ' ')}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {format(event.date, 'MMM d, yyyy • h:mm a')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Citizen-friendly message */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-foreground">
            <span className="font-semibold">📍 What this means for you:</span>{' '}
            Your reported issue is being actively tracked. Our AI system monitors progress 24/7 
            to ensure timely resolution and accountability.
          </p>
        </div>
      </div>
    </div>
  );
}
