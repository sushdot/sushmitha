import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Construction, Factory, AlertTriangle, CheckCircle } from 'lucide-react';
import { Pothole, Supplier, INDIAN_STATES } from '@/types/bharatGuardian';

interface IndiaMapProps {
  potholes: Pothole[];
  suppliers: Supplier[];
  selectedProject: 'road_guardian' | 'phantom_x';
}

// State coordinates for positioning markers (approximate positions on the map grid)
const statePositions: Record<string, { x: number; y: number }> = {
  'Maharashtra': { x: 30, y: 55 },
  'Karnataka': { x: 28, y: 68 },
  'Tamil Nadu': { x: 32, y: 78 },
  'Kerala': { x: 26, y: 80 },
  'Andhra Pradesh': { x: 35, y: 65 },
  'Telangana': { x: 34, y: 58 },
  'Gujarat': { x: 22, y: 45 },
  'Rajasthan': { x: 25, y: 32 },
  'Madhya Pradesh': { x: 35, y: 45 },
  'Uttar Pradesh': { x: 42, y: 35 },
  'Bihar': { x: 52, y: 38 },
  'West Bengal': { x: 58, y: 45 },
  'Odisha': { x: 52, y: 52 },
  'Jharkhand': { x: 52, y: 45 },
  'Chhattisgarh': { x: 45, y: 52 },
  'Punjab': { x: 30, y: 22 },
  'Haryana': { x: 32, y: 28 },
  'Delhi': { x: 35, y: 28 },
  'Uttarakhand': { x: 38, y: 22 },
  'Himachal Pradesh': { x: 34, y: 18 },
  'Jammu & Kashmir': { x: 30, y: 12 },
  'Assam': { x: 72, y: 35 },
  'Meghalaya': { x: 70, y: 38 },
  'Tripura': { x: 72, y: 42 },
  'Manipur': { x: 76, y: 38 },
  'Mizoram': { x: 74, y: 42 },
  'Nagaland': { x: 76, y: 34 },
  'Arunachal Pradesh': { x: 76, y: 28 },
  'Sikkim': { x: 62, y: 32 },
  'Goa': { x: 24, y: 65 },
};

interface StateData {
  potholeCount: number;
  supplierCount: number;
  criticalCount: number;
  healthyCount: number;
}

export function IndiaMap({ potholes, suppliers, selectedProject }: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Aggregate data by state
  const stateData: Record<string, StateData> = {};
  
  INDIAN_STATES.forEach(state => {
    const statePotholes = potholes.filter(p => p.state === state);
    const stateSuppliers = suppliers.filter(s => s.state === state);
    
    stateData[state] = {
      potholeCount: statePotholes.length,
      supplierCount: stateSuppliers.length,
      criticalCount: selectedProject === 'road_guardian' 
        ? statePotholes.filter(p => p.slaStatus === 'breached').length
        : stateSuppliers.filter(s => s.disruptionRisk === 'critical' || s.disruptionRisk === 'high').length,
      healthyCount: selectedProject === 'road_guardian'
        ? statePotholes.filter(p => p.status === 'repaired' || p.status === 'closed').length
        : stateSuppliers.filter(s => s.status === 'active').length,
    };
  });

  const getMarkerColor = (state: string) => {
    const data = stateData[state];
    if (!data) return 'bg-muted';
    
    const count = selectedProject === 'road_guardian' ? data.potholeCount : data.supplierCount;
    if (count === 0) return 'bg-muted/50';
    if (data.criticalCount > 0) return 'bg-destructive';
    if (data.healthyCount === count) return 'bg-success';
    return 'bg-warning';
  };

  const getMarkerSize = (state: string) => {
    const data = stateData[state];
    if (!data) return 'w-3 h-3';
    
    const count = selectedProject === 'road_guardian' ? data.potholeCount : data.supplierCount;
    if (count === 0) return 'w-2 h-2';
    if (count >= 3) return 'w-5 h-5';
    if (count >= 1) return 'w-4 h-4';
    return 'w-3 h-3';
  };

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">India Coverage Map</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Critical</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Stylized India Map */}
        <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-muted/30 to-muted/10 rounded-lg border border-border overflow-hidden">
          {/* India outline (simplified SVG path) */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.15 }}
          >
            <path
              d="M25 8 L35 5 L45 8 L55 5 L65 10 L75 15 L80 25 L78 35 L82 40 L80 50 L75 55 L78 65 L72 75 L65 80 L55 85 L45 90 L35 88 L28 82 L22 75 L18 65 L20 55 L18 45 L22 35 L20 25 L25 15 Z"
              fill="currentColor"
              className="text-primary"
            />
          </svg>
          
          {/* State markers */}
          {Object.entries(statePositions).map(([state, pos]) => {
            const data = stateData[state];
            const hasData = data && (selectedProject === 'road_guardian' ? data.potholeCount > 0 : data.supplierCount > 0);
            
            return (
              <div
                key={state}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
              >
                <div className={cn(
                  "rounded-full transition-all duration-200",
                  getMarkerColor(state),
                  getMarkerSize(state),
                  hasData && "animate-pulse shadow-lg",
                  hoveredState === state && "scale-150 ring-2 ring-primary ring-offset-2"
                )} />
                
                {/* Tooltip */}
                {hoveredState === state && data && (
                  <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
                    <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border border-border text-xs">
                      <div className="font-semibold mb-1">{state}</div>
                      {selectedProject === 'road_guardian' ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Construction className="w-3 h-3" />
                            <span>{data.potholeCount} Potholes</span>
                          </div>
                          {data.criticalCount > 0 && (
                            <div className="flex items-center gap-1 text-destructive">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{data.criticalCount} Breached</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1">
                            <Factory className="w-3 h-3" />
                            <span>{data.supplierCount} Suppliers</span>
                          </div>
                          {data.criticalCount > 0 && (
                            <div className="flex items-center gap-1 text-destructive">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{data.criticalCount} At Risk</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover" />
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Map title overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              🇮🇳 BHARAT-GUARDIAN National Coverage
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedProject === 'road_guardian' 
                ? `${potholes.length} Active Cases`
                : `${suppliers.length} Tracked Suppliers`
              }
            </div>
          </div>
        </div>
        
        {/* State summary grid */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {INDIAN_STATES.filter(state => {
            const data = stateData[state];
            return data && (selectedProject === 'road_guardian' ? data.potholeCount > 0 : data.supplierCount > 0);
          }).slice(0, 8).map(state => {
            const data = stateData[state];
            return (
              <div 
                key={state}
                className="p-2 bg-muted/50 rounded-lg border border-border text-xs"
              >
                <div className="font-medium text-foreground truncate">{state}</div>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  {selectedProject === 'road_guardian' ? (
                    <>
                      <span>{data.potholeCount} cases</span>
                      {data.criticalCount > 0 && (
                        <span className="text-destructive">• {data.criticalCount} critical</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span>{data.supplierCount} suppliers</span>
                      {data.criticalCount > 0 && (
                        <span className="text-destructive">• {data.criticalCount} at risk</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
