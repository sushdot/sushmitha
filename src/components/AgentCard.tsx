import { cn } from '@/lib/utils';
import { AgentAnalysis } from '@/types/bharatGuardian';
import { 
  Eye, 
  GitBranch, 
  UserCheck, 
  Shield, 
  Clock, 
  AlertTriangle,
  Database,
  TrendingUp,
  AlertOctagon,
  Users,
  Banknote,
  Brain,
  ShieldAlert,
  LucideIcon
} from 'lucide-react';

const agentIcons: Record<string, LucideIcon> = {
  // Original agents
  'Detection Agent': Eye,
  'Repair Tracking Agent': GitBranch,
  'Contractor Performance Agent': UserCheck,
  'Durability & Quality Agent': Shield,
  'Transparency & Timeline Agent': Clock,
  'Alert & Accountability Agent': AlertTriangle,
  // BHARAT-GUARDIAN agents
  'National Data Ingestion Agent': Database,
  'Lifecycle Tracking Agent': GitBranch,
  'Accountability & Scoring Agent': UserCheck,
  'Validation & Anomaly Detection Agent': Shield,
  'Transparency & Citizen Explanation Agent': Clock,
  'Alert & Early Warning Agent': AlertTriangle,
  'Prediction & Forecasting Agent': TrendingUp,
  // ROAD-GUARDIAN X Advanced agents
  'Durability Prediction Agent': Clock,
  'Contractor Risk Intelligence Agent': ShieldAlert,
  'Citizen Trust Index Agent': Users,
  'Criticality & Safety Agent': AlertTriangle,
  'Financial Leakage Detection Agent': Banknote,
  'AI Verdict & Escalation Agent': Brain,
  'Duplicate Complaint Analyzer Agent': AlertOctagon,
};

const agentColors: Record<string, string> = {
  // Original agents
  'Detection Agent': 'bg-agent-detection/10 text-agent-detection border-agent-detection/30',
  'Repair Tracking Agent': 'bg-agent-tracking/10 text-agent-tracking border-agent-tracking/30',
  'Contractor Performance Agent': 'bg-agent-contractor/10 text-agent-contractor border-agent-contractor/30',
  'Durability & Quality Agent': 'bg-agent-quality/10 text-agent-quality border-agent-quality/30',
  'Transparency & Timeline Agent': 'bg-agent-transparency/10 text-agent-transparency border-agent-transparency/30',
  'Alert & Accountability Agent': 'bg-agent-alert/10 text-agent-alert border-agent-alert/30',
  // BHARAT-GUARDIAN agents
  'National Data Ingestion Agent': 'bg-agent-detection/10 text-agent-detection border-agent-detection/30',
  'Lifecycle Tracking Agent': 'bg-agent-tracking/10 text-agent-tracking border-agent-tracking/30',
  'Accountability & Scoring Agent': 'bg-agent-contractor/10 text-agent-contractor border-agent-contractor/30',
  'Validation & Anomaly Detection Agent': 'bg-agent-quality/10 text-agent-quality border-agent-quality/30',
  'Transparency & Citizen Explanation Agent': 'bg-agent-transparency/10 text-agent-transparency border-agent-transparency/30',
  'Alert & Early Warning Agent': 'bg-agent-alert/10 text-agent-alert border-agent-alert/30',
  'Prediction & Forecasting Agent': 'bg-info/10 text-info border-info/30',
  // ROAD-GUARDIAN X Advanced agents
  'Durability Prediction Agent': 'bg-info/10 text-info border-info/30',
  'Contractor Risk Intelligence Agent': 'bg-agent-alert/10 text-agent-alert border-agent-alert/30',
  'Citizen Trust Index Agent': 'bg-success/10 text-success border-success/30',
  'Criticality & Safety Agent': 'bg-warning/10 text-warning border-warning/30',
  'Financial Leakage Detection Agent': 'bg-primary/10 text-primary border-primary/30',
  'AI Verdict & Escalation Agent': 'bg-agent-detection/10 text-agent-detection border-agent-detection/30',
  'Duplicate Complaint Analyzer Agent': 'bg-agent-quality/10 text-agent-quality border-agent-quality/30',
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
  const colorClass = agentColors[analysis.agent] || 'bg-muted text-muted-foreground border-border';
  
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
