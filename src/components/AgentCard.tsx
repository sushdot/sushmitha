import { cn } from '@/lib/utils';
import { AgentAnalysis } from '@/types/pothole';
import { 
  Eye, 
  GitBranch, 
  UserCheck, 
  Shield, 
  Clock, 
  AlertTriangle,
  LucideIcon
} from 'lucide-react';

const agentIcons: Record<string, LucideIcon> = {
  'Detection Agent': Eye,
  'Repair Tracking Agent': GitBranch,
  'Contractor Performance Agent': UserCheck,
  'Durability & Quality Agent': Shield,
  'Transparency & Timeline Agent': Clock,
  'Alert & Accountability Agent': AlertTriangle,
};

const agentColors: Record<string, string> = {
  'Detection Agent': 'bg-agent-detection/10 text-agent-detection border-agent-detection/30',
  'Repair Tracking Agent': 'bg-agent-tracking/10 text-agent-tracking border-agent-tracking/30',
  'Contractor Performance Agent': 'bg-agent-contractor/10 text-agent-contractor border-agent-contractor/30',
  'Durability & Quality Agent': 'bg-agent-quality/10 text-agent-quality border-agent-quality/30',
  'Transparency & Timeline Agent': 'bg-agent-transparency/10 text-agent-transparency border-agent-transparency/30',
  'Alert & Accountability Agent': 'bg-agent-alert/10 text-agent-alert border-agent-alert/30',
};

const statusColors = {
  success: 'border-l-success',
  warning: 'border-l-warning',
  danger: 'border-l-destructive',
  info: 'border-l-info',
};

interface AgentCardProps {
  analysis: AgentAnalysis;
}

export function AgentCard({ analysis }: AgentCardProps) {
  const Icon = agentIcons[analysis.agent] || Eye;
  const colorClass = agentColors[analysis.agent] || 'bg-muted text-muted-foreground';
  
  return (
    <div className={cn(
      "bg-card rounded-xl p-4 shadow-card border-l-4 animate-slide-up",
      statusColors[analysis.status]
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg border", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground">{analysis.agent}</h4>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {analysis.analysis}
          </p>
        </div>
      </div>
    </div>
  );
}
