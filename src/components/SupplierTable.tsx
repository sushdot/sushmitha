import { Supplier } from '@/types/bharatGuardian';
import { Factory, MapPin, Package, AlertTriangle, TrendingDown } from 'lucide-react';

interface SupplierTableProps {
  suppliers: Supplier[];
}

const tierLabels: Record<string, string> = {
  'tier_1': 'Tier 1',
  'tier_2': 'Tier 2',
  'tier_3': 'Tier 3'
};

const statusColors: Record<string, string> = {
  'active': 'bg-success/10 text-success border-success/30',
  'at_risk': 'bg-warning/10 text-warning border-warning/30',
  'disrupted': 'bg-destructive/10 text-destructive border-destructive/30',
  'resolved': 'bg-info/10 text-info border-info/30',
  'blacklisted': 'bg-muted text-muted-foreground border-muted'
};

const riskColors: Record<string, string> = {
  'low': 'text-success',
  'medium': 'text-warning',
  'high': 'text-orange-500',
  'critical': 'text-destructive'
};

export function SupplierTable({ suppliers }: SupplierTableProps) {
  if (suppliers.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-card p-8 text-center animate-fade-in">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <h3 className="font-semibold text-foreground">No Suppliers Tracked</h3>
        <p className="text-sm text-muted-foreground mt-1">Submit supplier data to begin PHANTOM-X analysis</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-agent-detection/10 to-transparent">
        <div className="flex items-center gap-2">
          <Factory className="w-5 h-5 text-agent-detection" />
          <h3 className="font-semibold text-foreground">Supplier Lifecycle Tracker</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Real-time visibility across Make-in-India supply chain</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr className="bg-muted/50">
              <th>Supplier ID</th>
              <th>Name / Location</th>
              <th>Tier</th>
              <th>Reported vs Actual</th>
              <th>Phantom %</th>
              <th>Risk Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr 
                key={supplier.id} 
                className="hover:bg-muted/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td>
                  <span className="font-mono text-sm font-medium text-agent-detection">
                    {supplier.id}
                  </span>
                </td>
                <td>
                  <div className="flex items-start gap-2">
                    <Factory className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">{supplier.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {supplier.city}, {supplier.state}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                    {tierLabels[supplier.tier]}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {supplier.reportedStock.toLocaleString()}
                    </span>
                    {supplier.actualStock !== undefined && (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <span className={`font-mono text-sm ${supplier.actualStock < supplier.reportedStock ? 'text-destructive' : 'text-success'}`}>
                          {supplier.actualStock.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    {supplier.phantomStockPercentage > 0 && (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`font-mono font-medium ${supplier.phantomStockPercentage > 20 ? 'text-destructive' : supplier.phantomStockPercentage > 10 ? 'text-warning' : 'text-foreground'}`}>
                      {supplier.phantomStockPercentage.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td>
                  <div className={`flex items-center gap-1 ${riskColors[supplier.disruptionRisk]}`}>
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">{supplier.disruptionRisk}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge border ${statusColors[supplier.status]}`}>
                    {supplier.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
