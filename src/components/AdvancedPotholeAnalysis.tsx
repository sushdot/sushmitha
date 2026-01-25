import { cn } from '@/lib/utils';
import { AdvancedPotholeAnalysis as AdvancedAnalysisType } from '@/types/roadGuardianX';
import { 
  Shield, Clock, Users, AlertTriangle, Banknote, Brain, 
  TrendingUp, TrendingDown, Minus, Calendar, MapPin, Target
} from 'lucide-react';
import { format } from 'date-fns';

interface AdvancedPotholeAnalysisProps {
  analysis: AdvancedAnalysisType;
}

export function AdvancedPotholeAnalysisDashboard({ analysis }: AdvancedPotholeAnalysisProps) {
  const { 
    digitalIdentity, 
    durabilityPrediction, 
    blacklistAssessment, 
    citizenTrustIndex, 
    criticalityScore,
    slaOptimization,
    financialLeakage,
    aiVerdict 
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
