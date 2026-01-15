import { useState } from 'react';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { ProjectSelector } from '@/components/ProjectSelector';
import { PotholeForm } from '@/components/PotholeForm';
import { SupplierForm } from '@/components/SupplierForm';
import { AgentCard } from '@/components/AgentCard';
import { PotholeTable } from '@/components/PotholeTable';
import { SupplierTable } from '@/components/SupplierTable';
import { ContractorScorecard } from '@/components/ContractorScorecard';
import { SupplierScorecard } from '@/components/SupplierScorecard';
import { Timeline } from '@/components/Timeline';
import { AlertPanel } from '@/components/AlertPanel';
import { analyzeWithRoadGuardian, analyzeWithPhantomX } from '@/lib/bharatGuardianEngine';
import { 
  ProjectType, Pothole, Supplier, AgentAnalysis, TimelineEvent, Alert, 
  ContractorScore, SupplierScore, INDIAN_STATES, INDIAN_CITIES, INDIAN_CONTRACTORS 
} from '@/types/bharatGuardian';
import { 
  AlertTriangle, CheckCircle, Clock, Construction, Shield, TrendingUp,
  Package, Factory, MapPin
} from 'lucide-react';

// Demo data
const initialPotholes: Pothole[] = [
  {
    id: 'PH-MH-MUM-0142',
    location: 'Western Express Highway, Andheri',
    city: 'Mumbai',
    state: 'Maharashtra',
    dateReported: new Date('2024-01-10'),
    contractor: 'Larsen & Toubro Infrastructure',
    expectedSLA: 7,
    status: 'in_progress',
    previousRepairs: false,
    daysOpen: 4,
    slaStatus: 'on_track'
  },
  {
    id: 'PH-KA-BLR-0089',
    location: 'Outer Ring Road, Marathahalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    dateReported: new Date('2024-01-08'),
    contractor: 'NHAI Road Works Division',
    expectedSLA: 7,
    status: 'repaired',
    previousRepairs: true,
    daysSinceLastRepair: 180,
    daysOpen: 6,
    slaStatus: 'on_track'
  },
  {
    id: 'PH-DL-NDL-0201',
    location: 'Ring Road, ITO Junction',
    city: 'New Delhi',
    state: 'Delhi',
    dateReported: new Date('2024-01-02'),
    contractor: 'Municipal Corporation Works',
    expectedSLA: 7,
    status: 'assigned',
    previousRepairs: false,
    daysOpen: 12,
    slaStatus: 'breached'
  }
];

const initialSuppliers: Supplier[] = [
  {
    id: 'SUP-MH-0001',
    name: 'Tata Steel Ltd.',
    tier: 'tier_1',
    city: 'Mumbai',
    state: 'Maharashtra',
    reportedStock: 50000,
    actualStock: 48500,
    phantomStockPercentage: 3,
    productionCapacity: 5000,
    currentUtilization: 82,
    leadTimeDays: 5,
    status: 'active',
    lastAuditDate: new Date('2024-01-05'),
    disruptionRisk: 'low',
    regionalFactors: []
  },
  {
    id: 'SUP-GJ-0015',
    name: 'Vedanta Aluminium',
    tier: 'tier_2',
    city: 'Ahmedabad',
    state: 'Gujarat',
    reportedStock: 25000,
    actualStock: 18000,
    phantomStockPercentage: 28,
    productionCapacity: 2000,
    currentUtilization: 96,
    leadTimeDays: 12,
    status: 'at_risk',
    lastAuditDate: new Date('2024-01-08'),
    disruptionRisk: 'critical',
    regionalFactors: ['logistics_delay', 'power_shortage']
  }
];

export default function Index() {
  const [selectedProject, setSelectedProject] = useState<ProjectType>('road_guardian');
  const [potholes, setPotholes] = useState<Pothole[]>(initialPotholes);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [agentAnalyses, setAgentAnalyses] = useState<AgentAnalysis[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastContractorScore, setLastContractorScore] = useState<ContractorScore | null>(null);
  const [lastSupplierScore, setLastSupplierScore] = useState<SupplierScore | null>(null);
  const [analyzedEntity, setAnalyzedEntity] = useState<string | null>(null);

  const handleRoadFormSubmit = (formData: any) => {
    const result = analyzeWithRoadGuardian(formData, potholes);
    setAgentAnalyses(result.agentAnalyses);
    setTimeline(result.timeline);
    setAlerts(result.alerts);
    setLastContractorScore(result.contractorScore);
    setAnalyzedEntity(result.pothole.id);
    if (!potholes.find(p => p.id === result.pothole.id)) {
      setPotholes([result.pothole, ...potholes]);
    }
  };

  const handleSupplierFormSubmit = (formData: any) => {
    const result = analyzeWithPhantomX(formData, suppliers);
    setAgentAnalyses(result.agentAnalyses);
    setTimeline(result.timeline);
    setAlerts(result.alerts);
    setLastSupplierScore(result.supplierScore);
    setAnalyzedEntity(result.supplier.id);
    if (!suppliers.find(s => s.id === result.supplier.id)) {
      setSuppliers([result.supplier, ...suppliers]);
    }
  };

  // Metrics based on selected project
  const isRoad = selectedProject === 'road_guardian';
  const totalEntities = isRoad ? potholes.length : suppliers.length;
  const completedCount = isRoad 
    ? potholes.filter(p => p.status === 'repaired' || p.status === 'closed').length
    : suppliers.filter(s => s.status === 'active').length;
  const criticalCount = isRoad 
    ? potholes.filter(p => p.slaStatus === 'breached').length
    : suppliers.filter(s => s.disruptionRisk === 'critical' || s.disruptionRisk === 'high').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title={isRoad ? "Active Potholes" : "Tracked Suppliers"}
            value={totalEntities}
            subtitle="Across India"
            icon={isRoad ? Construction : Factory}
            variant="default"
          />
          <MetricCard
            title={isRoad ? "Repairs Completed" : "Active Suppliers"}
            value={completedCount}
            subtitle={`${Math.round((completedCount / totalEntities) * 100)}% healthy`}
            icon={CheckCircle}
            trend={{ value: 12, isPositive: true }}
            variant="success"
          />
          <MetricCard
            title={isRoad ? "SLA Breaches" : "High Risk Suppliers"}
            value={criticalCount}
            subtitle="Require attention"
            icon={AlertTriangle}
            variant={criticalCount > 0 ? 'danger' : 'default'}
          />
          <MetricCard
            title="States Covered"
            value="18+"
            subtitle="Pan-India network"
            icon={MapPin}
            variant="default"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <ProjectSelector selectedProject={selectedProject} onProjectChange={setSelectedProject} />
            
            {isRoad ? (
              <PotholeForm onSubmit={handleRoadFormSubmit} />
            ) : (
              <SupplierForm onSubmit={handleSupplierFormSubmit} />
            )}
            
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
          
          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <AlertPanel alerts={alerts} />
            
            {timeline.length > 0 && analyzedEntity && (
              <Timeline events={timeline} potholeId={analyzedEntity} />
            )}
            
            {isRoad ? (
              <>
                {lastContractorScore && <ContractorScorecard contractors={[lastContractorScore]} />}
                <PotholeTable potholes={potholes} />
              </>
            ) : (
              <>
                {lastSupplierScore && <SupplierScorecard suppliers={[lastSupplierScore]} />}
                <SupplierTable suppliers={suppliers} />
              </>
            )}
          </div>
        </div>
        
        {/* Final Message */}
        {analyzedEntity && (
          <div className="mt-8 p-6 bg-primary text-primary-foreground rounded-xl shadow-card animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-foreground/10 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">BHARAT-GUARDIAN Analysis Complete</h3>
                <p className="mt-2 text-primary-foreground/80">
                  Entity <span className="font-mono font-bold">{analyzedEntity}</span> has been fully analyzed by {agentAnalyses.length} AI agents.
                  {isRoad ? ' Municipal authorities and contractors notified via CPGRAMS.' : ' Procurement and operations teams notified.'}
                </p>
                <p className="mt-2 text-sm text-primary-foreground/60">
                  {isRoad 
                    ? 'Citizens can track progress in real-time. Contractor accountability monitored 24/7 across India.'
                    : 'Make-in-India supply chain resilience maintained. Real-time supplier monitoring active.'}
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
              <span className="font-semibold text-foreground">BHARAT-GUARDIAN</span>
              <span className="text-muted-foreground text-sm">• National Agentic AI Platform</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Ensuring infrastructure accountability and supply chain resilience across India through AI-powered governance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
