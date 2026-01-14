import { 
  Pothole, 
  ContractorScore, 
  AgentAnalysis, 
  TimelineEvent, 
  Alert,
  PotholeStatus,
  SLAStatus
} from '@/types/pothole';

// Calculate SLA status based on days open and expected SLA
function calculateSLAStatus(daysOpen: number, expectedSLA: number): SLAStatus {
  const ratio = daysOpen / expectedSLA;
  if (ratio < 0.7) return 'on_track';
  if (ratio < 1) return 'at_risk';
  return 'breached';
}

// Detection Agent Analysis
function runDetectionAgent(pothole: Pothole, existingPotholes: Pothole[]): AgentAnalysis {
  const isDuplicate = existingPotholes.some(
    p => p.location.toLowerCase() === pothole.location.toLowerCase() && p.id !== pothole.id
  );
  
  if (isDuplicate) {
    return {
      agent: 'Detection Agent',
      icon: 'eye',
      color: 'agent-detection',
      analysis: `DUPLICATE DETECTED: A pothole at "${pothole.location}" has already been reported. Merging with existing record to prevent duplicate tracking.`,
      status: 'warning'
    };
  }
  
  return {
    agent: 'Detection Agent',
    icon: 'eye',
    color: 'agent-detection',
    analysis: `NEW POTHOLE REGISTERED: Assigned unique ID ${pothole.id}. Location "${pothole.location}" confirmed as new report. Initial severity assessment pending field verification.`,
    status: 'info'
  };
}

// Repair Tracking Agent Analysis
function runTrackingAgent(pothole: Pothole): AgentAnalysis {
  const statusMessages: Record<PotholeStatus, string> = {
    reported: 'Pothole has been logged and is awaiting contractor assignment. Average wait time: 24-48 hours.',
    assigned: `Contractor "${pothole.contractor}" has been assigned. Work order generated. Expected site visit within 72 hours.`,
    in_progress: 'Repair work is actively underway. Contractor is on-site. Estimated completion based on SLA tracking.',
    repaired: 'Physical repair completed. Entering 30-day quality monitoring period to verify durability.',
    closed: 'Repair verified and closed. No further action required unless quality issues arise.'
  };
  
  const slaMessages: Record<SLAStatus, { msg: string; status: AgentAnalysis['status'] }> = {
    on_track: { msg: 'Timeline is within expected SLA bounds.', status: 'success' },
    at_risk: { msg: 'WARNING: Approaching SLA deadline. Escalation protocols may be triggered.', status: 'warning' },
    breached: { msg: 'CRITICAL: SLA has been breached. Immediate escalation required.', status: 'danger' }
  };
  
  const slaInfo = slaMessages[pothole.slaStatus];
  
  return {
    agent: 'Repair Tracking Agent',
    icon: 'git-branch',
    color: 'agent-tracking',
    analysis: `${statusMessages[pothole.status]} ${slaInfo.msg} Days open: ${pothole.daysOpen}/${pothole.expectedSLA}.`,
    status: slaInfo.status
  };
}

// Contractor Performance Agent Analysis
function runContractorAgent(pothole: Pothole, contractorScore: ContractorScore): AgentAnalysis {
  let analysis = '';
  let status: AgentAnalysis['status'] = 'info';
  
  if (contractorScore.score >= 80) {
    analysis = `Contractor "${pothole.contractor}" has an EXCELLENT performance record (Score: ${contractorScore.score}/100). High reliability for quality repairs. Avg response: ${contractorScore.avgResponseTime}h.`;
    status = 'success';
  } else if (contractorScore.score >= 60) {
    analysis = `Contractor "${pothole.contractor}" shows MODERATE performance (Score: ${contractorScore.score}/100). Some delays noted. Repeat issue rate: ${contractorScore.repeatOccurrence}%. Enhanced monitoring active.`;
    status = 'warning';
  } else {
    analysis = `ALERT: Contractor "${pothole.contractor}" has POOR performance (Score: ${contractorScore.score}/100). High repeat occurrence rate (${contractorScore.repeatOccurrence}%). Consider contractor review or reassignment.`;
    status = 'danger';
  }
  
  return {
    agent: 'Contractor Performance Agent',
    icon: 'user-check',
    color: 'agent-contractor',
    analysis,
    status
  };
}

// Quality & Durability Agent Analysis
function runQualityAgent(pothole: Pothole): AgentAnalysis {
  if (pothole.previousRepairs) {
    const isFrequent = pothole.daysSinceLastRepair && pothole.daysSinceLastRepair < 90;
    
    if (isFrequent) {
      return {
        agent: 'Durability & Quality Agent',
        icon: 'shield',
        color: 'agent-quality',
        analysis: `HIGH RECURRENCE RISK: This pothole was repaired only ${pothole.daysSinceLastRepair} days ago. Indicates potential workmanship issues or underlying road structure problems. Recommending thorough investigation and contractor quality review.`,
        status: 'danger'
      };
    }
    
    return {
      agent: 'Durability & Quality Agent',
      icon: 'shield',
      color: 'agent-quality',
      analysis: `REPEAT REPAIR NOTED: Previous repair was ${pothole.daysSinceLastRepair} days ago. While within acceptable durability range, flagging for quality monitoring during next repair cycle.`,
      status: 'warning'
    };
  }
  
  return {
    agent: 'Durability & Quality Agent',
    icon: 'shield',
    color: 'agent-quality',
    analysis: 'First-time report. No prior repair history. Standard quality protocols will apply upon completion. Expected repair durability: 2-5 years depending on traffic load.',
    status: 'success'
  };
}

// Transparency & Timeline Agent Analysis
function runTransparencyAgent(pothole: Pothole): AgentAnalysis {
  const citizenMessage = `Citizen-friendly update: Your reported road issue at "${pothole.location}" is currently ${pothole.status.replace('_', ' ')}. `;
  
  const progressMessages: Record<PotholeStatus, string> = {
    reported: 'A contractor will be assigned within 48 hours.',
    assigned: `${pothole.contractor} has been assigned and will begin work soon.`,
    in_progress: 'Repair work is happening now. Thank you for your patience.',
    repaired: 'Great news! The repair is complete. We will monitor for quality.',
    closed: 'This issue has been fully resolved. Thank you for reporting!'
  };
  
  return {
    agent: 'Transparency & Timeline Agent',
    icon: 'clock',
    color: 'agent-transparency',
    analysis: citizenMessage + progressMessages[pothole.status] + ` Expected completion within ${pothole.expectedSLA} days of report.`,
    status: 'info'
  };
}

// Alert & Accountability Agent Analysis
function runAlertAgent(pothole: Pothole, contractorScore: ContractorScore): AgentAnalysis {
  const issues: string[] = [];
  let status: AgentAnalysis['status'] = 'success';
  
  if (pothole.slaStatus === 'breached') {
    issues.push('SLA BREACH - Immediate escalation to city authorities');
    status = 'danger';
  } else if (pothole.slaStatus === 'at_risk') {
    issues.push('SLA at risk - Contractor notified for expedited action');
    status = 'warning';
  }
  
  if (contractorScore.score < 60) {
    issues.push(`Underperforming contractor flagged (Score: ${contractorScore.score})`);
    status = status === 'danger' ? 'danger' : 'warning';
  }
  
  if (pothole.previousRepairs && pothole.daysSinceLastRepair && pothole.daysSinceLastRepair < 90) {
    issues.push('Quality concern - Repeat failure within 90 days');
    status = 'danger';
  }
  
  if (issues.length === 0) {
    return {
      agent: 'Alert & Accountability Agent',
      icon: 'alert-triangle',
      color: 'agent-alert',
      analysis: 'No critical issues detected. All accountability metrics within acceptable parameters. Continuing standard monitoring.',
      status: 'success'
    };
  }
  
  return {
    agent: 'Alert & Accountability Agent',
    icon: 'alert-triangle',
    color: 'agent-alert',
    analysis: `ACCOUNTABILITY ALERTS TRIGGERED: ${issues.join('. ')}. Automated notifications sent to relevant authorities.`,
    status
  };
}

// Generate timeline events
export function generateTimeline(pothole: Pothole): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const baseDate = new Date(pothole.dateReported || new Date());
  
  events.push({
    date: baseDate,
    status: 'reported',
    description: `Pothole reported by citizen at ${pothole.location}. AI system registered and assigned tracking ID.`
  });
  
  const statusOrder: PotholeStatus[] = ['assigned', 'in_progress', 'repaired', 'closed'];
  const statusIndex = statusOrder.indexOf(pothole.status);
  
  if (statusIndex >= 0) {
    events.push({
      date: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      status: 'assigned',
      description: `Contractor ${pothole.contractor} assigned to repair. Work order #WO-${pothole.id.slice(-4)} generated.`
    });
  }
  
  if (statusIndex >= 1) {
    events.push({
      date: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
      description: 'Contractor on-site. Repair work commenced. Materials deployed for permanent fix.'
    });
  }
  
  if (statusIndex >= 2) {
    events.push({
      date: new Date(baseDate.getTime() + (pothole.daysOpen - 1) * 24 * 60 * 60 * 1000),
      status: 'repaired',
      description: 'Physical repair completed. Entering 30-day monitoring period for quality verification.'
    });
  }
  
  if (statusIndex >= 3) {
    events.push({
      date: new Date(baseDate.getTime() + pothole.daysOpen * 24 * 60 * 60 * 1000),
      status: 'closed',
      description: 'Quality verified. Case closed. Road surface restored to standard condition.'
    });
  }
  
  return events;
}

// Generate alerts based on analysis
export function generateAlerts(pothole: Pothole, contractorScore: ContractorScore): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  
  if (pothole.slaStatus === 'breached') {
    alerts.push({
      id: `alert-sla-${pothole.id}`,
      type: 'delay',
      severity: 'critical',
      title: 'SLA Breach Detected',
      description: `Pothole ${pothole.id} has exceeded the ${pothole.expectedSLA}-day SLA. Immediate action required.`,
      potholeId: pothole.id,
      contractor: pothole.contractor,
      timestamp: now
    });
  } else if (pothole.slaStatus === 'at_risk') {
    alerts.push({
      id: `alert-risk-${pothole.id}`,
      type: 'delay',
      severity: 'high',
      title: 'SLA At Risk',
      description: `Only ${pothole.expectedSLA - pothole.daysOpen} days remaining before SLA breach.`,
      potholeId: pothole.id,
      contractor: pothole.contractor,
      timestamp: now
    });
  }
  
  if (contractorScore.score < 60) {
    alerts.push({
      id: `alert-perf-${pothole.contractor}`,
      type: 'performance',
      severity: 'high',
      title: 'Underperforming Contractor',
      description: `${pothole.contractor} has a performance score of ${contractorScore.score}/100. Review recommended.`,
      contractor: pothole.contractor,
      timestamp: now
    });
  }
  
  if (pothole.previousRepairs && pothole.daysSinceLastRepair && pothole.daysSinceLastRepair < 90) {
    alerts.push({
      id: `alert-quality-${pothole.id}`,
      type: 'quality',
      severity: 'high',
      title: 'Repeat Failure Detected',
      description: `This pothole failed only ${pothole.daysSinceLastRepair} days after previous repair. Quality investigation required.`,
      potholeId: pothole.id,
      contractor: pothole.contractor,
      timestamp: now
    });
  }
  
  return alerts;
}

// Main analysis function
export function analyzeWithROADGUARDIAN(
  formData: {
    potholeId: string;
    location: string;
    dateReported: string;
    contractor: string;
    expectedSLA: number;
    status: PotholeStatus;
    previousRepairs: boolean;
    daysSinceLastRepair?: number;
  },
  existingPotholes: Pothole[] = []
): {
  pothole: Pothole;
  agentAnalyses: AgentAnalysis[];
  timeline: TimelineEvent[];
  alerts: Alert[];
  contractorScore: ContractorScore;
} {
  // Calculate days open
  const reportDate = new Date(formData.dateReported);
  const today = new Date();
  const daysOpen = Math.max(1, Math.floor((today.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Generate ID if new
  const potholeId = formData.potholeId.toLowerCase() === 'new' || !formData.potholeId
    ? `PH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    : formData.potholeId;
  
  // Build pothole object
  const pothole: Pothole = {
    id: potholeId,
    location: formData.location,
    dateReported: reportDate,
    contractor: formData.contractor,
    expectedSLA: formData.expectedSLA,
    status: formData.status,
    previousRepairs: formData.previousRepairs,
    daysSinceLastRepair: formData.daysSinceLastRepair,
    daysOpen,
    slaStatus: calculateSLAStatus(daysOpen, formData.expectedSLA)
  };
  
  // Generate contractor score (simulated based on contractor name for demo)
  const contractorScores: Record<string, ContractorScore> = {
    'RoadWorks Pro Inc.': { name: 'RoadWorks Pro Inc.', score: 87, avgResponseTime: 18, avgCompletionTime: 4, repeatOccurrence: 5, totalAssigned: 145, completed: 138 },
    'City Maintenance Corp': { name: 'City Maintenance Corp', score: 72, avgResponseTime: 36, avgCompletionTime: 6, repeatOccurrence: 12, totalAssigned: 89, completed: 76 },
    'QuickFix Contractors': { name: 'QuickFix Contractors', score: 54, avgResponseTime: 48, avgCompletionTime: 8, repeatOccurrence: 22, totalAssigned: 67, completed: 45 },
    'Metro Roads Ltd.': { name: 'Metro Roads Ltd.', score: 91, avgResponseTime: 12, avgCompletionTime: 3, repeatOccurrence: 3, totalAssigned: 203, completed: 198 },
    'Urban Infrastructure Co.': { name: 'Urban Infrastructure Co.', score: 68, avgResponseTime: 42, avgCompletionTime: 7, repeatOccurrence: 15, totalAssigned: 112, completed: 89 },
  };
  
  const contractorScore = contractorScores[formData.contractor] || {
    name: formData.contractor,
    score: 70,
    avgResponseTime: 24,
    avgCompletionTime: 5,
    repeatOccurrence: 10,
    totalAssigned: 50,
    completed: 40
  };
  
  // Run all agents
  const agentAnalyses: AgentAnalysis[] = [
    runDetectionAgent(pothole, existingPotholes),
    runTrackingAgent(pothole),
    runContractorAgent(pothole, contractorScore),
    runQualityAgent(pothole),
    runTransparencyAgent(pothole),
    runAlertAgent(pothole, contractorScore)
  ];
  
  // Generate timeline and alerts
  const timeline = generateTimeline(pothole);
  const alerts = generateAlerts(pothole, contractorScore);
  
  return {
    pothole,
    agentAnalyses,
    timeline,
    alerts,
    contractorScore
  };
}
