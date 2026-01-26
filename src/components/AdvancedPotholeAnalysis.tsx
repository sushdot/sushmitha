import { cn } from '@/lib/utils';
import { AdvancedPotholeAnalysis as AdvancedAnalysisType } from '@/types/roadGuardianX';
import { 
  Shield, Clock, Users, AlertTriangle, Banknote, Brain, 
  TrendingUp, TrendingDown, Minus, Calendar, MapPin, Target,
  Gauge, CarFront, UserCheck, Wrench, Building2, BadgeCheck, 
  Activity, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AdvancedPotholeAnalysisProps {
  analysis: AdvancedAnalysisType;
}

export function AdvancedPotholeAnalysisDashboard({ analysis }: AdvancedPotholeAnalysisProps) {
  const [showExtendedDetails, setShowExtendedDetails] = useState(true);
  
  const { 
    digitalIdentity, 
    durabilityPrediction, 
    blacklistAssessment, 
    citizenTrustIndex, 
    criticalityScore,
    slaOptimization,
    financialLeakage,
    aiVerdict,
    extendedIntelligence
  } = analysis;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Digital Identity Card */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Digital Identity Certificate</h3>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Birth Date</p>
            <p className="font-mono text-sm font-medium">{format(digitalIdentity.birthTimestamp, 'dd MMM yyyy')}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <MapPin className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Road Type</p>
            <p className="font-medium text-sm capitalize">{digitalIdentity.roadType.replace('_', ' ')}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Severity</p>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium",
              digitalIdentity.severity === 'critical' && 'bg-destructive/15 text-destructive',
              digitalIdentity.severity === 'severe' && 'bg-agent-alert/15 text-agent-alert',
              digitalIdentity.severity === 'moderate' && 'bg-warning/15 text-warning',
              digitalIdentity.severity === 'minor' && 'bg-success/15 text-success'
            )}>
              {digitalIdentity.severity.toUpperCase()}
            </span>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Target className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Zone</p>
            <p className="font-mono text-sm font-medium">{digitalIdentity.zone}</p>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Durability Prediction */}
        <MetricCard
          icon={Clock}
          title="Durability Prediction"
          iconColor="text-info"
          bgColor="bg-info/10"
        >
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {(durabilityPrediction.expectedLifespanDays / 365).toFixed(1)}
              </span>
              <span className="text-muted-foreground text-sm">years expected</span>
            </div>
            <ProgressBar 
              value={Math.min(100, (durabilityPrediction.expectedLifespanDays / 730) * 100)} 
              color={durabilityPrediction.expectedLifespanDays > 365 ? 'success' : durabilityPrediction.expectedLifespanDays > 180 ? 'warning' : 'danger'}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Confidence: {durabilityPrediction.confidenceLevel.toUpperCase()}</span>
              <span>Traffic: {durabilityPrediction.factors.trafficLoad.toUpperCase()}</span>
            </div>
          </div>
        </MetricCard>

        {/* Blacklist Assessment */}
        <MetricCard
          icon={Shield}
          title="Contractor Risk Score"
          iconColor="text-agent-alert"
          bgColor="bg-agent-alert/10"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-foreground">{blacklistAssessment.trustScore}</span>
                <span className="text-muted-foreground text-sm">/100 trust</span>
              </div>
              <div className={cn(
                "px-2 py-1 rounded-lg text-xs font-bold",
                blacklistAssessment.probability >= 70 && 'bg-destructive/15 text-destructive',
                blacklistAssessment.probability >= 40 && blacklistAssessment.probability < 70 && 'bg-warning/15 text-warning',
                blacklistAssessment.probability < 40 && 'bg-success/15 text-success'
              )}>
                {blacklistAssessment.probability}% blacklist risk
              </div>
            </div>
            <ProgressBar 
              value={blacklistAssessment.trustScore} 
              color={blacklistAssessment.trustScore >= 70 ? 'success' : blacklistAssessment.trustScore >= 50 ? 'warning' : 'danger'}
            />
            <p className="text-xs text-muted-foreground">
              Fund Leakage: <span className={cn(
                "font-medium",
                blacklistAssessment.fundLeakageRisk === 'critical' && 'text-destructive',
                blacklistAssessment.fundLeakageRisk === 'high' && 'text-agent-alert',
                blacklistAssessment.fundLeakageRisk === 'medium' && 'text-warning'
              )}>{blacklistAssessment.fundLeakageRisk.toUpperCase()}</span>
            </p>
          </div>
        </MetricCard>

        {/* Citizen Trust Index */}
        <MetricCard
          icon={Users}
          title="Citizen Trust Index"
          iconColor="text-success"
          bgColor="bg-success/10"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-foreground">{citizenTrustIndex.cityScore}</span>
                <span className="text-muted-foreground text-sm">/100</span>
              </div>
              <TrendIndicator trend={citizenTrustIndex.trend} />
            </div>
            <ProgressBar 
              value={citizenTrustIndex.cityScore} 
              color={citizenTrustIndex.cityScore >= 70 ? 'success' : citizenTrustIndex.cityScore >= 50 ? 'warning' : 'danger'}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>State: {citizenTrustIndex.stateScore}</span>
              <span>National: {citizenTrustIndex.nationalAverage}</span>
            </div>
          </div>
        </MetricCard>

        {/* Criticality Score */}
        <MetricCard
          icon={AlertTriangle}
          title="Safety Heat Score"
          iconColor="text-warning"
          bgColor="bg-warning/10"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-foreground">{criticalityScore.heatScore}</span>
                <span className="text-muted-foreground text-sm">/100</span>
              </div>
              <span className={cn(
                "px-2 py-1 rounded-lg text-xs font-bold",
                criticalityScore.priorityLevel === 1 && 'bg-destructive text-destructive-foreground',
                criticalityScore.priorityLevel === 2 && 'bg-agent-alert text-white',
                criticalityScore.priorityLevel === 3 && 'bg-warning text-warning-foreground',
                criticalityScore.priorityLevel >= 4 && 'bg-muted text-muted-foreground'
              )}>
                P{criticalityScore.priorityLevel}
              </span>
            </div>
            <ProgressBar 
              value={criticalityScore.heatScore} 
              color={criticalityScore.heatScore >= 70 ? 'danger' : criticalityScore.heatScore >= 40 ? 'warning' : 'success'}
            />
            <p className="text-xs text-muted-foreground">
              Accident Risk: <span className={cn(
                "font-medium",
                criticalityScore.accidentRisk === 'critical' && 'text-destructive',
                criticalityScore.accidentRisk === 'high' && 'text-agent-alert',
                criticalityScore.accidentRisk === 'medium' && 'text-warning'
              )}>{criticalityScore.accidentRisk.toUpperCase()}</span>
            </p>
          </div>
        </MetricCard>

        {/* Financial Leakage */}
        <MetricCard
          icon={Banknote}
          title="Financial Analysis"
          iconColor="text-primary"
          bgColor="bg-primary/10"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-foreground">₹{financialLeakage.potentialSavings}L</span>
                <span className="text-muted-foreground text-xs block">potential savings</span>
              </div>
              <span className={cn(
                "px-2 py-1 rounded-lg text-xs font-medium",
                financialLeakage.suspicionLevel === 'high' && 'bg-destructive/15 text-destructive',
                financialLeakage.suspicionLevel === 'medium' && 'bg-warning/15 text-warning',
                financialLeakage.suspicionLevel === 'low' && 'bg-info/15 text-info',
                financialLeakage.suspicionLevel === 'none' && 'bg-success/15 text-success'
              )}>
                {financialLeakage.suspicionLevel.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Repeat Spending:</span>
                <span className="font-medium">₹{financialLeakage.repeatSpendingAmount}L</span>
              </div>
              <div className="flex justify-between">
                <span>Flagged Transactions:</span>
                <span className="font-medium">{financialLeakage.flaggedTransactions}</span>
              </div>
            </div>
          </div>
        </MetricCard>

        {/* SLA Optimization */}
        <MetricCard
          icon={Clock}
          title="SLA Recommendation"
          iconColor="text-agent-tracking"
          bgColor="bg-agent-tracking/10"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Current</p>
                <span className="text-xl font-bold text-foreground">{slaOptimization.currentSLA}d</span>
              </div>
              <div className="text-2xl text-muted-foreground">→</div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Recommended</p>
                <span className={cn(
                  "text-xl font-bold",
                  slaOptimization.recommendedSLA < slaOptimization.currentSLA ? 'text-warning' : 'text-success'
                )}>{slaOptimization.recommendedSLA}d</span>
              </div>
            </div>
            <div className="flex gap-2">
              {slaOptimization.seasonalAdjustment && (
                <span className="px-2 py-0.5 bg-info/15 text-info text-xs rounded-full">Seasonal</span>
              )}
              {slaOptimization.emergencyOverride && (
                <span className="px-2 py-0.5 bg-destructive/15 text-destructive text-xs rounded-full">Emergency</span>
              )}
            </div>
          </div>
        </MetricCard>
      </div>

      {/* Extended Intelligence Mode Section */}
      <div className="bg-gradient-to-r from-primary/5 via-info/5 to-success/5 rounded-xl shadow-card overflow-hidden border border-primary/20">
        <button 
          onClick={() => setShowExtendedDetails(!showExtendedDetails)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent hover:from-primary/15 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="font-bold text-foreground">EXTENDED INTELLIGENCE MODE</h3>
            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium">8 Advanced Metrics</span>
          </div>
          {showExtendedDetails ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        
        {showExtendedDetails && (
          <div className="p-4 space-y-4">
            {/* Row 1: Age Debt & Accident Probability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExtendedMetricCard
                icon={Gauge}
                title="Pothole Age Debt"
                value={extendedIntelligence.potholeAgeDebt.score.toString()}
                unit="urgency points"
                status={extendedIntelligence.potholeAgeDebt.score >= 50 ? 'critical' : extendedIntelligence.potholeAgeDebt.score >= 30 ? 'warning' : 'ok'}
                subtitle={`${extendedIntelligence.potholeAgeDebt.daysOpen} days × ${extendedIntelligence.potholeAgeDebt.riskFactor} risk factor`}
                explanation={extendedIntelligence.potholeAgeDebt.citizenExplanation}
              />
              
              <ExtendedMetricCard
                icon={CarFront}
                title="Accident Probability (7-day)"
                value={`${extendedIntelligence.accidentProbability.percentage}%`}
                status={extendedIntelligence.accidentProbability.percentage >= 50 ? 'critical' : extendedIntelligence.accidentProbability.percentage >= 30 ? 'warning' : 'ok'}
                subtitle={`Confidence: ${extendedIntelligence.accidentProbability.confidenceLevel.toUpperCase()}`}
                explanation={extendedIntelligence.accidentProbability.citizenExplanation}
                factors={extendedIntelligence.accidentProbability.factors}
              />
            </div>
            
            {/* Row 2: Contractor Pattern & Repair Confidence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExtendedMetricCard
                icon={UserCheck}
                title="Contractor Behavioral Pattern"
                value={extendedIntelligence.contractorBehavioralPattern.pattern.toUpperCase()}
                status={
                  extendedIntelligence.contractorBehavioralPattern.pattern === 'problematic' ? 'critical' :
                  extendedIntelligence.contractorBehavioralPattern.pattern === 'declining' ? 'warning' :
                  extendedIntelligence.contractorBehavioralPattern.pattern === 'inconsistent' ? 'info' : 'ok'
                }
                subtitle={`Avg Response: ${extendedIntelligence.contractorBehavioralPattern.avgResponseDays.toFixed(1)} days • Quality: ${extendedIntelligence.contractorBehavioralPattern.qualityTrend}`}
                explanation={extendedIntelligence.contractorBehavioralPattern.citizenExplanation}
              />
              
              <ExtendedMetricCard
                icon={Target}
                title="Repair Confidence Level"
                value={extendedIntelligence.repairConfidenceLevel.level}
                unit={`(${extendedIntelligence.repairConfidenceLevel.score}/100)`}
                status={
                  extendedIntelligence.repairConfidenceLevel.level === 'Low' ? 'critical' :
                  extendedIntelligence.repairConfidenceLevel.level === 'Medium' ? 'warning' : 'ok'
                }
                explanation={extendedIntelligence.repairConfidenceLevel.citizenExplanation}
                factors={extendedIntelligence.repairConfidenceLevel.keyFactors}
              />
            </div>
            
            {/* Row 3: Repair Method & Department Responsibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExtendedMetricCard
                icon={Wrench}
                title="AI-Recommended Repair Method"
                value={extendedIntelligence.aiRecommendedRepairMethod.method.replace(/_/g, ' ').toUpperCase()}
                status="info"
                subtitle={`Est. Cost: ₹${extendedIntelligence.aiRecommendedRepairMethod.estimatedCost.toLocaleString('en-IN')} • Duration: ${extendedIntelligence.aiRecommendedRepairMethod.estimatedDuration}h`}
                explanation={extendedIntelligence.aiRecommendedRepairMethod.citizenExplanation}
                extraInfo={`Material: ${extendedIntelligence.aiRecommendedRepairMethod.materialRequired}`}
              />
              
              <ExtendedMetricCard
                icon={Building2}
                title="Inter-Department Responsibility"
                value={extendedIntelligence.interDepartmentResponsibility.coordinationLevel.toUpperCase()}
                status={
                  extendedIntelligence.interDepartmentResponsibility.coordinationLevel === 'complex' ? 'warning' :
                  extendedIntelligence.interDepartmentResponsibility.coordinationLevel === 'multi' ? 'info' : 'ok'
                }
                subtitle={extendedIntelligence.interDepartmentResponsibility.primaryDepartment}
                explanation={extendedIntelligence.interDepartmentResponsibility.citizenExplanation}
                factors={extendedIntelligence.interDepartmentResponsibility.supportingDepartments}
              />
            </div>
            
            {/* Row 4: Warranty & Civic Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExtendedMetricCard
                icon={BadgeCheck}
                title="Repair Warranty Confidence"
                value={`${extendedIntelligence.repairWarrantyConfidence.months} Months`}
                status={
                  extendedIntelligence.repairWarrantyConfidence.confidence === 'low' ? 'warning' :
                  extendedIntelligence.repairWarrantyConfidence.confidence === 'high' ? 'ok' : 'info'
                }
                subtitle={`Confidence: ${extendedIntelligence.repairWarrantyConfidence.confidence.toUpperCase()}`}
                explanation={extendedIntelligence.repairWarrantyConfidence.citizenExplanation}
                factors={extendedIntelligence.repairWarrantyConfidence.factors}
              />
              
              <ExtendedMetricCard
                icon={Activity}
                title="City-Level Civic Health Index"
                value={`Grade ${extendedIntelligence.cityLevelCivicHealthIndex.grade}`}
                unit={`(${extendedIntelligence.cityLevelCivicHealthIndex.score}/100)`}
                status={
                  extendedIntelligence.cityLevelCivicHealthIndex.grade === 'F' || extendedIntelligence.cityLevelCivicHealthIndex.grade === 'D' ? 'critical' :
                  extendedIntelligence.cityLevelCivicHealthIndex.grade === 'C' ? 'warning' : 'ok'
                }
                subtitle={`Infrastructure: ${extendedIntelligence.cityLevelCivicHealthIndex.infrastructureHealth}% • Response: ${extendedIntelligence.cityLevelCivicHealthIndex.responseEfficiency}%`}
                explanation={extendedIntelligence.cityLevelCivicHealthIndex.citizenExplanation}
              />
            </div>
          </div>
        )}
      </div>

      {/* AI Verdict Card */}
      <div className={cn(
        "rounded-xl shadow-card overflow-hidden border-2",
        aiVerdict.severity === 'critical' && 'border-destructive bg-destructive/5',
        aiVerdict.severity === 'urgent' && 'border-agent-alert bg-agent-alert/5',
        aiVerdict.severity === 'attention' && 'border-warning bg-warning/5',
        aiVerdict.severity === 'routine' && 'border-success bg-success/5'
      )}>
        <div className={cn(
          "px-4 py-3 flex items-center justify-between",
          aiVerdict.severity === 'critical' && 'bg-destructive/10',
          aiVerdict.severity === 'urgent' && 'bg-agent-alert/10',
          aiVerdict.severity === 'attention' && 'bg-warning/10',
          aiVerdict.severity === 'routine' && 'bg-success/10'
        )}>
          <div className="flex items-center gap-2">
            <Brain className={cn(
              "w-6 h-6",
              aiVerdict.severity === 'critical' && 'text-destructive',
              aiVerdict.severity === 'urgent' && 'text-agent-alert',
              aiVerdict.severity === 'attention' && 'text-warning',
              aiVerdict.severity === 'routine' && 'text-success'
            )} />
            <div>
              <h3 className="font-bold text-foreground">AI VERDICT: {aiVerdict.decision.replace('_', ' ').toUpperCase()}</h3>
              <p className="text-xs text-muted-foreground">
                Severity: {aiVerdict.severity.toUpperCase()} • Confidence: {aiVerdict.confidence}%
              </p>
            </div>
          </div>
          {aiVerdict.escalationLevel !== 'none' && (
            <span className={cn(
              "px-3 py-1 rounded-lg text-sm font-bold animate-pulse",
              aiVerdict.severity === 'critical' && 'bg-destructive text-destructive-foreground',
              aiVerdict.severity === 'urgent' && 'bg-agent-alert text-white',
              aiVerdict.severity === 'attention' && 'bg-warning text-warning-foreground'
            )}>
              Escalate to {aiVerdict.escalationLevel.toUpperCase()}
            </span>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-2">Reasoning:</h4>
            <ul className="space-y-1">
              {aiVerdict.reasoning.map((reason, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-2">Required Actions:</h4>
            <ul className="space-y-1">
              {aiVerdict.actions.map((action, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ 
  icon: Icon, 
  title, 
  children, 
  iconColor, 
  bgColor 
}: { 
  icon: typeof Clock; 
  title: string; 
  children: React.ReactNode;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <div className="bg-card rounded-xl shadow-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("p-1.5 rounded-lg", bgColor)}>
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
        <h4 className="font-medium text-foreground text-sm">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function ExtendedMetricCard({ 
  icon: Icon, 
  title, 
  value,
  unit,
  status,
  subtitle,
  explanation,
  factors,
  extraInfo
}: { 
  icon: typeof Clock; 
  title: string; 
  value: string;
  unit?: string;
  status: 'ok' | 'warning' | 'critical' | 'info';
  subtitle?: string;
  explanation: string;
  factors?: string[];
  extraInfo?: string;
}) {
  const statusColors = {
    ok: 'border-success/50 bg-success/5',
    warning: 'border-warning/50 bg-warning/5',
    critical: 'border-destructive/50 bg-destructive/5',
    info: 'border-info/50 bg-info/5'
  };
  
  const valueColors = {
    ok: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
    info: 'text-info'
  };

  return (
    <div className={cn("rounded-lg border p-4 space-y-2", statusColors[status])}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-5 h-5", valueColors[status])} />
          <h5 className="font-medium text-foreground text-sm">{title}</h5>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-sm">{explanation}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={cn("text-xl font-bold", valueColors[status])}>{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
      
      {factors && factors.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {factors.slice(0, 3).map((factor, i) => (
            <span key={i} className="px-2 py-0.5 bg-muted/50 text-muted-foreground text-xs rounded-full">
              {factor}
            </span>
          ))}
          {factors.length > 3 && (
            <span className="px-2 py-0.5 bg-muted/50 text-muted-foreground text-xs rounded-full">
              +{factors.length - 3} more
            </span>
          )}
        </div>
      )}
      
      {extraInfo && (
        <p className="text-xs text-muted-foreground italic">{extraInfo}</p>
      )}
      
      {/* Citizen-friendly explanation */}
      <p className="text-xs text-muted-foreground pt-2 border-t border-border/50 mt-2">
        💡 {explanation}
      </p>
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: 'success' | 'warning' | 'danger' }) {
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div 
        className={cn(
          "h-full transition-all duration-500",
          color === 'success' && 'bg-success',
          color === 'warning' && 'bg-warning',
          color === 'danger' && 'bg-destructive'
        )}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

function TrendIndicator({ trend }: { trend: 'improving' | 'stable' | 'declining' }) {
  const Icon = trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : Minus;
  const color = trend === 'improving' ? 'text-success' : trend === 'declining' ? 'text-destructive' : 'text-muted-foreground';
  
  return (
    <div className={cn("flex items-center gap-1", color)}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium capitalize">{trend}</span>
    </div>
  );
}
