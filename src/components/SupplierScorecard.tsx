import { SupplierScore } from '@/types/bharatGuardian';
import { TrendingUp, TrendingDown, Clock, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SupplierScorecardProps {
  suppliers: SupplierScore[];
}

export function SupplierScorecard({ suppliers }: SupplierScorecardProps) {
  if (suppliers.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-agent-detection/10 to-transparent">
        <h3 className="font-semibold text-foreground">Supplier Performance Scorecard</h3>
        <p className="text-sm text-muted-foreground mt-1">AI-powered supplier reliability assessment</p>
      </div>
      
      <div className="p-6 space-y-6">
        {suppliers.map((supplier, index) => {
          const scoreColor = supplier.score >= 80 ? 'success' : supplier.score >= 60 ? 'warning' : 'destructive';
          const ScoreIcon = supplier.score >= 60 ? TrendingUp : TrendingDown;
          
          return (
            <div 
              key={supplier.name}
              className="p-5 border border-border rounded-xl hover:shadow-md transition-all animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-lg text-foreground">{supplier.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {supplier.fulfilledOrders} of {supplier.totalOrders} orders fulfilled
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-${scoreColor}/10`}>
                  <ScoreIcon className={`w-5 h-5 text-${scoreColor}`} />
                  <span className={`text-2xl font-bold text-${scoreColor}`}>{supplier.score}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Reliability Score</span>
                  <span className="font-medium">{supplier.score}%</span>
                </div>
                <Progress value={supplier.score} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <div>
                    <div className="text-lg font-semibold text-foreground">{supplier.accuracyRate}%</div>
                    <div className="text-xs text-muted-foreground">Stock Accuracy</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-4 h-4 text-info" />
                  <div>
                    <div className="text-lg font-semibold text-foreground">{supplier.deliveryOnTime}%</div>
                    <div className="text-xs text-muted-foreground">On-Time Delivery</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <div>
                    <div className="text-lg font-semibold text-foreground">{supplier.phantomStockIncidents}</div>
                    <div className="text-xs text-muted-foreground">Phantom Incidents</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Package className="w-4 h-4 text-agent-detection" />
                  <div>
                    <div className="text-lg font-semibold text-foreground">{supplier.totalOrders}</div>
                    <div className="text-xs text-muted-foreground">Total Orders</div>
                  </div>
                </div>
              </div>
              
              {supplier.score < 60 && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ Supplier requires immediate review due to low reliability score
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
