// ROAD-GUARDIAN X: Advanced AI Types

export interface DurabilityPrediction {
  expectedLifespanDays: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  factors: {
    contractorQuality: number; // 0-100
    weatherImpact: number; // 0-100
    trafficLoad: 'low' | 'medium' | 'high';
    materialQuality: 'standard' | 'premium' | 'unknown';
    monsoonRisk: boolean;
  };
  recommendation: string;
}

export interface BlacklistAssessment {
  probability: number; // 0-100%
  trustScore: number; // 0-100
  riskFactors: string[];
  fundLeakageRisk: 'low' | 'medium' | 'high' | 'critical';
  recommendation: 'monitor' | 'review' | 'audit' | 'blacklist';
  violationCount: number;
  totalValue: number; // in lakhs
}

export interface CitizenTrustIndex {
  cityScore: number; // 0-100
  stateScore: number; // 0-100
  nationalAverage: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  factors: {
    repairDelays: number;
    repeatComplaints: number;
    citizenSatisfaction: number;
    responseTime: number;
  };
  publicSentiment: 'positive' | 'neutral' | 'negative';
}

export interface DuplicateAnalysis {
  isDuplicate: boolean;
  matchConfidence: number; // 0-100
  relatedPotholes: string[];
  citizenFrustrationLevel: 'low' | 'medium' | 'high' | 'critical';
  mergeRecommendation: string;
}

export interface CriticalityScore {
  heatScore: number; // 0-100
  trafficDensity: 'low' | 'medium' | 'high';
  accidentRisk: 'low' | 'medium' | 'high' | 'critical';
  priorityLevel: 1 | 2 | 3 | 4 | 5; // 1 = highest priority
  safetyImpact: string;
}

export interface SLAOptimization {
  currentSLA: number;
  recommendedSLA: number;
  reason: string;
  seasonalAdjustment: boolean;
  emergencyOverride: boolean;
}

export interface FinancialLeakage {
  suspicionLevel: 'none' | 'low' | 'medium' | 'high';
  repeatSpendingAmount: number; // in lakhs
  potentialSavings: number; // in lakhs
  auditRecommendation: boolean;
  flaggedTransactions: number;
}

export interface AIVerdict {
  decision: 'monitor' | 'escalate' | 'audit' | 'blacklist_recommendation' | 'close';
  severity: 'routine' | 'attention' | 'urgent' | 'critical';
  confidence: number; // 0-100
  reasoning: string[];
  actions: string[];
  escalationLevel: 'none' | 'supervisor' | 'commissioner' | 'collector' | 'ministry';
  timestamp: Date;
}

export interface AdvancedPotholeAnalysis {
  potholeId: string;
  digitalIdentity: {
    birthTimestamp: Date;
    gpsCoordinates?: { lat: number; lng: number };
    roadType: 'national_highway' | 'state_highway' | 'city_road' | 'colony_road';
    severity: 'minor' | 'moderate' | 'severe' | 'critical';
    zone: string;
  };
  durabilityPrediction: DurabilityPrediction;
  blacklistAssessment: BlacklistAssessment;
  citizenTrustIndex: CitizenTrustIndex;
  duplicateAnalysis: DuplicateAnalysis;
  criticalityScore: CriticalityScore;
  slaOptimization: SLAOptimization;
  financialLeakage: FinancialLeakage;
  aiVerdict: AIVerdict;
}
