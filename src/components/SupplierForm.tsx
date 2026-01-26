import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INDIAN_STATES, INDIAN_CITIES, INDIAN_SUPPLIERS, SupplierStatus } from '@/types/bharatGuardian';
import { Send, Package, MapPin, Factory, AlertTriangle, BarChart3, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SupplierFormData {
  supplierId: string;
  supplierName: string;
  tier: 'tier_1' | 'tier_2' | 'tier_3';
  state: string;
  city: string;
  reportedStock: number;
  actualStock?: number;
  productionCapacity: number;
  currentUtilization: number;
  leadTimeDays: number;
  status: SupplierStatus;
  lastAuditDate: string;
}

interface SupplierFormProps {
  onSubmit: (data: SupplierFormData) => void;
}

const tierOptions = [
  { value: 'tier_1', label: 'Tier 1 - Direct Supplier' },
  { value: 'tier_2', label: 'Tier 2 - Secondary Supplier' },
  { value: 'tier_3', label: 'Tier 3 - Raw Material' }
];

const statusOptions: { value: SupplierStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'at_risk', label: 'At Risk' },
  { value: 'disrupted', label: 'Disrupted' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'blacklisted', label: 'Blacklisted' }
];

export function SupplierForm({ onSubmit }: SupplierFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const cities = selectedState ? INDIAN_CITIES[selectedState] || [] : [];

  const [formData, setFormData] = useState<SupplierFormData>({
    supplierId: '',
    supplierName: '',
    tier: 'tier_1',
    state: '',
    city: '',
    reportedStock: 0,
    actualStock: undefined,
    productionCapacity: 100,
    currentUtilization: 75,
    leadTimeDays: 7,
    status: 'active',
    lastAuditDate: new Date().toISOString().split('T')[0]
  });

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setFormData({ ...formData, state, city: '' });
  };

  const generateSupplierId = () => {
    const stateCode = formData.state.substring(0, 2).toUpperCase();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `SUP-${stateCode}-${random}`;
  };

  const calculatePhantomStockPercentage = (reported: number, actual?: number) => {
    if (!actual || actual >= reported) return 0;
    return Math.round(((reported - actual) / reported) * 100);
  };

  const calculateDisruptionRisk = (phantomPercentage: number, utilization: number, status: SupplierStatus): 'low' | 'medium' | 'high' | 'critical' => {
    if (status === 'disrupted' || status === 'blacklisted') return 'critical';
    if (phantomPercentage > 25 || utilization > 95) return 'critical';
    if (phantomPercentage > 15 || utilization > 85) return 'high';
    if (phantomPercentage > 5 || utilization > 75) return 'medium';
    return 'low';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to add supplier data');
      return;
    }

    if (!formData.state || !formData.city || !formData.supplierName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const supplierId = formData.supplierId || generateSupplierId();
      const phantomPercentage = calculatePhantomStockPercentage(formData.reportedStock, formData.actualStock);
      const disruptionRisk = calculateDisruptionRisk(phantomPercentage, formData.currentUtilization, formData.status);

      const { error } = await supabase.from('suppliers').insert({
        supplier_id: supplierId,
        name: formData.supplierName,
        tier: formData.tier,
        city: formData.city,
        state: formData.state,
        reported_stock: formData.reportedStock,
        actual_stock: formData.actualStock || null,
        phantom_stock_percentage: phantomPercentage,
        production_capacity: formData.productionCapacity,
        current_utilization: formData.currentUtilization,
        lead_time_days: formData.leadTimeDays,
        status: formData.status,
        last_audit_date: formData.lastAuditDate,
        disruption_risk: disruptionRisk,
        regional_factors: []
      });

      if (error) throw error;

      toast.success('Supplier data saved to database!');
      
      // Also trigger the AI analysis
      onSubmit(formData);

      // Reset form
      setFormData({
        supplierId: '',
        supplierName: '',
        tier: 'tier_1',
        state: '',
        city: '',
        reportedStock: 0,
        actualStock: undefined,
        productionCapacity: 100,
        currentUtilization: 75,
        leadTimeDays: 7,
        status: 'active',
        lastAuditDate: new Date().toISOString().split('T')[0]
      });
      setSelectedState('');
    } catch (error: any) {
      console.error('Error saving supplier:', error);
      toast.error(error.message || 'Failed to save supplier data');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-agent-detection/20 to-transparent">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-agent-detection" />
            PHANTOM-X Supply Chain Input
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Sign in to add supplier data</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You need to be signed in to add supplier data.</p>
          <Button onClick={() => navigate('/auth')} className="gap-2">
            <LogIn className="w-4 h-4" />
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-agent-detection/20 to-transparent">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Package className="w-5 h-5 text-agent-detection" />
          PHANTOM-X Supply Chain Input
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Enter supplier data for phantom stock analysis</p>
      </div>
      
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Supplier ID */}
          <div className="space-y-2">
            <Label htmlFor="supplierId" className="flex items-center gap-2">
              <span className="text-agent-detection font-mono">#</span>
              Supplier ID (optional)
            </Label>
            <Input
              id="supplierId"
              placeholder="Auto-generated if left blank"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="font-mono"
            />
          </div>
          
          {/* Supplier Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-agent-detection" />
              Supplier Name *
            </Label>
            <Select
              value={formData.supplierName}
              onValueChange={(value) => setFormData({ ...formData, supplierName: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_SUPPLIERS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tier */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Supplier Tier
            </Label>
            <Select
              value={formData.tier}
              onValueChange={(value) => setFormData({ ...formData, tier: value as 'tier_1' | 'tier_2' | 'tier_3' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tierOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* State */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-agent-detection" />
              State *
            </Label>
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* City */}
          <div className="space-y-2">
            <Label>City *</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => setFormData({ ...formData, city: value })}
              disabled={!selectedState}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-agent-detection" />
              Current Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as SupplierStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Stock Information */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-agent-detection" />
            <Label className="font-medium">Stock & Capacity Information</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportedStock" className="text-sm">Reported Stock (units)</Label>
              <Input
                id="reportedStock"
                type="number"
                min={0}
                value={formData.reportedStock}
                onChange={(e) => setFormData({ ...formData, reportedStock: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actualStock" className="text-sm">Actual Stock (if known)</Label>
              <Input
                id="actualStock"
                type="number"
                min={0}
                placeholder="Leave blank if unknown"
                value={formData.actualStock || ''}
                onChange={(e) => setFormData({ ...formData, actualStock: e.target.value ? parseInt(e.target.value) : undefined })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="utilization" className="text-sm">Current Utilization (%)</Label>
              <Input
                id="utilization"
                type="number"
                min={0}
                max={100}
                value={formData.currentUtilization}
                onChange={(e) => setFormData({ ...formData, currentUtilization: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-sm">Production Capacity (units/day)</Label>
              <Input
                id="capacity"
                type="number"
                min={0}
                value={formData.productionCapacity}
                onChange={(e) => setFormData({ ...formData, productionCapacity: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leadTime" className="text-sm">Lead Time (days)</Label>
              <Input
                id="leadTime"
                type="number"
                min={1}
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        </div>
        
        {/* Last Audit Date */}
        <div className="space-y-2">
          <Label htmlFor="auditDate">Last Audit Date</Label>
          <Input
            id="auditDate"
            type="date"
            value={formData.lastAuditDate}
            onChange={(e) => setFormData({ ...formData, lastAuditDate: e.target.value })}
          />
        </div>
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full gap-2 bg-gradient-to-r from-agent-detection to-primary hover:opacity-90" 
          size="lg"
          disabled={isSubmitting}
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Analyze with PHANTOM-X AI'}
        </Button>
      </div>
    </form>
  );
}
