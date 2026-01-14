export type PotholeStatus = 'reported' | 'assigned' | 'in_progress' | 'repaired' | 'closed';

export type SLAStatus = 'on_track' | 'at_risk' | 'breached';

export interface Pothole {
  id: string;
  location: string;
  dateReported: Date;
  contractor: string;
  expectedSLA: number; // days
  status: PotholeStatus;
  previousRepairs: boolean;
  daysSinceLastRepair?: number;
  daysOpen: number;
  slaStatus: SLAStatus;
}

export interface ContractorScore {
  name: string;
  score: number;
  avgResponseTime: number;
  avgCompletionTime: number;
  repeatOccurrence: number;
  totalAssigned: number;
  completed: number;
}

export interface AgentAnalysis {
  agent: string;
  icon: string;
  color: string;
  analysis: string;
  status: 'success' | 'warning' | 'danger' | 'info';
}

export interface TimelineEvent {
  date: Date;
  status: PotholeStatus;
  description: string;
}

export interface Alert {
  id: string;
  type: 'delay' | 'quality' | 'safety' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  potholeId?: string;
  contractor?: string;
  timestamp: Date;
}
