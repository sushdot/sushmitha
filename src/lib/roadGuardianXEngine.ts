// ROAD-GUARDIAN X: Advanced AI Engine
// Digital Identity, Durability Prediction, Blacklist Analysis, Citizen Trust Index, AI Verdict
// EXTENDED INTELLIGENCE MODE: Age Debt, Accident Probability, Behavioral Patterns, Repair Methods

import { Pothole, ContractorScore, AgentAnalysis } from '@/types/bharatGuardian';
import {
  DurabilityPrediction,
  BlacklistAssessment,
  CitizenTrustIndex,
  DuplicateAnalysis,
  CriticalityScore,
  SLAOptimization,
  FinancialLeakage,
  AIVerdict,
  AdvancedPotholeAnalysis,
  ExtendedIntelligence
} from '@/types/roadGuardianX';

// ==============================================
// DIGITAL IDENTITY AGENT
// ==============================================
export function createDigitalIdentity(pothole: Pothole): AdvancedPotholeAnalysis['digitalIdentity'] {
  // Determine road type based on location keywords
  let roadType: 'national_highway' | 'state_highway' | 'city_road' | 'colony_road' = 'city_road';
  const location = pothole.location.toLowerCase();
  
  if (location.includes('nh-') || location.includes('national highway') || location.includes('express')) {
    roadType = 'national_highway';
  } else if (location.includes('sh-') || location.includes('state highway')) {
    roadType = 'state_highway';
  } else if (location.includes('colony') || location.includes('society') || location.includes('lane')) {
    roadType = 'colony_road';
  }

  // Determine severity based on days open and SLA status
  let severity: 'minor' | 'moderate' | 'severe' | 'critical' = 'moderate';
  if (pothole.slaStatus === 'breached' && pothole.daysOpen > 14) {
    severity = 'critical';
  } else if (pothole.slaStatus === 'breached' || pothole.daysOpen > 10) {
    severity = 'severe';
  } else if (pothole.daysOpen > 5) {
    severity = 'moderate';
  } else {
    severity = 'minor';
  }

  return {
    birthTimestamp: new Date(pothole.dateReported),
    roadType,
    severity,
    zone: `${pothole.city}-${Math.floor(Math.random() * 10) + 1}` // Zone assignment
  };
}

// ==============================================
// DURABILITY PREDICTION AGENT
// ==============================================
export function predictDurability(pothole: Pothole, contractorScore: ContractorScore): DurabilityPrediction {
  const baseLifespan = 730; // 2 years in days

  // Factor adjustments
  const contractorQuality = contractorScore.score;
  const weatherImpact = pothole.monsoonImpact ? 70 : 30;
  const trafficLoad = determineTrafficLoad(pothole.location);
  const materialQuality = contractorScore.score >= 80 ? 'premium' : contractorScore.score >= 60 ? 'standard' : 'unknown';

  // Calculate expected lifespan
  let lifespanModifier = 1.0;
  
  // Contractor quality impact
  lifespanModifier *= (contractorScore.score / 100);
  
  // Weather impact
  if (pothole.monsoonImpact) lifespanModifier *= 0.7;
  
  // Traffic load impact
  if (trafficLoad === 'high') lifespanModifier *= 0.6;
  else if (trafficLoad === 'medium') lifespanModifier *= 0.8;
  
  // Previous repairs impact
  if (pothole.previousRepairs) {
    lifespanModifier *= 0.5; // Repeat repairs have lower durability
  }

  const expectedLifespanDays = Math.round(baseLifespan * lifespanModifier);
  
  // Determine confidence level
  let confidenceLevel: 'high' | 'medium' | 'low' = 'medium';
  if (contractorScore.totalAssigned > 100 && !pothole.previousRepairs) {
    confidenceLevel = 'high';
  } else if (pothole.previousRepairs || contractorScore.totalAssigned < 50) {
    confidenceLevel = 'low';
  }

  // Generate recommendation
  let recommendation = '';
  if (expectedLifespanDays < 180) {
    recommendation = 'HIGH RISK: Repair may fail within 6 months. Consider premium materials and enhanced supervision.';
  } else if (expectedLifespanDays < 365) {
    recommendation = 'MODERATE RISK: Schedule quality inspection at 6-month mark. Monitor for early signs of failure.';
  } else {
    recommendation = 'STANDARD RISK: Normal monitoring schedule. Quarterly visual inspection recommended.';
  }

  return {
    expectedLifespanDays,
    confidenceLevel,
    factors: {
      contractorQuality,
      weatherImpact,
      trafficLoad,
      materialQuality,
      monsoonRisk: pothole.monsoonImpact || false
    },
    recommendation
  };
}

function determineTrafficLoad(location: string): 'low' | 'medium' | 'high' {
  const highTrafficKeywords = ['highway', 'ring road', 'main road', 'junction', 'crossing', 'express', 'arterial'];
  const lowTrafficKeywords = ['colony', 'lane', 'society', 'residential', 'gali'];
  
  const loc = location.toLowerCase();
  
  if (highTrafficKeywords.some(k => loc.includes(k))) return 'high';
  if (lowTrafficKeywords.some(k => loc.includes(k))) return 'low';
  return 'medium';
}

// ==============================================
// CONTRACTOR BLACKLIST ASSESSMENT AGENT
// ==============================================
export function assessBlacklistProbability(
  pothole: Pothole, 
  contractorScore: ContractorScore,
  historicalData?: { totalRepairs: number; slaBreeches: number; qualityFailures: number }
): BlacklistAssessment {
  let probability = 0;
  const riskFactors: string[] = [];

  // Score-based probability
  if (contractorScore.score < 50) {
    probability += 40;
    riskFactors.push('Performance score below 50%');
  } else if (contractorScore.score < 60) {
    probability += 25;
    riskFactors.push('Performance score in critical range (50-60%)');
  } else if (contractorScore.score < 70) {
    probability += 10;
    riskFactors.push('Performance score below acceptable threshold');
  }

  // Repeat occurrence impact
  if (contractorScore.repeatOccurrence > 20) {
    probability += 30;
    riskFactors.push(`High repeat failure rate: ${contractorScore.repeatOccurrence}%`);
  } else if (contractorScore.repeatOccurrence > 15) {
    probability += 20;
    riskFactors.push(`Elevated repeat failure rate: ${contractorScore.repeatOccurrence}%`);
  } else if (contractorScore.repeatOccurrence > 10) {
    probability += 10;
    riskFactors.push(`Above-average repeat failures: ${contractorScore.repeatOccurrence}%`);
  }

  // Completion rate impact
  const completionRate = (contractorScore.completed / contractorScore.totalAssigned) * 100;
  if (completionRate < 70) {
    probability += 20;
    riskFactors.push(`Low completion rate: ${completionRate.toFixed(1)}%`);
  } else if (completionRate < 80) {
    probability += 10;
    riskFactors.push(`Below-target completion rate: ${completionRate.toFixed(1)}%`);
  }

  // SLA breach impact
  if (pothole.slaStatus === 'breached') {
    probability += 15;
    riskFactors.push('Current SLA breach recorded');
  }

  // Calculate trust score (inverse of blacklist probability with adjustments)
  const trustScore = Math.max(0, Math.min(100, 100 - (probability * 0.8) + (contractorScore.score * 0.2)));

  // Determine fund leakage risk
  let fundLeakageRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (probability >= 60 && contractorScore.repeatOccurrence > 20) {
    fundLeakageRisk = 'critical';
    riskFactors.push('ALERT: Potential fund leakage through repeat repairs');
  } else if (probability >= 40 || contractorScore.repeatOccurrence > 15) {
    fundLeakageRisk = 'high';
  } else if (probability >= 20 || contractorScore.repeatOccurrence > 10) {
    fundLeakageRisk = 'medium';
  }

  // Calculate estimated values (in lakhs)
  const estimatedRepairCost = 2.5; // Average repair cost in lakhs
  const violationCount = Math.round((contractorScore.totalAssigned - contractorScore.completed) + 
                                     (contractorScore.repeatOccurrence * contractorScore.totalAssigned / 100));
  const totalValue = Math.round(violationCount * estimatedRepairCost * 10) / 10;

  // Determine recommendation
  let recommendation: 'monitor' | 'review' | 'audit' | 'blacklist' = 'monitor';
  if (probability >= 70) {
    recommendation = 'blacklist';
  } else if (probability >= 50) {
    recommendation = 'audit';
  } else if (probability >= 30) {
    recommendation = 'review';
  }

  probability = Math.min(100, probability);

  return {
    probability,
    trustScore,
    riskFactors,
    fundLeakageRisk,
    recommendation,
    violationCount,
    totalValue
  };
}

// ==============================================
// CITIZEN TRUST INDEX AGENT
// ==============================================
export function calculateCitizenTrustIndex(
  pothole: Pothole,
  allPotholes: Pothole[]
): CitizenTrustIndex {
  // Filter potholes for this city and state
  const cityPotholes = allPotholes.filter(p => p.city === pothole.city);
  const statePotholes = allPotholes.filter(p => p.state === pothole.state);

  // Calculate repair delays (how many are breached or at risk)
  const cityDelays = cityPotholes.filter(p => p.slaStatus !== 'on_track').length;
  const cityRepeatComplaints = cityPotholes.filter(p => p.previousRepairs).length;
  
  // Calculate city score
  let cityScore = 100;
  if (cityPotholes.length > 0) {
    const delayPenalty = (cityDelays / cityPotholes.length) * 40;
    const repeatPenalty = (cityRepeatComplaints / cityPotholes.length) * 30;
    const slaPenalty = cityPotholes.filter(p => p.slaStatus === 'breached').length / cityPotholes.length * 30;
    cityScore = Math.max(0, Math.round(100 - delayPenalty - repeatPenalty - slaPenalty));
  }

  // Calculate state score
  let stateScore = 100;
  if (statePotholes.length > 0) {
    const stateDelays = statePotholes.filter(p => p.slaStatus !== 'on_track').length;
    const stateRepeats = statePotholes.filter(p => p.previousRepairs).length;
    const delayPenalty = (stateDelays / statePotholes.length) * 35;
    const repeatPenalty = (stateRepeats / statePotholes.length) * 25;
    stateScore = Math.max(0, Math.round(100 - delayPenalty - repeatPenalty));
  }

  // National average (simulated based on typical patterns)
  const nationalAverage = 68;

  // Determine trend
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (cityScore > nationalAverage + 10) {
    trend = 'improving';
  } else if (cityScore < nationalAverage - 10) {
    trend = 'declining';
  }

  // Calculate individual factors
  const factors = {
    repairDelays: Math.round((cityDelays / Math.max(1, cityPotholes.length)) * 100),
    repeatComplaints: Math.round((cityRepeatComplaints / Math.max(1, cityPotholes.length)) * 100),
    citizenSatisfaction: Math.round(100 - ((cityDelays + cityRepeatComplaints) / Math.max(1, cityPotholes.length * 2)) * 100),
    responseTime: Math.round(100 - (cityPotholes.reduce((acc, p) => acc + Math.min(p.daysOpen, 14), 0) / Math.max(1, cityPotholes.length * 14)) * 100)
  };

  // Determine public sentiment
  let publicSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (cityScore >= 75) {
    publicSentiment = 'positive';
  } else if (cityScore < 50) {
    publicSentiment = 'negative';
  }

  return {
    cityScore,
    stateScore,
    nationalAverage,
    trend,
    factors,
    publicSentiment
  };
}

// ==============================================
// DUPLICATE COMPLAINT ANALYZER AGENT
// ==============================================
export function analyzeDuplicates(pothole: Pothole, existingPotholes: Pothole[]): DuplicateAnalysis {
  const relatedPotholes: string[] = [];
  let matchConfidence = 0;

  // Check for exact location matches
  const exactMatches = existingPotholes.filter(
    p => p.location.toLowerCase() === pothole.location.toLowerCase() && 
         p.city === pothole.city && 
         p.id !== pothole.id
  );

  if (exactMatches.length > 0) {
    matchConfidence = 95;
    relatedPotholes.push(...exactMatches.map(p => p.id));
  }

  // Check for similar location matches
  const similarMatches = existingPotholes.filter(p => {
    if (p.id === pothole.id || exactMatches.includes(p)) return false;
    const loc1 = pothole.location.toLowerCase().split(/[,\s]+/);
    const loc2 = p.location.toLowerCase().split(/[,\s]+/);
    const commonWords = loc1.filter(w => loc2.includes(w) && w.length > 3);
    return commonWords.length >= 2 && p.city === pothole.city;
  });

  if (similarMatches.length > 0 && matchConfidence < 95) {
    matchConfidence = Math.max(matchConfidence, 60 + similarMatches.length * 10);
    relatedPotholes.push(...similarMatches.map(p => p.id));
  }

  const isDuplicate = matchConfidence >= 70;

  // Calculate citizen frustration level
  let citizenFrustrationLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  const totalRelated = relatedPotholes.length;
  
  if (totalRelated >= 3 || (isDuplicate && pothole.previousRepairs)) {
    citizenFrustrationLevel = 'critical';
  } else if (totalRelated >= 2 || pothole.previousRepairs) {
    citizenFrustrationLevel = 'high';
  } else if (totalRelated >= 1) {
    citizenFrustrationLevel = 'medium';
  }

  // Generate merge recommendation
  let mergeRecommendation = 'No action required. Unique complaint.';
  if (isDuplicate) {
    mergeRecommendation = `MERGE RECOMMENDED: Consolidate with existing complaint(s) ${relatedPotholes.join(', ')}. Update priority based on combined citizen reports.`;
  } else if (relatedPotholes.length > 0) {
    mergeRecommendation = `RELATED COMPLAINTS FOUND: ${relatedPotholes.join(', ')}. Consider investigating the entire road stretch.`;
  }

  return {
    isDuplicate,
    matchConfidence,
    relatedPotholes,
    citizenFrustrationLevel,
    mergeRecommendation
  };
}

// ==============================================
// CRITICALITY & SAFETY AGENT
// ==============================================
export function calculateCriticalityScore(pothole: Pothole): CriticalityScore {
  let heatScore = 0;
  
  const trafficDensity = determineTrafficLoad(pothole.location);
  
  // Traffic density impact
  if (trafficDensity === 'high') heatScore += 35;
  else if (trafficDensity === 'medium') heatScore += 20;
  else heatScore += 10;

  // SLA status impact
  if (pothole.slaStatus === 'breached') heatScore += 25;
  else if (pothole.slaStatus === 'at_risk') heatScore += 15;

  // Previous repairs impact (indicates chronic problem)
  if (pothole.previousRepairs) heatScore += 20;

  // Days open impact
  if (pothole.daysOpen > 14) heatScore += 15;
  else if (pothole.daysOpen > 7) heatScore += 10;

  // Monsoon impact
  if (pothole.monsoonImpact) heatScore += 5;

  heatScore = Math.min(100, heatScore);

  // Determine accident risk
  let accidentRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (heatScore >= 80 || (trafficDensity === 'high' && pothole.slaStatus === 'breached')) {
    accidentRisk = 'critical';
  } else if (heatScore >= 60) {
    accidentRisk = 'high';
  } else if (heatScore >= 40) {
    accidentRisk = 'medium';
  }

  // Determine priority level (1 = highest)
  let priorityLevel: 1 | 2 | 3 | 4 | 5;
  if (heatScore >= 80) priorityLevel = 1;
  else if (heatScore >= 60) priorityLevel = 2;
  else if (heatScore >= 40) priorityLevel = 3;
  else if (heatScore >= 20) priorityLevel = 4;
  else priorityLevel = 5;

  // Generate safety impact message
  let safetyImpact = '';
  if (accidentRisk === 'critical') {
    safetyImpact = 'CRITICAL SAFETY HAZARD: Immediate repair required. High probability of vehicle damage or accidents.';
  } else if (accidentRisk === 'high') {
    safetyImpact = 'HIGH SAFETY RISK: Expedited repair recommended. Road safety compromised, especially during night/rain.';
  } else if (accidentRisk === 'medium') {
    safetyImpact = 'MODERATE RISK: Standard repair timeline acceptable. Monitor for deterioration.';
  } else {
    safetyImpact = 'LOW RISK: Routine repair adequate. Minimal safety impact.';
  }

  return {
    heatScore,
    trafficDensity,
    accidentRisk,
    priorityLevel,
    safetyImpact
  };
}

// ==============================================
// SLA OPTIMIZATION AGENT
// ==============================================
export function optimizeSLA(pothole: Pothole): SLAOptimization {
  const currentSLA = pothole.expectedSLA;
  let recommendedSLA = currentSLA;
  const reasons: string[] = [];
  let seasonalAdjustment = false;
  let emergencyOverride = false;

  // Monsoon adjustment
  if (pothole.monsoonImpact) {
    recommendedSLA = Math.ceil(currentSLA * 0.7); // 30% faster during monsoon
    reasons.push('Monsoon season active - expedited repair required');
    seasonalAdjustment = true;
  }

  // High traffic road adjustment
  const trafficLoad = determineTrafficLoad(pothole.location);
  if (trafficLoad === 'high') {
    recommendedSLA = Math.min(recommendedSLA, Math.ceil(currentSLA * 0.75));
    reasons.push('High-traffic location - priority repair needed');
  }

  // Previous repairs adjustment (chronic issue)
  if (pothole.previousRepairs && pothole.daysSinceLastRepair && pothole.daysSinceLastRepair < 180) {
    recommendedSLA = Math.min(recommendedSLA, 3);
    reasons.push('Repeat failure - emergency repair with enhanced quality control');
    emergencyOverride = true;
  }

  // Already breached - immediate action
  if (pothole.slaStatus === 'breached') {
    recommendedSLA = 2; // 2 days emergency SLA
    reasons.push('SLA already breached - emergency escalation protocol');
    emergencyOverride = true;
  }

  const reason = reasons.length > 0 
    ? reasons.join('. ') 
    : 'Standard SLA appropriate for this case.';

  return {
    currentSLA,
    recommendedSLA,
    reason,
    seasonalAdjustment,
    emergencyOverride
  };
}

// ==============================================
// FINANCIAL LEAKAGE DETECTION AGENT
// ==============================================
export function detectFinancialLeakage(
  pothole: Pothole, 
  contractorScore: ContractorScore,
  historicalRepairs?: number
): FinancialLeakage {
  const avgRepairCost = 2.5; // lakhs
  let suspicionLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  let repeatSpendingAmount = 0;
  let potentialSavings = 0;
  let auditRecommendation = false;
  let flaggedTransactions = 0;

  // Calculate based on repeat occurrence
  const estimatedRepeatRepairs = Math.round(contractorScore.repeatOccurrence * contractorScore.totalAssigned / 100);
  repeatSpendingAmount = Math.round(estimatedRepeatRepairs * avgRepairCost * 10) / 10;
  
  // Industry benchmark: 5% repeat occurrence is acceptable
  const excessRepairs = Math.max(0, estimatedRepeatRepairs - Math.round(contractorScore.totalAssigned * 0.05));
  potentialSavings = Math.round(excessRepairs * avgRepairCost * 10) / 10;

  // Determine suspicion level
  if (contractorScore.repeatOccurrence > 20) {
    suspicionLevel = 'high';
    flaggedTransactions = estimatedRepeatRepairs;
    auditRecommendation = true;
  } else if (contractorScore.repeatOccurrence > 15) {
    suspicionLevel = 'medium';
    flaggedTransactions = Math.round(estimatedRepeatRepairs * 0.5);
  } else if (contractorScore.repeatOccurrence > 10) {
    suspicionLevel = 'low';
    flaggedTransactions = Math.round(estimatedRepeatRepairs * 0.2);
  }

  // Additional flag for current pothole
  if (pothole.previousRepairs && pothole.daysSinceLastRepair && pothole.daysSinceLastRepair < 90) {
    if (suspicionLevel === 'none') suspicionLevel = 'low';
    else if (suspicionLevel === 'low') suspicionLevel = 'medium';
    flaggedTransactions += 1;
  }

  return {
    suspicionLevel,
    repeatSpendingAmount,
    potentialSavings,
    auditRecommendation,
    flaggedTransactions
  };
}

// ==============================================
// AI VERDICT & ESCALATION AGENT
// ==============================================
export function generateAIVerdict(
  pothole: Pothole,
  contractorScore: ContractorScore,
  blacklistAssessment: BlacklistAssessment,
  citizenTrustIndex: CitizenTrustIndex,
  criticalityScore: CriticalityScore,
  financialLeakage: FinancialLeakage
): AIVerdict {
  const reasoning: string[] = [];
  const actions: string[] = [];
  let severityPoints = 0;

  // Analyze blacklist probability
  if (blacklistAssessment.probability >= 70) {
    reasoning.push(`Contractor blacklist probability at ${blacklistAssessment.probability}% - exceeds threshold`);
    actions.push('Initiate formal review under GFR 2017 Section 151');
    severityPoints += 4;
  } else if (blacklistAssessment.probability >= 50) {
    reasoning.push(`Contractor blacklist probability elevated at ${blacklistAssessment.probability}%`);
    actions.push('Schedule performance audit within 30 days');
    severityPoints += 2;
  }

  // Analyze citizen trust
  if (citizenTrustIndex.cityScore < 50) {
    reasoning.push(`City citizen trust index critically low: ${citizenTrustIndex.cityScore}/100`);
    actions.push('Escalate to Municipal Commissioner for city-wide review');
    severityPoints += 3;
  } else if (citizenTrustIndex.cityScore < 70) {
    reasoning.push(`City citizen trust below benchmark: ${citizenTrustIndex.cityScore}/100`);
    actions.push('Increase monitoring frequency for this city');
    severityPoints += 1;
  }

  // Analyze criticality
  if (criticalityScore.priorityLevel === 1) {
    reasoning.push('Priority Level 1 - Critical safety hazard identified');
    actions.push('Deploy emergency repair team within 24 hours');
    severityPoints += 4;
  } else if (criticalityScore.priorityLevel === 2) {
    reasoning.push('Priority Level 2 - High safety risk');
    actions.push('Expedite repair scheduling');
    severityPoints += 2;
  }

  // Analyze financial leakage
  if (financialLeakage.suspicionLevel === 'high') {
    reasoning.push(`High fund leakage suspicion - ₹${financialLeakage.potentialSavings}L potential savings`);
    actions.push('Recommend CAG audit of contractor payments');
    severityPoints += 3;
  } else if (financialLeakage.suspicionLevel === 'medium') {
    reasoning.push('Moderate financial irregularity indicators detected');
    actions.push('Flag for internal audit review');
    severityPoints += 1;
  }

  // Analyze SLA status
  if (pothole.slaStatus === 'breached') {
    reasoning.push(`SLA breached by ${pothole.daysOpen - pothole.expectedSLA} days`);
    actions.push('Send automated reminder to contractor');
    severityPoints += 2;
  }

  // Determine final decision
  let decision: AIVerdict['decision'] = 'monitor';
  if (severityPoints >= 8 || blacklistAssessment.recommendation === 'blacklist') {
    decision = 'blacklist_recommendation';
  } else if (severityPoints >= 6 || financialLeakage.auditRecommendation) {
    decision = 'audit';
  } else if (severityPoints >= 3 || pothole.slaStatus === 'breached') {
    decision = 'escalate';
  } else if (pothole.status === 'closed') {
    decision = 'close';
  }

  // Determine severity
  let severity: AIVerdict['severity'] = 'routine';
  if (severityPoints >= 8) severity = 'critical';
  else if (severityPoints >= 5) severity = 'urgent';
  else if (severityPoints >= 2) severity = 'attention';

  // Determine escalation level
  let escalationLevel: AIVerdict['escalationLevel'] = 'none';
  if (severityPoints >= 10) escalationLevel = 'ministry';
  else if (severityPoints >= 7) escalationLevel = 'collector';
  else if (severityPoints >= 4) escalationLevel = 'commissioner';
  else if (severityPoints >= 2) escalationLevel = 'supervisor';

  // Calculate confidence
  const confidence = Math.min(95, 60 + (reasoning.length * 8));

  if (reasoning.length === 0) {
    reasoning.push('All metrics within acceptable parameters');
    actions.push('Continue standard monitoring');
  }

  return {
    decision,
    severity,
    confidence,
    reasoning,
    actions,
    escalationLevel,
    timestamp: new Date()
  };
}

// ==============================================
// ADVANCED AGENT ANALYSIS GENERATORS
// ==============================================

export function runDurabilityAgent(durabilityPrediction: DurabilityPrediction): AgentAnalysis {
  let status: AgentAnalysis['status'] = 'info';
  if (durabilityPrediction.expectedLifespanDays < 180) status = 'danger';
  else if (durabilityPrediction.expectedLifespanDays < 365) status = 'warning';
  else status = 'success';

  const years = (durabilityPrediction.expectedLifespanDays / 365).toFixed(1);
  
  return {
    agent: 'Durability Prediction Agent',
    icon: 'clock',
    color: 'agent-quality',
    analysis: `DURABILITY FORECAST: Expected repair lifespan ${years} years (${durabilityPrediction.expectedLifespanDays} days). Confidence: ${durabilityPrediction.confidenceLevel.toUpperCase()}. Traffic: ${durabilityPrediction.factors.trafficLoad.toUpperCase()}. ${durabilityPrediction.recommendation}`,
    status,
    project: 'road_guardian'
  };
}

export function runBlacklistAgent(blacklistAssessment: BlacklistAssessment, contractorName: string): AgentAnalysis {
  let status: AgentAnalysis['status'] = 'success';
  if (blacklistAssessment.probability >= 70) status = 'danger';
  else if (blacklistAssessment.probability >= 40) status = 'warning';
  
  const topRisks = blacklistAssessment.riskFactors.slice(0, 2).join('. ');

  return {
    agent: 'Contractor Risk Intelligence Agent',
    icon: 'shield-alert',
    color: 'agent-alert',
    analysis: `BLACKLIST ANALYSIS: ${contractorName} - Trust Score: ${blacklistAssessment.trustScore}/100. Blacklist Probability: ${blacklistAssessment.probability}%. Fund Leakage Risk: ${blacklistAssessment.fundLeakageRisk.toUpperCase()}. ${topRisks}. Recommendation: ${blacklistAssessment.recommendation.toUpperCase()}.`,
    status,
    project: 'road_guardian'
  };
}

export function runCitizenTrustAgent(citizenTrustIndex: CitizenTrustIndex, city: string): AgentAnalysis {
  let status: AgentAnalysis['status'] = 'info';
  if (citizenTrustIndex.cityScore < 50) status = 'danger';
  else if (citizenTrustIndex.cityScore < 70) status = 'warning';
  else status = 'success';

  return {
    agent: 'Citizen Trust Index Agent',
    icon: 'users',
    color: 'agent-transparency',
    analysis: `PUBLIC TRUST METRICS for ${city}: City Score ${citizenTrustIndex.cityScore}/100 (State: ${citizenTrustIndex.stateScore}, National: ${citizenTrustIndex.nationalAverage}). Trend: ${citizenTrustIndex.trend.toUpperCase()}. Public Sentiment: ${citizenTrustIndex.publicSentiment.toUpperCase()}. Repair delays: ${citizenTrustIndex.factors.repairDelays}%, Repeat complaints: ${citizenTrustIndex.factors.repeatComplaints}%.`,
    status,
    project: 'road_guardian'
  };
}

export function runCriticalityAgent(criticalityScore: CriticalityScore): AgentAnalysis {
  let status: AgentAnalysis['status'] = 'info';
  if (criticalityScore.priorityLevel === 1) status = 'danger';
  else if (criticalityScore.priorityLevel <= 2) status = 'warning';
  else status = 'success';

  return {
    agent: 'Criticality & Safety Agent',
    icon: 'alert-triangle',
    color: 'agent-alert',
    analysis: `SAFETY ASSESSMENT: Heat Score ${criticalityScore.heatScore}/100. Priority Level P${criticalityScore.priorityLevel}. Traffic: ${criticalityScore.trafficDensity.toUpperCase()}. Accident Risk: ${criticalityScore.accidentRisk.toUpperCase()}. ${criticalityScore.safetyImpact}`,
    status,
    project: 'road_guardian'
  };
}

export function runFinancialLeakageAgent(financialLeakage: FinancialLeakage): AgentAnalysis {
  let status: AgentAnalysis['status'] = 'success';
  if (financialLeakage.suspicionLevel === 'high') status = 'danger';
  else if (financialLeakage.suspicionLevel === 'medium') status = 'warning';
  else if (financialLeakage.suspicionLevel === 'low') status = 'info';

  return {
    agent: 'Financial Leakage Detection Agent',
    icon: 'banknote',
    color: 'agent-contractor',
    analysis: `FUND ANALYSIS: Suspicion Level ${financialLeakage.suspicionLevel.toUpperCase()}. Repeat spending: ₹${financialLeakage.repeatSpendingAmount}L. Potential savings: ₹${financialLeakage.potentialSavings}L. Flagged transactions: ${financialLeakage.flaggedTransactions}. ${financialLeakage.auditRecommendation ? 'AUDIT RECOMMENDED' : 'No audit required'}.`,
    status,
    project: 'road_guardian'
  };
}

export function runAIVerdictAgent(aiVerdict: AIVerdict): AgentAnalysis {
  let status: AgentAnalysis['status'] = 'info';
  if (aiVerdict.severity === 'critical') status = 'danger';
  else if (aiVerdict.severity === 'urgent') status = 'warning';
  else if (aiVerdict.severity === 'attention') status = 'info';
  else status = 'success';

  const topActions = aiVerdict.actions.slice(0, 2).join('. ');

  return {
    agent: 'AI Verdict & Escalation Agent',
    icon: 'brain',
    color: 'agent-detection',
    analysis: `FINAL AI VERDICT: ${aiVerdict.decision.replace('_', ' ').toUpperCase()}. Severity: ${aiVerdict.severity.toUpperCase()}. Confidence: ${aiVerdict.confidence}%. Escalation: ${aiVerdict.escalationLevel === 'none' ? 'Not Required' : aiVerdict.escalationLevel.toUpperCase()}. Actions: ${topActions}.`,
    status,
    project: 'road_guardian'
  };
}

// ==============================================
// EXTENDED INTELLIGENCE MODE AGENTS
// ==============================================

export function calculatePotholeAgeDebt(pothole: Pothole, criticalityScore: CriticalityScore): ExtendedIntelligence['potholeAgeDebt'] {
  // Risk factor based on criticality (1.0 to 3.0)
  const riskFactor = 1 + (criticalityScore.heatScore / 50);
  const score = Math.round(pothole.daysOpen * riskFactor);
  
  let interpretation = 'Low urgency debt';
  if (score >= 50) interpretation = 'Critical urgency debt - immediate action required';
  else if (score >= 30) interpretation = 'High urgency debt - expedite repair';
  else if (score >= 15) interpretation = 'Moderate urgency debt - monitor closely';
  
  return {
    score,
    daysOpen: pothole.daysOpen,
    riskFactor: Math.round(riskFactor * 10) / 10,
    interpretation,
    citizenExplanation: `This pothole has accumulated ${score} "urgency points" - the longer it stays open and the more dangerous it is, the faster this number grows. A score above 30 means authorities should treat this as a priority.`
  };
}

export function calculateAccidentProbability(pothole: Pothole, criticalityScore: CriticalityScore): ExtendedIntelligence['accidentProbability'] {
  let baseProb = 5; // Base 5% probability
  const factors: string[] = [];
  
  // Traffic density impact
  if (criticalityScore.trafficDensity === 'high') {
    baseProb += 25;
    factors.push('High traffic volume');
  } else if (criticalityScore.trafficDensity === 'medium') {
    baseProb += 15;
    factors.push('Moderate traffic');
  }
  
  // Days open impact
  if (pothole.daysOpen > 14) {
    baseProb += 20;
    factors.push('Pothole open for extended period');
  } else if (pothole.daysOpen > 7) {
    baseProb += 10;
    factors.push('Week-old pothole');
  }
  
  // Previous repairs indicate chronic problem
  if (pothole.previousRepairs) {
    baseProb += 15;
    factors.push('Recurring problem area');
  }
  
  // Monsoon increases risk
  if (pothole.monsoonImpact) {
    baseProb += 15;
    factors.push('Monsoon visibility issues');
  }
  
  // SLA breach indicates neglect
  if (pothole.slaStatus === 'breached') {
    baseProb += 10;
    factors.push('Repair timeline exceeded');
  }
  
  const percentage = Math.min(85, baseProb);
  const confidenceLevel = factors.length >= 4 ? 'high' : factors.length >= 2 ? 'medium' : 'low';
  
  return {
    percentage,
    confidenceLevel,
    factors,
    citizenExplanation: `If this pothole isn't repaired in the next 7 days, there's approximately a ${percentage}% chance it could contribute to a vehicle accident or damage. ${percentage > 50 ? 'This is a serious risk that needs immediate attention.' : percentage > 30 ? 'This is a moderate risk that should be addressed soon.' : 'This is a lower risk, but repairs are still recommended.'}`
  };
}

export function analyzeContractorBehavioralPattern(contractorScore: ContractorScore): ExtendedIntelligence['contractorBehavioralPattern'] {
  const avgResponseDays = contractorScore.avgResponseTime;
  const completionRate = (contractorScore.completed / Math.max(1, contractorScore.totalAssigned)) * 100;
  
  // Determine pattern
  let pattern: 'reliable' | 'inconsistent' | 'declining' | 'problematic' = 'reliable';
  if (contractorScore.score < 50) {
    pattern = 'problematic';
  } else if (contractorScore.repeatOccurrence > 15 || completionRate < 70) {
    pattern = 'declining';
  } else if (contractorScore.score < 70 || completionRate < 85) {
    pattern = 'inconsistent';
  }
  
  // Determine quality trend (simulated based on repeat occurrence)
  let qualityTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (contractorScore.repeatOccurrence > 15) qualityTrend = 'declining';
  else if (contractorScore.repeatOccurrence < 5 && contractorScore.score >= 80) qualityTrend = 'improving';
  
  // Workload status
  let workloadStatus: 'underloaded' | 'optimal' | 'overloaded' = 'optimal';
  if (contractorScore.totalAssigned > 150) workloadStatus = 'overloaded';
  else if (contractorScore.totalAssigned < 30) workloadStatus = 'underloaded';
  
  const patternDescriptions = {
    reliable: 'This contractor consistently delivers quality repairs on time',
    inconsistent: 'This contractor shows mixed results - some good, some concerning',
    declining: 'This contractor\'s performance has been getting worse over time',
    problematic: 'This contractor has serious performance issues that need immediate review'
  };
  
  return {
    pattern,
    avgResponseDays,
    qualityTrend,
    workloadStatus,
    citizenExplanation: `${patternDescriptions[pattern]}. They typically respond in ${avgResponseDays.toFixed(1)} days and their work quality trend is ${qualityTrend}. ${workloadStatus === 'overloaded' ? 'They may be handling too many projects at once.' : ''}`
  };
}

export function calculateRepairConfidenceLevel(
  pothole: Pothole, 
  contractorScore: ContractorScore, 
  durabilityPrediction: DurabilityPrediction
): ExtendedIntelligence['repairConfidenceLevel'] {
  let score = 50; // Base score
  const keyFactors: string[] = [];
  
  // Contractor quality impact
  if (contractorScore.score >= 80) {
    score += 25;
    keyFactors.push('High-performing contractor');
  } else if (contractorScore.score >= 60) {
    score += 10;
    keyFactors.push('Average contractor performance');
  } else {
    score -= 15;
    keyFactors.push('Contractor performance concerns');
  }
  
  // Previous repairs impact
  if (pothole.previousRepairs) {
    score -= 20;
    keyFactors.push('Previous repair failed');
  } else {
    score += 10;
    keyFactors.push('First-time repair');
  }
  
  // Durability factors
  if (durabilityPrediction.factors.materialQuality === 'premium') {
    score += 15;
    keyFactors.push('Premium materials expected');
  }
  
  // Monsoon impact
  if (pothole.monsoonImpact) {
    score -= 10;
    keyFactors.push('Monsoon conditions challenging');
  }
  
  score = Math.max(10, Math.min(95, score));
  
  const level: 'Low' | 'Medium' | 'High' = score >= 70 ? 'High' : score >= 45 ? 'Medium' : 'Low';
  
  return {
    level,
    score,
    keyFactors,
    citizenExplanation: `We have ${level.toLowerCase()} confidence that this repair will be successful and last long-term. ${level === 'High' ? 'The conditions and contractor are favorable.' : level === 'Medium' ? 'There are some concerns but the repair should work.' : 'There are significant concerns - enhanced monitoring recommended.'}`
  };
}

export function recommendRepairMethod(pothole: Pothole, criticalityScore: CriticalityScore): ExtendedIntelligence['aiRecommendedRepairMethod'] {
  let method: ExtendedIntelligence['aiRecommendedRepairMethod']['method'] = 'pothole_patching';
  let estimatedCost = 5000;
  let estimatedDuration = 2;
  let materialRequired = 'Cold mix asphalt';
  
  // Determine based on severity and road type
  const digitalIdentitySeverity = pothole.slaStatus === 'breached' && pothole.daysOpen > 14 ? 'critical' : 
                                   pothole.slaStatus === 'breached' ? 'severe' : 
                                   pothole.daysOpen > 5 ? 'moderate' : 'minor';
  
  const isHighway = pothole.location.toLowerCase().includes('highway') || 
                    pothole.location.toLowerCase().includes('express');
  
  if (pothole.previousRepairs && pothole.daysSinceLastRepair && pothole.daysSinceLastRepair < 180) {
    // Recurring pothole needs major fix
    method = 'full_depth_repair';
    estimatedCost = 25000;
    estimatedDuration = 8;
    materialRequired = 'Hot mix asphalt with base course repair';
  } else if (isHighway && (digitalIdentitySeverity === 'critical' || digitalIdentitySeverity === 'severe')) {
    method = 'road_resurfacing';
    estimatedCost = 150000;
    estimatedDuration = 24;
    materialRequired = 'Dense bituminous macadam (DBM) overlay';
  } else if (digitalIdentitySeverity === 'critical') {
    method = 'full_depth_repair';
    estimatedCost = 25000;
    estimatedDuration = 8;
    materialRequired = 'Hot mix asphalt with compaction';
  } else if (digitalIdentitySeverity === 'severe' || criticalityScore.heatScore > 60) {
    method = 'surface_treatment';
    estimatedCost = 12000;
    estimatedDuration = 4;
    materialRequired = 'Hot mix asphalt surface course';
  } else {
    method = 'pothole_patching';
    estimatedCost = 5000;
    estimatedDuration = 2;
    materialRequired = 'Cold mix asphalt patching';
  }
  
  const methodDescriptions = {
    pothole_patching: 'Simple filling of the pothole with patching material - quick and cost-effective for minor issues',
    full_depth_repair: 'Complete removal and reconstruction of the road section - best for recurring problems',
    surface_treatment: 'Applying a new surface layer over the affected area - balances quality and speed',
    road_resurfacing: 'Laying a new road surface over a larger area - for seriously damaged stretches',
    complete_reconstruction: 'Full road rebuild from foundation - for areas with structural failure'
  };
  
  return {
    method,
    estimatedCost,
    estimatedDuration,
    materialRequired,
    citizenExplanation: `AI recommends "${method.replace(/_/g, ' ').toUpperCase()}": ${methodDescriptions[method]}. Estimated cost: ₹${estimatedCost.toLocaleString('en-IN')}. Expected completion: ${estimatedDuration} hours.`
  };
}

export function determineInterDepartmentResponsibility(pothole: Pothole): ExtendedIntelligence['interDepartmentResponsibility'] {
  const location = pothole.location.toLowerCase();
  let primaryDepartment = 'Municipal Corporation - Roads Division';
  const supportingDepartments: string[] = [];
  let coordinationLevel: 'single' | 'multi' | 'complex' = 'single';
  
  // Determine primary department based on road type
  if (location.includes('nh-') || location.includes('national highway')) {
    primaryDepartment = 'National Highways Authority of India (NHAI)';
    supportingDepartments.push('State PWD');
    coordinationLevel = 'multi';
  } else if (location.includes('sh-') || location.includes('state highway')) {
    primaryDepartment = 'State Public Works Department (PWD)';
    supportingDepartments.push('District Administration');
    coordinationLevel = 'multi';
  } else if (location.includes('flyover') || location.includes('bridge')) {
    primaryDepartment = 'Bridges & Structural Division';
    supportingDepartments.push('Traffic Police', 'Municipal Corporation');
    coordinationLevel = 'complex';
  }
  
  // Add traffic police for high-traffic areas
  if (location.includes('junction') || location.includes('crossing') || location.includes('signal')) {
    if (!supportingDepartments.includes('Traffic Police')) {
      supportingDepartments.push('Traffic Police');
    }
    coordinationLevel = coordinationLevel === 'single' ? 'multi' : coordinationLevel;
  }
  
  // Water/drainage issues
  if (pothole.monsoonImpact) {
    supportingDepartments.push('Storm Water Drainage Department');
    coordinationLevel = coordinationLevel === 'single' ? 'multi' : 'complex';
  }
  
  return {
    primaryDepartment,
    supportingDepartments,
    coordinationLevel,
    citizenExplanation: `${primaryDepartment} is responsible for fixing this. ${supportingDepartments.length > 0 ? `They need to work with: ${supportingDepartments.join(', ')}.` : ''} ${coordinationLevel === 'complex' ? 'This requires coordination between multiple government bodies, which may take longer.' : coordinationLevel === 'multi' ? 'A couple of departments need to work together on this.' : 'This is a straightforward single-department job.'}`
  };
}

export function calculateRepairWarrantyConfidence(
  durabilityPrediction: DurabilityPrediction, 
  contractorScore: ContractorScore
): ExtendedIntelligence['repairWarrantyConfidence'] {
  // Base warranty expectation
  let months = 12;
  const factors: string[] = [];
  
  // Adjust based on expected lifespan
  if (durabilityPrediction.expectedLifespanDays > 540) { // 1.5 years
    months = 18;
    factors.push('Long expected lifespan');
  } else if (durabilityPrediction.expectedLifespanDays > 365) {
    months = 12;
    factors.push('Standard lifespan expected');
  } else {
    months = 6;
    factors.push('Shorter lifespan predicted');
  }
  
  // Contractor reliability
  if (contractorScore.repeatOccurrence < 5) {
    months += 6;
    factors.push('Low repeat failure rate');
  } else if (contractorScore.repeatOccurrence > 15) {
    months -= 3;
    factors.push('High repeat failures');
  }
  
  // Material quality
  if (durabilityPrediction.factors.materialQuality === 'premium') {
    months += 6;
    factors.push('Premium materials used');
  }
  
  months = Math.max(3, Math.min(24, months));
  
  const confidence: 'high' | 'medium' | 'low' = 
    durabilityPrediction.confidenceLevel === 'high' && contractorScore.score >= 70 ? 'high' :
    durabilityPrediction.confidenceLevel === 'low' || contractorScore.score < 50 ? 'low' : 'medium';
  
  return {
    months,
    confidence,
    factors,
    citizenExplanation: `We expect this repair to last at least ${months} months before needing attention. Our confidence in this estimate is ${confidence}. ${confidence === 'low' ? 'You may want to report any issues early.' : confidence === 'high' ? 'This should be a durable repair.' : 'Keep an eye on this repair over time.'}`
  };
}

export function calculateCityLevelCivicHealthIndex(
  pothole: Pothole,
  citizenTrustIndex: CitizenTrustIndex,
  allPotholes: Pothole[]
): ExtendedIntelligence['cityLevelCivicHealthIndex'] {
  const cityPotholes = allPotholes.filter(p => p.city === pothole.city);
  
  // Infrastructure health: inverse of breach rate
  const breachedCount = cityPotholes.filter(p => p.slaStatus === 'breached').length;
  const infrastructureHealth = Math.round(100 - (breachedCount / Math.max(1, cityPotholes.length)) * 100);
  
  // Response efficiency: based on average days open
  const avgDaysOpen = cityPotholes.reduce((sum, p) => sum + p.daysOpen, 0) / Math.max(1, cityPotholes.length);
  const responseEfficiency = Math.round(Math.max(0, 100 - (avgDaysOpen * 5)));
  
  // Citizen satisfaction from trust index
  const citizenSatisfaction = citizenTrustIndex.factors.citizenSatisfaction;
  
  // Calculate overall score
  const score = Math.round((infrastructureHealth * 0.4) + (responseEfficiency * 0.3) + (citizenSatisfaction * 0.3));
  
  // Grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 40) grade = 'D';
  else grade = 'F';
  
  const gradeDescriptions = {
    A: 'Excellent - This city is doing a great job maintaining roads',
    B: 'Good - The city responds well to most road issues',
    C: 'Average - There\'s room for improvement in road maintenance',
    D: 'Below Average - Significant improvements needed',
    F: 'Poor - Major overhaul of road maintenance required'
  };
  
  return {
    score,
    grade,
    infrastructureHealth,
    responseEfficiency,
    citizenSatisfaction,
    citizenExplanation: `${pothole.city} receives a Grade ${grade} (${score}/100) for civic road health. ${gradeDescriptions[grade]}. Infrastructure: ${infrastructureHealth}%, Response Speed: ${responseEfficiency}%, Citizen Satisfaction: ${citizenSatisfaction}%.`
  };
}

export function computeExtendedIntelligence(
  pothole: Pothole,
  contractorScore: ContractorScore,
  durabilityPrediction: DurabilityPrediction,
  criticalityScore: CriticalityScore,
  citizenTrustIndex: CitizenTrustIndex,
  allPotholes: Pothole[]
): ExtendedIntelligence {
  return {
    potholeAgeDebt: calculatePotholeAgeDebt(pothole, criticalityScore),
    accidentProbability: calculateAccidentProbability(pothole, criticalityScore),
    contractorBehavioralPattern: analyzeContractorBehavioralPattern(contractorScore),
    repairConfidenceLevel: calculateRepairConfidenceLevel(pothole, contractorScore, durabilityPrediction),
    aiRecommendedRepairMethod: recommendRepairMethod(pothole, criticalityScore),
    interDepartmentResponsibility: determineInterDepartmentResponsibility(pothole),
    repairWarrantyConfidence: calculateRepairWarrantyConfidence(durabilityPrediction, contractorScore),
    cityLevelCivicHealthIndex: calculateCityLevelCivicHealthIndex(pothole, citizenTrustIndex, allPotholes)
  };
}

// ==============================================
// MAIN ADVANCED ANALYSIS FUNCTION
// ==============================================
export function runAdvancedAnalysis(
  pothole: Pothole,
  contractorScore: ContractorScore,
  allPotholes: Pothole[]
): {
  advancedAnalysis: AdvancedPotholeAnalysis;
  advancedAgentAnalyses: AgentAnalysis[];
} {
  // Run all advanced agents
  const digitalIdentity = createDigitalIdentity(pothole);
  const durabilityPrediction = predictDurability(pothole, contractorScore);
  const blacklistAssessment = assessBlacklistProbability(pothole, contractorScore);
  const citizenTrustIndex = calculateCitizenTrustIndex(pothole, allPotholes);
  const duplicateAnalysis = analyzeDuplicates(pothole, allPotholes);
  const criticalityScore = calculateCriticalityScore(pothole);
  const slaOptimization = optimizeSLA(pothole);
  const financialLeakage = detectFinancialLeakage(pothole, contractorScore);
  const aiVerdict = generateAIVerdict(
    pothole, 
    contractorScore, 
    blacklistAssessment, 
    citizenTrustIndex, 
    criticalityScore, 
    financialLeakage
  );
  
  // Compute Extended Intelligence
  const extendedIntelligence = computeExtendedIntelligence(
    pothole,
    contractorScore,
    durabilityPrediction,
    criticalityScore,
    citizenTrustIndex,
    allPotholes
  );

  const advancedAnalysis: AdvancedPotholeAnalysis = {
    potholeId: pothole.id,
    digitalIdentity,
    durabilityPrediction,
    blacklistAssessment,
    citizenTrustIndex,
    duplicateAnalysis,
    criticalityScore,
    slaOptimization,
    financialLeakage,
    aiVerdict,
    extendedIntelligence
  };

  const advancedAgentAnalyses: AgentAnalysis[] = [
    runDurabilityAgent(durabilityPrediction),
    runBlacklistAgent(blacklistAssessment, pothole.contractor),
    runCitizenTrustAgent(citizenTrustIndex, pothole.city),
    runCriticalityAgent(criticalityScore),
    runFinancialLeakageAgent(financialLeakage),
    runAIVerdictAgent(aiVerdict)
  ];

  return { advancedAnalysis, advancedAgentAnalyses };
}
