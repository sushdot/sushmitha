import { 
  Pothole, 
  Supplier,
  ContractorScore,
  SupplierScore, 
  AgentAnalysis, 
  TimelineEvent, 
  Alert,
  PotholeStatus,
  SupplierStatus,
  SLAStatus,
  ProjectType
} from '@/types/bharatGuardian';

// =====================================================
// ROAD-GUARDIAN ENGINE (Urban Infrastructure)
// =====================================================

function calculateSLAStatus(daysOpen: number, expectedSLA: number): SLAStatus {
  const ratio = daysOpen / expectedSLA;
  if (ratio < 0.7) return 'on_track';
  if (ratio < 1) return 'at_risk';
  return 'breached';
}

// Detection Agent
function runRoadDetectionAgent(pothole: Pothole, existingPotholes: Pothole[]): AgentAnalysis {
  const isDuplicate = existingPotholes.some(
    p => p.location.toLowerCase() === pothole.location.toLowerCase() && 
         p.city === pothole.city && 
         p.id !== pothole.id
  );
  
  if (isDuplicate) {
    return {
      agent: 'National Data Ingestion Agent',
      icon: 'eye',
      color: 'agent-detection',
      analysis: `DUPLICATE DETECTED: Pothole at "${pothole.location}", ${pothole.city}, ${pothole.state} already exists. Merging with existing municipal record.`,
      status: 'warning',
      project: 'road_guardian'
    };
  }
  
  const monsoonNote = pothole.monsoonImpact ? ' Monsoon season active - expedited SLA recommended.' : '';
  
  return {
    agent: 'National Data Ingestion Agent',
    icon: 'eye',
    color: 'agent-detection',
    analysis: `NEW POTHOLE REGISTERED: ID ${pothole.id} at ${pothole.location}, ${pothole.city}, ${pothole.state}. Logged in National Road Infrastructure Database.${monsoonNote}`,
    status: 'info',
    project: 'road_guardian'
  };
}

// Lifecycle Tracking Agent
function runRoadTrackingAgent(pothole: Pothole): AgentAnalysis {
  const statusMessages: Record<PotholeStatus, string> = {
    reported: `Pothole logged in ${pothole.city} Municipal Corporation system. Awaiting ULB contractor assignment (24-48 hours).`,
    assigned: `${pothole.contractor} assigned by ${pothole.city} Municipal Corporation. Work order generated per IRC guidelines.`,
    in_progress: 'Repair work actively underway. Contractor on-site per PWD standards. Materials deployed.',
    repaired: 'Physical repair completed. Entering 30-day IRC quality monitoring period.',
    closed: 'Repair verified and case closed. Road surface restored to BIS standards.'
  };
  
  const slaMessages: Record<SLAStatus, { msg: string; status: AgentAnalysis['status'] }> = {
    on_track: { msg: 'Timeline within State ULB SLA bounds.', status: 'success' },
    at_risk: { msg: 'WARNING: Approaching municipal SLA deadline. Escalation to Commissioner may be triggered.', status: 'warning' },
    breached: { msg: 'CRITICAL: SLA breached. Automatic escalation to District Collector initiated.', status: 'danger' }
  };
  
  const slaInfo = slaMessages[pothole.slaStatus];
  
  return {
    agent: 'Lifecycle Tracking Agent',
    icon: 'git-branch',
    color: 'agent-tracking',
    analysis: `${statusMessages[pothole.status]} ${slaInfo.msg} Days open: ${pothole.daysOpen}/${pothole.expectedSLA}.`,
    status: slaInfo.status,
    project: 'road_guardian'
  };
}

// Contractor Performance Agent
function runRoadContractorAgent(pothole: Pothole, contractorScore: ContractorScore): AgentAnalysis {
  let analysis = '';
  let status: AgentAnalysis['status'] = 'info';
  
  if (contractorScore.score >= 80) {
    analysis = `${pothole.contractor} demonstrates EXCELLENT performance (Score: ${contractorScore.score}/100). Meets NHAI quality standards. Avg response: ${contractorScore.avgResponseTime}h. Eligible for tender preference.`;
    status = 'success';
  } else if (contractorScore.score >= 60) {
    analysis = `${pothole.contractor} shows MODERATE performance (Score: ${contractorScore.score}/100). Some delays noted. Repeat issue rate: ${contractorScore.repeatOccurrence}%. Under enhanced PWD monitoring.`;
    status = 'warning';
  } else {
    analysis = `ALERT: ${pothole.contractor} has POOR performance (Score: ${contractorScore.score}/100). High repeat occurrence (${contractorScore.repeatOccurrence}%). Recommend blacklisting review per GFR 2017 guidelines.`;
    status = 'danger';
  }
  
  return {
    agent: 'Accountability & Scoring Agent',
    icon: 'user-check',
    color: 'agent-contractor',
    analysis,
    status,
    project: 'road_guardian'
  };
}

// Quality Agent
function runRoadQualityAgent(pothole: Pothole): AgentAnalysis {
  if (pothole.previousRepairs) {
    const isFrequent = pothole.daysSinceLastRepair && pothole.daysSinceLastRepair < 90;
    
    if (isFrequent) {
      return {
        agent: 'Validation & Anomaly Detection Agent',
        icon: 'shield',
        color: 'agent-quality',
        analysis: `HIGH RECURRENCE RISK: This pothole at ${pothole.location}, ${pothole.city} failed ${pothole.daysSinceLastRepair} days after previous repair. Indicates potential substandard materials or underlying drainage issues. IRC Section 500 investigation recommended.`,
        status: 'danger',
        project: 'road_guardian'
      };
    }
    
    return {
      agent: 'Validation & Anomaly Detection Agent',
      icon: 'shield',
      color: 'agent-quality',
      analysis: `REPEAT REPAIR: Previous repair was ${pothole.daysSinceLastRepair} days ago. Within acceptable IRC durability range but flagged for quality monitoring.`,
      status: 'warning',
      project: 'road_guardian'
    };
  }
  
  return {
    agent: 'Validation & Anomaly Detection Agent',
    icon: 'shield',
    color: 'agent-quality',
    analysis: 'First-time report. No prior repair history. Standard IRC quality protocols apply. Expected durability: 2-5 years based on traffic classification.',
    status: 'success',
    project: 'road_guardian'
  };
}

// Transparency Agent
function runRoadTransparencyAgent(pothole: Pothole): AgentAnalysis {
  const hindiStatus: Record<PotholeStatus, string> = {
    reported: 'दर्ज (Registered)',
    assigned: 'ठेकेदार नियुक्त (Contractor Assigned)',
    in_progress: 'मरम्मत जारी (Repair Ongoing)',
    repaired: 'मरम्मत पूर्ण (Repair Complete)',
    closed: 'समाप्त (Closed)'
  };
  
  const progressMessages: Record<PotholeStatus, string> = {
    reported: 'Your complaint has been received. A contractor will be assigned within 48 hours. Track status on CPGRAMS.',
    assigned: `${pothole.contractor} has been assigned. Work will begin soon. You will receive SMS updates.`,
    in_progress: 'Repair work is happening now. Thank you for your patience. You can verify progress on-site.',
    repaired: 'Great news! The repair is complete. We request you to verify the quality. Report if issues persist.',
    closed: 'This issue has been fully resolved. Thank you for being an active citizen of ${pothole.city}!'
  };
  
  return {
    agent: 'Transparency & Citizen Explanation Agent',
    icon: 'clock',
    color: 'agent-transparency',
    analysis: `नागरिक अपडेट (Citizen Update): Status - ${hindiStatus[pothole.status]}. ${progressMessages[pothole.status]} Location: ${pothole.location}, ${pothole.city}.`,
    status: 'info',
    project: 'road_guardian'
  };
}

// Alert Agent
function runRoadAlertAgent(pothole: Pothole, contractorScore: ContractorScore): AgentAnalysis {
  const issues: string[] = [];
  let status: AgentAnalysis['status'] = 'success';
  
  if (pothole.slaStatus === 'breached') {
    issues.push(`SLA BREACH - Escalation to ${pothole.city} Municipal Commissioner & District Collector`);
    status = 'danger';
  } else if (pothole.slaStatus === 'at_risk') {
    issues.push('SLA at risk - Automated reminder sent to contractor and ULB');
    status = 'warning';
  }
  
  if (contractorScore.score < 60) {
    issues.push(`Underperforming contractor flagged (Score: ${contractorScore.score}) - Review under GFR 2017`);
    status = status === 'danger' ? 'danger' : 'warning';
  }
  
  if (pothole.previousRepairs && pothole.daysSinceLastRepair && pothole.daysSinceLastRepair < 90) {
    issues.push('Quality concern - Repeat failure within 90 days per IRC guidelines');
    status = 'danger';
  }
  
  if (pothole.monsoonImpact) {
    issues.push('Monsoon period active - Enhanced monitoring and expedited repair required');
  }
  
  if (issues.length === 0) {
    return {
      agent: 'Alert & Early Warning Agent',
      icon: 'alert-triangle',
      color: 'agent-alert',
      analysis: 'All accountability metrics within acceptable parameters. Standard monitoring continues. No escalation required.',
      status: 'success',
      project: 'road_guardian'
    };
  }
  
  return {
    agent: 'Alert & Early Warning Agent',
    icon: 'alert-triangle',
    color: 'agent-alert',
    analysis: `ACCOUNTABILITY ALERTS: ${issues.join('. ')}. Notifications sent to relevant authorities via CPGRAMS.`,
    status,
    project: 'road_guardian'
  };
}

// Generate road timeline
export function generateRoadTimeline(pothole: Pothole): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const baseDate = new Date(pothole.dateReported || new Date());
  
  events.push({
    date: baseDate,
    status: 'reported',
    description: `Pothole reported by citizen at ${pothole.location}, ${pothole.city}, ${pothole.state}. Logged in National Infrastructure Database.`,
    project: 'road_guardian'
  });
  
  const statusOrder: PotholeStatus[] = ['assigned', 'in_progress', 'repaired', 'closed'];
  const statusIndex = statusOrder.indexOf(pothole.status);
  
  if (statusIndex >= 0) {
    events.push({
      date: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      status: 'assigned',
      description: `${pothole.contractor} assigned by ${pothole.city} Municipal Corporation. Work Order generated.`
    } as TimelineEvent);
  }
  
  if (statusIndex >= 1) {
    events.push({
      date: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
      description: 'Contractor on-site. Repair work commenced per IRC/MoRTH specifications.'
    } as TimelineEvent);
  }
  
  if (statusIndex >= 2) {
    events.push({
      date: new Date(baseDate.getTime() + (pothole.daysOpen - 1) * 24 * 60 * 60 * 1000),
      status: 'repaired',
      description: 'Physical repair completed. 30-day quality monitoring period initiated.'
    } as TimelineEvent);
  }
  
  if (statusIndex >= 3) {
    events.push({
      date: new Date(baseDate.getTime() + pothole.daysOpen * 24 * 60 * 60 * 1000),
      status: 'closed',
      description: 'Quality verified. Case closed. Road restored to BIS/IRC standards.'
    } as TimelineEvent);
  }
  
  return events;
}

// Generate road alerts
export function generateRoadAlerts(pothole: Pothole, contractorScore: ContractorScore): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  
  if (pothole.slaStatus === 'breached') {
    alerts.push({
      id: `alert-sla-${pothole.id}`,
      type: 'delay',
      severity: 'critical',
      title: 'SLA Breach - Municipal Escalation',
      description: `Pothole ${pothole.id} at ${pothole.location}, ${pothole.city} has exceeded the ${pothole.expectedSLA}-day ULB SLA. Escalation to District Collector initiated.`,
      entityId: pothole.id,
      contractor: pothole.contractor,
      city: pothole.city,
      state: pothole.state,
      timestamp: now,
      project: 'road_guardian'
    });
  }
  
  if (contractorScore.score < 60) {
    alerts.push({
      id: `alert-perf-${pothole.contractor}`,
      type: 'performance',
      severity: 'high',
      title: 'Contractor Review Required',
      description: `${pothole.contractor} has score ${contractorScore.score}/100. Review under GFR 2017 blacklisting guidelines recommended.`,
      contractor: pothole.contractor,
      timestamp: now,
      project: 'road_guardian'
    });
  }
  
  if (pothole.previousRepairs && pothole.daysSinceLastRepair && pothole.daysSinceLastRepair < 90) {
    alerts.push({
      id: `alert-quality-${pothole.id}`,
      type: 'quality',
      severity: 'high',
      title: 'Repeat Failure - Quality Investigation',
      description: `Pothole at ${pothole.location} failed ${pothole.daysSinceLastRepair} days after repair. IRC Section 500 quality investigation required.`,
      entityId: pothole.id,
      contractor: pothole.contractor,
      city: pothole.city,
      state: pothole.state,
      timestamp: now,
      project: 'road_guardian'
    });
  }
  
  return alerts;
}

// =====================================================
// PHANTOM-X ENGINE (Supply Chain)
// =====================================================

function calculatePhantomStock(reported: number, actual?: number): number {
  if (actual === undefined || actual >= reported) return 0;
  return ((reported - actual) / reported) * 100;
}

function calculateDisruptionRisk(supplier: Supplier): 'low' | 'medium' | 'high' | 'critical' {
  let riskScore = 0;
  
  if (supplier.phantomStockPercentage > 30) riskScore += 3;
  else if (supplier.phantomStockPercentage > 15) riskScore += 2;
  else if (supplier.phantomStockPercentage > 5) riskScore += 1;
  
  if (supplier.currentUtilization > 95) riskScore += 2;
  else if (supplier.currentUtilization > 85) riskScore += 1;
  
  if (supplier.leadTimeDays > 14) riskScore += 2;
  else if (supplier.leadTimeDays > 7) riskScore += 1;
  
  if (supplier.status === 'disrupted') riskScore += 3;
  else if (supplier.status === 'at_risk') riskScore += 2;
  
  if (supplier.tier === 'tier_1') riskScore += 1; // Higher impact for Tier 1
  
  if (riskScore >= 7) return 'critical';
  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}

// Data Ingestion Agent
function runPhantomIngestionAgent(supplier: Supplier, existingSuppliers: Supplier[]): AgentAnalysis {
  const isDuplicate = existingSuppliers.some(
    s => s.name === supplier.name && s.city === supplier.city && s.id !== supplier.id
  );
  
  if (isDuplicate) {
    return {
      agent: 'National Data Ingestion Agent',
      icon: 'database',
      color: 'agent-detection',
      analysis: `DUPLICATE: Supplier "${supplier.name}" at ${supplier.city}, ${supplier.state} already tracked. Merging with existing record.`,
      status: 'warning',
      project: 'phantom_x'
    };
  }
  
  return {
    agent: 'National Data Ingestion Agent',
    icon: 'database',
    color: 'agent-detection',
    analysis: `SUPPLIER REGISTERED: ${supplier.name} (${supplier.tier.replace('_', ' ').toUpperCase()}) at ${supplier.city}, ${supplier.state}. Added to Make-in-India Supply Chain Database.`,
    status: 'info',
    project: 'phantom_x'
  };
}

// Lifecycle Tracking Agent for Supply Chain
function runPhantomTrackingAgent(supplier: Supplier): AgentAnalysis {
  const statusMessages: Record<SupplierStatus, string> = {
    active: `Supplier ${supplier.name} operating normally. Utilization: ${supplier.currentUtilization}%. Lead time: ${supplier.leadTimeDays} days.`,
    at_risk: `WARNING: ${supplier.name} showing risk indicators. Utilization: ${supplier.currentUtilization}%. Monitoring intensified.`,
    disrupted: `CRITICAL: ${supplier.name} operations disrupted. Supply chain continuity at risk. Alternate sourcing recommended.`,
    resolved: `${supplier.name} disruption resolved. Operations returning to normal. Monitoring continues.`,
    blacklisted: `${supplier.name} has been blacklisted due to repeated violations. Removed from approved supplier list.`
  };
  
  const statusLevel: Record<SupplierStatus, AgentAnalysis['status']> = {
    active: 'success',
    at_risk: 'warning',
    disrupted: 'danger',
    resolved: 'info',
    blacklisted: 'danger'
  };
  
  return {
    agent: 'Lifecycle Tracking Agent',
    icon: 'git-branch',
    color: 'agent-tracking',
    analysis: statusMessages[supplier.status],
    status: statusLevel[supplier.status],
    project: 'phantom_x'
  };
}

// Prediction Agent
function runPhantomPredictionAgent(supplier: Supplier): AgentAnalysis {
  const risk = supplier.disruptionRisk;
  
  const predictions: Record<string, { msg: string; status: AgentAnalysis['status'] }> = {
    low: {
      msg: `Low disruption probability for ${supplier.name}. Supply chain stable. No preventive action needed.`,
      status: 'success'
    },
    medium: {
      msg: `Medium risk detected for ${supplier.name}. Regional factors (monsoon/transport) may cause 5-10 day delays. Buffer stock recommended.`,
      status: 'warning'
    },
    high: {
      msg: `HIGH RISK: ${supplier.name} likely to face disruption within 7-14 days. Utilization ${supplier.currentUtilization}% indicates capacity strain. Initiate alternate sourcing.`,
      status: 'warning'
    },
    critical: {
      msg: `CRITICAL PREDICTION: ${supplier.name} disruption imminent. Phantom stock ${supplier.phantomStockPercentage.toFixed(1)}%. Immediate action required to prevent production line impact.`,
      status: 'danger'
    }
  };
  
  return {
    agent: 'Prediction & Forecasting Agent',
    icon: 'trending-up',
    color: 'agent-quality',
    analysis: predictions[risk].msg,
    status: predictions[risk].status,
    project: 'phantom_x'
  };
}

// Validation Agent
function runPhantomValidationAgent(supplier: Supplier): AgentAnalysis {
  if (supplier.phantomStockPercentage > 20) {
    return {
      agent: 'Validation & Anomaly Detection Agent',
      icon: 'alert-octagon',
      color: 'agent-alert',
      analysis: `PHANTOM STOCK DETECTED: ${supplier.name} reports ${supplier.reportedStock.toLocaleString()} units but actual stock is ${supplier.actualStock?.toLocaleString() || 'unknown'} (${supplier.phantomStockPercentage.toFixed(1)}% discrepancy). Likely causes: Data entry errors, inventory theft, or deliberate misreporting.`,
      status: 'danger',
      project: 'phantom_x'
    };
  }
  
  if (supplier.phantomStockPercentage > 10) {
    return {
      agent: 'Validation & Anomaly Detection Agent',
      icon: 'alert-octagon',
      color: 'agent-alert',
      analysis: `MODERATE DISCREPANCY: ${supplier.name} stock variance of ${supplier.phantomStockPercentage.toFixed(1)}%. Within tolerance but requires audit within 30 days.`,
      status: 'warning',
      project: 'phantom_x'
    };
  }
  
  return {
    agent: 'Validation & Anomaly Detection Agent',
    icon: 'check-circle',
    color: 'agent-contractor',
    analysis: `VERIFIED: ${supplier.name} stock levels validated. Reported vs actual within acceptable variance (${supplier.phantomStockPercentage.toFixed(1)}%). No anomalies detected.`,
    status: 'success',
    project: 'phantom_x'
  };
}

// Supplier Scoring Agent
function runPhantomScoringAgent(supplier: Supplier, supplierScore: SupplierScore): AgentAnalysis {
  let analysis = '';
  let status: AgentAnalysis['status'] = 'info';
  
  if (supplierScore.score >= 80) {
    analysis = `${supplier.name} rated EXCELLENT (${supplierScore.score}/100). Stock accuracy: ${supplierScore.accuracyRate}%. On-time delivery: ${supplierScore.deliveryOnTime}%. Recommended for Make-in-India priority contracts.`;
    status = 'success';
  } else if (supplierScore.score >= 60) {
    analysis = `${supplier.name} rated MODERATE (${supplierScore.score}/100). ${supplierScore.phantomStockIncidents} phantom stock incidents recorded. Enhanced monitoring active.`;
    status = 'warning';
  } else {
    analysis = `ALERT: ${supplier.name} rated POOR (${supplierScore.score}/100). ${supplierScore.phantomStockIncidents} phantom incidents. Consider removal from approved vendor list per MSME guidelines.`;
    status = 'danger';
  }
  
  return {
    agent: 'Accountability & Scoring Agent',
    icon: 'award',
    color: 'agent-contractor',
    analysis,
    status,
    project: 'phantom_x'
  };
}

// Transparency Agent
function runPhantomTransparencyAgent(supplier: Supplier): AgentAnalysis {
  const industryUpdate = `
Supply Chain Update for ${supplier.name}:
- Location: ${supplier.city}, ${supplier.state}
- Tier: ${supplier.tier.replace('_', ' ').toUpperCase()}
- Current Status: ${supplier.status.replace('_', ' ').toUpperCase()}
- Stock Accuracy: ${(100 - supplier.phantomStockPercentage).toFixed(1)}%
- Lead Time: ${supplier.leadTimeDays} days

${supplier.disruptionRisk === 'critical' || supplier.disruptionRisk === 'high' 
  ? 'ACTION REQUIRED: Discuss alternate sourcing with procurement team.' 
  : 'No immediate action required. Regular monitoring continues.'}
`;
  
  return {
    agent: 'Transparency & Citizen Explanation Agent',
    icon: 'file-text',
    color: 'agent-transparency',
    analysis: industryUpdate.trim(),
    status: 'info',
    project: 'phantom_x'
  };
}

// Alert Agent
function runPhantomAlertAgent(supplier: Supplier, supplierScore: SupplierScore): AgentAnalysis {
  const issues: string[] = [];
  let status: AgentAnalysis['status'] = 'success';
  
  if (supplier.phantomStockPercentage > 20) {
    issues.push(`Critical phantom stock detected (${supplier.phantomStockPercentage.toFixed(1)}%)`);
    status = 'danger';
  }
  
  if (supplier.disruptionRisk === 'critical') {
    issues.push('Disruption imminent - activate contingency suppliers');
    status = 'danger';
  } else if (supplier.disruptionRisk === 'high') {
    issues.push('High disruption risk - buffer stock recommended');
    status = status === 'danger' ? 'danger' : 'warning';
  }
  
  if (supplierScore.score < 60) {
    issues.push(`Underperforming supplier (Score: ${supplierScore.score})`);
    status = status === 'danger' ? 'danger' : 'warning';
  }
  
  if (supplier.currentUtilization > 95) {
    issues.push('Capacity constraint - supplier at 95%+ utilization');
  }
  
  if (issues.length === 0) {
    return {
      agent: 'Alert & Early Warning Agent',
      icon: 'bell',
      color: 'success',
      analysis: 'All supply chain metrics within acceptable parameters. Make-in-India resilience maintained.',
      status: 'success',
      project: 'phantom_x'
    };
  }
  
  return {
    agent: 'Alert & Early Warning Agent',
    icon: 'alert-triangle',
    color: 'agent-alert',
    analysis: `SUPPLY CHAIN ALERTS: ${issues.join('. ')}. Procurement and operations teams notified.`,
    status,
    project: 'phantom_x'
  };
}

// Generate supply chain timeline
export function generateSupplyTimeline(supplier: Supplier): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const baseDate = new Date(supplier.lastAuditDate);
  
  events.push({
    date: baseDate,
    status: 'audit_completed',
    description: `Last audit completed for ${supplier.name}. Stock levels verified at ${supplier.city} facility.`,
    project: 'phantom_x'
  });
  
  if (supplier.phantomStockPercentage > 10) {
    events.push({
      date: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      status: 'discrepancy_detected',
      description: `Stock discrepancy of ${supplier.phantomStockPercentage.toFixed(1)}% detected. Investigation initiated.`,
      project: 'phantom_x'
    });
  }
  
  if (supplier.status === 'at_risk' || supplier.status === 'disrupted') {
    events.push({
      date: new Date(),
      status: supplier.status,
      description: `Supplier status changed to ${supplier.status.replace('_', ' ')}. Enhanced monitoring activated.`,
      project: 'phantom_x'
    });
  }
  
  return events;
}

// Generate supply alerts
export function generateSupplyAlerts(supplier: Supplier, supplierScore: SupplierScore): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  
  if (supplier.phantomStockPercentage > 20) {
    alerts.push({
      id: `alert-phantom-${supplier.id}`,
      type: 'phantom_stock',
      severity: 'critical',
      title: 'Critical Phantom Stock Detected',
      description: `${supplier.name} at ${supplier.city} showing ${supplier.phantomStockPercentage.toFixed(1)}% stock discrepancy. Immediate audit required.`,
      entityId: supplier.id,
      supplier: supplier.name,
      city: supplier.city,
      state: supplier.state,
      timestamp: now,
      project: 'phantom_x'
    });
  }
  
  if (supplier.disruptionRisk === 'critical') {
    alerts.push({
      id: `alert-disruption-${supplier.id}`,
      type: 'disruption',
      severity: 'critical',
      title: 'Supply Disruption Imminent',
      description: `${supplier.name} predicted to face disruption. Activate contingency suppliers for ${supplier.tier.replace('_', ' ')} components.`,
      entityId: supplier.id,
      supplier: supplier.name,
      city: supplier.city,
      state: supplier.state,
      timestamp: now,
      project: 'phantom_x'
    });
  }
  
  if (supplier.currentUtilization > 95) {
    alerts.push({
      id: `alert-capacity-${supplier.id}`,
      type: 'capacity',
      severity: 'high',
      title: 'Supplier Capacity Critical',
      description: `${supplier.name} operating at ${supplier.currentUtilization}% capacity. Risk of delayed deliveries.`,
      entityId: supplier.id,
      supplier: supplier.name,
      timestamp: now,
      project: 'phantom_x'
    });
  }
  
  return alerts;
}

// =====================================================
// MAIN ANALYSIS FUNCTIONS
// =====================================================

// Road Guardian Analysis
export function analyzeWithRoadGuardian(
  formData: {
    potholeId: string;
    location: string;
    city: string;
    state: string;
    dateReported: string;
    contractor: string;
    expectedSLA: number;
    status: PotholeStatus;
    previousRepairs: boolean;
    daysSinceLastRepair?: number;
    monsoonImpact?: boolean;
  },
  existingPotholes: Pothole[] = []
): {
  pothole: Pothole;
  agentAnalyses: AgentAnalysis[];
  timeline: TimelineEvent[];
  alerts: Alert[];
  contractorScore: ContractorScore;
} {
  const reportDate = new Date(formData.dateReported);
  const today = new Date();
  const daysOpen = Math.max(1, Math.floor((today.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  const potholeId = formData.potholeId.toLowerCase() === 'new' || !formData.potholeId
    ? `PH-${formData.state.slice(0, 2).toUpperCase()}-${formData.city.slice(0, 3).toUpperCase()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
    : formData.potholeId;
  
  const pothole: Pothole = {
    id: potholeId,
    location: formData.location,
    city: formData.city,
    state: formData.state,
    dateReported: reportDate,
    contractor: formData.contractor,
    expectedSLA: formData.expectedSLA,
    status: formData.status,
    previousRepairs: formData.previousRepairs,
    daysSinceLastRepair: formData.daysSinceLastRepair,
    daysOpen,
    slaStatus: calculateSLAStatus(daysOpen, formData.expectedSLA),
    monsoonImpact: formData.monsoonImpact
  };
  
  const contractorScores: Record<string, ContractorScore> = {
    'Larsen & Toubro Infrastructure': { name: 'Larsen & Toubro Infrastructure', score: 92, avgResponseTime: 8, avgCompletionTime: 3, repeatOccurrence: 2, totalAssigned: 450, completed: 442 },
    'NHAI Road Works Division': { name: 'NHAI Road Works Division', score: 85, avgResponseTime: 16, avgCompletionTime: 4, repeatOccurrence: 6, totalAssigned: 380, completed: 355 },
    'Ashoka Buildcon Ltd.': { name: 'Ashoka Buildcon Ltd.', score: 78, avgResponseTime: 24, avgCompletionTime: 5, repeatOccurrence: 9, totalAssigned: 220, completed: 198 },
    'IRB Infrastructure': { name: 'IRB Infrastructure', score: 88, avgResponseTime: 12, avgCompletionTime: 4, repeatOccurrence: 5, totalAssigned: 310, completed: 295 },
    'Dilip Buildcon Ltd.': { name: 'Dilip Buildcon Ltd.', score: 72, avgResponseTime: 36, avgCompletionTime: 6, repeatOccurrence: 12, totalAssigned: 180, completed: 152 },
    'Gayatri Projects Ltd.': { name: 'Gayatri Projects Ltd.', score: 65, avgResponseTime: 48, avgCompletionTime: 7, repeatOccurrence: 18, totalAssigned: 140, completed: 108 },
    'Municipal Corporation Works': { name: 'Municipal Corporation Works', score: 58, avgResponseTime: 72, avgCompletionTime: 9, repeatOccurrence: 25, totalAssigned: 520, completed: 385 },
    'PWD Road Division': { name: 'PWD Road Division', score: 62, avgResponseTime: 60, avgCompletionTime: 8, repeatOccurrence: 20, totalAssigned: 680, completed: 510 }
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
  
  const agentAnalyses: AgentAnalysis[] = [
    runRoadDetectionAgent(pothole, existingPotholes),
    runRoadTrackingAgent(pothole),
    runRoadContractorAgent(pothole, contractorScore),
    runRoadQualityAgent(pothole),
    runRoadTransparencyAgent(pothole),
    runRoadAlertAgent(pothole, contractorScore)
  ];
  
  const timeline = generateRoadTimeline(pothole);
  const alerts = generateRoadAlerts(pothole, contractorScore);
  
  return { pothole, agentAnalyses, timeline, alerts, contractorScore };
}

// Phantom-X Analysis
export function analyzeWithPhantomX(
  formData: {
    supplierId: string;
    supplierName: string;
    tier: 'tier_1' | 'tier_2' | 'tier_3';
    state: string;
    city: string;
    reportedStock: number;
    actualStock?: number;
    productionCapacity: number;
    currentUtilization: number;
    leadTimeDays: number;
    status: SupplierStatus;
    lastAuditDate: string;
  },
  existingSuppliers: Supplier[] = []
): {
  supplier: Supplier;
  agentAnalyses: AgentAnalysis[];
  timeline: TimelineEvent[];
  alerts: Alert[];
  supplierScore: SupplierScore;
} {
  const supplierId = formData.supplierId.toLowerCase() === 'new' || !formData.supplierId
    ? `SUP-${formData.state.slice(0, 2).toUpperCase()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
    : formData.supplierId;
  
  const phantomStockPercentage = calculatePhantomStock(formData.reportedStock, formData.actualStock);
  
  const baseSupplier: Supplier = {
    id: supplierId,
    name: formData.supplierName,
    tier: formData.tier,
    city: formData.city,
    state: formData.state,
    reportedStock: formData.reportedStock,
    actualStock: formData.actualStock,
    phantomStockPercentage,
    productionCapacity: formData.productionCapacity,
    currentUtilization: formData.currentUtilization,
    leadTimeDays: formData.leadTimeDays,
    status: formData.status,
    lastAuditDate: new Date(formData.lastAuditDate),
    disruptionRisk: 'low',
    regionalFactors: []
  };
  
  baseSupplier.disruptionRisk = calculateDisruptionRisk(baseSupplier);
  
  const supplier = baseSupplier;
  
  // Generate supplier score
  let baseScore = 80;
  if (phantomStockPercentage > 20) baseScore -= 25;
  else if (phantomStockPercentage > 10) baseScore -= 15;
  else if (phantomStockPercentage > 5) baseScore -= 5;
  
  if (formData.status === 'disrupted') baseScore -= 20;
  else if (formData.status === 'at_risk') baseScore -= 10;
  
  if (formData.currentUtilization > 95) baseScore -= 5;
  
  const supplierScore: SupplierScore = {
    name: formData.supplierName,
    score: Math.max(0, Math.min(100, baseScore)),
    accuracyRate: Math.round(100 - phantomStockPercentage),
    deliveryOnTime: Math.round(85 - (formData.leadTimeDays > 7 ? 10 : 0)),
    phantomStockIncidents: phantomStockPercentage > 10 ? Math.ceil(phantomStockPercentage / 5) : 0,
    totalOrders: Math.floor(Math.random() * 500) + 100,
    fulfilledOrders: Math.floor((Math.random() * 0.2 + 0.75) * (Math.floor(Math.random() * 500) + 100))
  };
  
  const agentAnalyses: AgentAnalysis[] = [
    runPhantomIngestionAgent(supplier, existingSuppliers),
    runPhantomTrackingAgent(supplier),
    runPhantomPredictionAgent(supplier),
    runPhantomValidationAgent(supplier),
    runPhantomScoringAgent(supplier, supplierScore),
    runPhantomTransparencyAgent(supplier),
    runPhantomAlertAgent(supplier, supplierScore)
  ];
  
  const timeline = generateSupplyTimeline(supplier);
  const alerts = generateSupplyAlerts(supplier, supplierScore);
  
  return { supplier, agentAnalyses, timeline, alerts, supplierScore };
}
