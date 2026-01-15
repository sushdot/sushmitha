import { useState } from 'react';
import { ProjectType, ProjectConfig } from '@/types/bharatGuardian';
import { 
  Construction, 
  PackageSearch, 
  Droplets, 
  Zap, 
  Trash2,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface ProjectSelectorProps {
  selectedProject: ProjectType;
  onProjectChange: (project: ProjectType) => void;
}

const projects: ProjectConfig[] = [
  {
    id: 'road_guardian',
    name: 'ROAD-GUARDIAN',
    fullName: 'Urban Road Infrastructure',
    description: 'Pothole tracking, repair accountability, contractor scoring across Indian cities',
    icon: 'construction',
    color: 'agent-tracking',
    agentCount: 6,
    isActive: true
  },
  {
    id: 'phantom_x',
    name: 'PHANTOM-X',
    fullName: 'Supply Chain Intelligence',
    description: 'Phantom stock detection, supplier risk prediction, Make-in-India resilience',
    icon: 'package',
    color: 'agent-detection',
    agentCount: 7,
    isActive: true
  },
  {
    id: 'water_monitoring',
    name: 'WATER-WATCH',
    fullName: 'Water Pipeline Monitoring',
    description: 'Leak detection, pressure monitoring, water theft prevention',
    icon: 'droplets',
    color: 'info',
    agentCount: 5,
    isActive: false
  },
  {
    id: 'power_outage',
    name: 'POWER-GRID',
    fullName: 'Power Outage Accountability',
    description: 'Outage tracking, DISCOM performance, restoration monitoring',
    icon: 'zap',
    color: 'warning',
    agentCount: 5,
    isActive: false
  },
  {
    id: 'waste_collection',
    name: 'SWACHH-TRACK',
    fullName: 'Waste Collection Tracking',
    description: 'Collection route monitoring, vehicle tracking, civic compliance',
    icon: 'trash',
    color: 'success',
    agentCount: 4,
    isActive: false
  }
];

const IconMap: Record<string, React.ElementType> = {
  construction: Construction,
  package: PackageSearch,
  droplets: Droplets,
  zap: Zap,
  trash: Trash2
};

export function ProjectSelector({ selectedProject, onProjectChange }: ProjectSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <h3 className="text-lg font-semibold text-foreground">Select Project Module</h3>
        <p className="text-sm text-muted-foreground mt-1">Choose the infrastructure system to analyze</p>
      </div>
      
      <div className="p-4 space-y-2">
        {projects.map((project) => {
          const Icon = IconMap[project.icon];
          const isSelected = selectedProject === project.id;
          const isHidden = !project.isActive && !isExpanded;
          
          if (isHidden) return null;
          
          return (
            <button
              key={project.id}
              onClick={() => project.isActive && onProjectChange(project.id)}
              disabled={!project.isActive}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : project.isActive 
                    ? 'border-border hover:border-primary/50 hover:bg-muted/50' 
                    : 'border-border/50 bg-muted/30 opacity-60 cursor-not-allowed'}
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  p-3 rounded-lg
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{project.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    {!project.isActive && (
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{project.fullName}</p>
                  <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-medium text-primary">
                      {project.agentCount} AI Agents
                    </span>
                    {project.isActive && (
                      <span className="text-xs text-success flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
                
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isSelected ? 'rotate-90' : ''}`} />
              </div>
            </button>
          );
        })}
        
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <span>Show upcoming modules ({projects.filter(p => !p.isActive).length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
