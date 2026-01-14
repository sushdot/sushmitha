import { useState } from 'react';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { PotholeForm } from '@/components/PotholeForm';
import { AgentCard } from '@/components/AgentCard';
import { PotholeTable } from '@/components/PotholeTable';
import { ContractorScorecard } from '@/components/ContractorScorecard';
import { Timeline } from '@/components/Timeline';
import { AlertPanel } from '@/components/AlertPanel';
import { analyzeWithROADGUARDIAN } from '@/lib/roadGuardianEngine';
import { Pothole, AgentAnalysis, TimelineEvent, Alert, ContractorScore } from '@/types/pothole';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Construction,
  Shield,
  TrendingUp
} from 'lucide-react';

// Demo data for initial display
const initialPotholes: Pothole[] = [
  {
    id: 'PH-2024-142',
    location: 'Main Street & 5th Ave',
    dateReported: new Date('2024-01-10'),
    contractor: 'Metro Roads Ltd.',
    expectedSLA: 7,
    status: 'in_progress',
    previousRepairs: false,
    daysOpen: 4,
    slaStatus: 'on_track'
  },
  {
    id: 'PH-2024-138',
    location: 'Oak Boulevard North',
    dateReported: new Date('2024-01-08'),
    contractor: 'RoadWorks Pro Inc.',
    expectedSLA: 7,
    status: 'repaired',
    previousRepairs: true,
    daysSinceLastRepair: 180,
    daysOpen: 6,
    slaStatus: 'on_track'
  },
  {
    id: 'PH-2024-155',
    location: 'Industrial Park Rd',
    dateReported: new Date('2024-01-02'),
    contractor: 'QuickFix Contractors',
    expectedSLA: 7,
    status: 'assigned',
    previousRepairs: false,
    daysOpen: 12,
    slaStatus: 'breached'
  }
];

const initialContractors: ContractorScore[] = [
  { name: 'Metro Roads Ltd.', score: 91, avgResponseTime: 12, avgCompletionTime: 3, repeatOccurrence: 3, totalAssigned: 203, completed: 198 },
  { name: 'RoadWorks Pro Inc.', score: 87, avgResponseTime: 18, avgCompletionTime: 4, repeatOccurrence: 5, totalAssigned: 145, completed: 138 },
  { name: 'QuickFix Contractors', score: 54, avgResponseTime: 48, avgCompletionTime: 8, repeatOccurrence: 22, totalAssigned: 67, completed: 45 },
];

export default function Index() {
  const [potholes, setPotholes] = useState<Pothole[]>(initialPotholes);
  const [contractors] = useState<ContractorScore[]>(initialContractors);
  const [agentAnalyses, setAgentAnalyses] = useState<AgentAnalysis[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [analyzedPothole, setAnalyzedPothole] = useState<Pothole | null>(null);
  const [lastContractorScore, setLastContractorScore] = useState<ContractorScore | null>(null);

  const handleFormSubmit = (formData: any) => {
    const result = analyzeWithROADGUARDIAN(formData, potholes);
    
    // Update state with analysis results
    setAgentAnalyses(result.agentAnalyses);
    setTimeline(result.timeline);
    setAlerts(result.alerts);
    setAnalyzedPothole(result.pothole);
    setLastContractorScore(result.contractorScore);
    
    // Add to potholes list if new
    if (!potholes.find(p => p.id === result.pothole.id)) {
      setPotholes([result.pothole, ...potholes]);
    }
  };

  // Calculate metrics
  const totalPotholes = potholes.length;
  const repairedCount = potholes.filter(p => p.status === 'repaired' || p.status === 'closed').length;
  const breachedCount = potholes.filter(p => p.slaStatus === 'breached').length;
  const avgDaysOpen = Math.round(potholes.reduce((sum, p) => sum + p.daysOpen, 0) / totalPotholes);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Potholes"
            value={totalPotholes}
            subtitle="Tracked in system"
            icon={Construction}
            variant="default"
          />
          <MetricCard
            title="Repairs Completed"
            value={repairedCount}
            subtitle={`${Math.round((repairedCount / totalPotholes) * 100)}% success rate`}
            icon={CheckCircle}
            trend={{ value: 12, isPositive: true }}
            variant="success"
          />
          <MetricCard
            title="SLA Breaches"
            value={breachedCount}
            subtitle="Require attention"
            icon={AlertTriangle}
            variant={breachedCount > 0 ? 'danger' : 'default'}
          />
          <MetricCard
            title="Avg. Resolution"
            value={`${avgDaysOpen}d`}
            subtitle="Days to repair"
            icon={Clock}
            trend={{ value: 8, isPositive: true }}
            variant="default"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form & Agents */}
          <div className="lg:col-span-1 space-y-6">
            <PotholeForm onSubmit={handleFormSubmit} />
            
            {/* Agent Analysis Results */}
            {agentAnalyses.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Agent Analysis</h2>
                </div>
                {agentAnalyses.map((analysis, index) => (
                  <AgentCard key={index} analysis={analysis} />
                ))}
              </div>
            )}
          </div>
          
          {/* Right Column - Data & Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts */}
            <AlertPanel alerts={alerts} />
            
            {/* Timeline */}
            {timeline.length > 0 && analyzedPothole && (
              <Timeline events={timeline} potholeId={analyzedPothole.id} />
            )}
            
            {/* Contractor Scorecard */}
            {lastContractorScore ? (
              <ContractorScorecard contractors={[lastContractorScore]} />
            ) : (
              <ContractorScorecard contractors={contractors} />
            )}
            
            {/* Pothole Table */}
            <PotholeTable potholes={potholes} />
          </div>
        </div>
        
        {/* Final Message */}
        {analyzedPothole && (
          <div className="mt-8 p-6 bg-primary text-primary-foreground rounded-xl shadow-card animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-foreground/10 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">ROAD-GUARDIAN Analysis Complete</h3>
                <p className="mt-2 text-primary-foreground/80">
                  Pothole <span className="font-mono font-bold">{analyzedPothole.id}</span> at {analyzedPothole.location} has been 
                  fully analyzed. All 6 AI agents have processed the data. 
                  {analyzedPothole.slaStatus === 'breached' 
                    ? ' ⚠️ Immediate action required due to SLA breach.' 
                    : analyzedPothole.slaStatus === 'at_risk'
                    ? ' ⏳ Monitoring closely as SLA deadline approaches.'
                    : ' ✅ All metrics within acceptable parameters.'}
                </p>
                <p className="mt-2 text-sm text-primary-foreground/60">
                  Citizens can track progress in real-time. Contractor accountability is being monitored 24/7.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">ROAD-GUARDIAN</span>
              <span className="text-muted-foreground text-sm">• Agentic AI Platform</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Ensuring road safety, contractor accountability, and public transparency through AI-powered infrastructure management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
