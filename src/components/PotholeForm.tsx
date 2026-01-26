import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PotholeStatus } from '@/types/pothole';
import { INDIAN_STATES, INDIAN_CITIES, INDIAN_CONTRACTORS } from '@/types/bharatGuardian';
import { Send, MapPin, Calendar, User, Clock, RotateCcw, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface PotholeFormData {
  potholeId: string;
  location: string;
  state: string;
  city: string;
  dateReported: string;
  contractor: string;
  expectedSLA: number;
  status: PotholeStatus;
  previousRepairs: boolean;
  daysSinceLastRepair?: number;
}

interface PotholeFormProps {
  onSubmit: (data: PotholeFormData) => void;
}

const statuses: { value: PotholeStatus; label: string }[] = [
  { value: 'reported', label: 'Reported' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'repaired', label: 'Repaired' },
  { value: 'closed', label: 'Closed' },
];

export function PotholeForm({ onSubmit }: PotholeFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const cities = selectedState ? INDIAN_CITIES[selectedState] || [] : [];

  const [formData, setFormData] = useState<PotholeFormData>({
    potholeId: '',
    location: '',
    state: '',
    city: '',
    dateReported: new Date().toISOString().split('T')[0],
    contractor: '',
    expectedSLA: 7,
    status: 'reported',
    previousRepairs: false,
    daysSinceLastRepair: undefined,
  });

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setFormData({ ...formData, state, city: '' });
  };

  const generatePotholeId = () => {
    const stateCode = formData.state.substring(0, 2).toUpperCase();
    const cityCode = formData.city.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `PH-${stateCode}-${cityCode}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to report a pothole');
      return;
    }

    if (!formData.state || !formData.city || !formData.location || !formData.contractor) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const potholeId = formData.potholeId || generatePotholeId();
      const daysOpen = Math.floor((new Date().getTime() - new Date(formData.dateReported).getTime()) / (1000 * 60 * 60 * 24));
      
      const { error } = await supabase.from('potholes').insert({
        pothole_id: potholeId,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        contractor: formData.contractor,
        date_reported: formData.dateReported,
        expected_sla: formData.expectedSLA,
        status: formData.status,
        previous_repairs: formData.previousRepairs,
        days_since_last_repair: formData.daysSinceLastRepair || null,
        days_open: daysOpen,
        sla_status: daysOpen > formData.expectedSLA ? 'breached' : daysOpen > formData.expectedSLA * 0.7 ? 'at_risk' : 'on_track'
      });

      if (error) throw error;

      toast.success('Pothole reported and saved to database!');
      
      // Also trigger the AI analysis
      onSubmit({ ...formData, potholeId });

      // Reset form
      setFormData({
        potholeId: '',
        location: '',
        state: '',
        city: '',
        dateReported: new Date().toISOString().split('T')[0],
        contractor: '',
        expectedSLA: 7,
        status: 'reported',
        previousRepairs: false,
        daysSinceLastRepair: undefined,
      });
      setSelectedState('');
    } catch (error: any) {
      console.error('Error saving pothole:', error);
      toast.error(error.message || 'Failed to save pothole report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-border hero-gradient">
          <h3 className="text-lg font-semibold text-primary-foreground">Submit Pothole Report</h3>
          <p className="text-sm text-primary-foreground/70 mt-1">Sign in to report potholes</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You need to be signed in to report potholes.</p>
          <Button onClick={() => navigate('/auth')} className="gap-2">
            <LogIn className="w-4 h-4" />
            Sign In to Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border hero-gradient">
        <h3 className="text-lg font-semibold text-primary-foreground">Submit Pothole Report</h3>
        <p className="text-sm text-primary-foreground/70 mt-1">Enter pothole details for AI analysis</p>
      </div>
      
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pothole ID */}
          <div className="space-y-2">
            <Label htmlFor="potholeId" className="flex items-center gap-2">
              <span className="text-primary font-mono">#</span>
              Pothole ID (optional)
            </Label>
            <Input
              id="potholeId"
              placeholder="Auto-generated if left blank"
              value={formData.potholeId}
              onChange={(e) => setFormData({ ...formData, potholeId: e.target.value })}
              className="font-mono"
            />
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Location / Road Name *
            </Label>
            <Input
              id="location"
              placeholder="Road / Area name"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          
          {/* State */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
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
          
          {/* Date Reported */}
          <div className="space-y-2">
            <Label htmlFor="dateReported" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Date Reported
            </Label>
            <Input
              id="dateReported"
              type="date"
              value={formData.dateReported}
              onChange={(e) => setFormData({ ...formData, dateReported: e.target.value })}
            />
          </div>
          
          {/* Contractor */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Contractor Assigned *
            </Label>
            <Select
              value={formData.contractor}
              onValueChange={(value) => setFormData({ ...formData, contractor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contractor" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_CONTRACTORS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Expected SLA */}
          <div className="space-y-2">
            <Label htmlFor="sla" className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Expected SLA (days)
            </Label>
            <Input
              id="sla"
              type="number"
              min={1}
              max={30}
              value={formData.expectedSLA}
              onChange={(e) => setFormData({ ...formData, expectedSLA: parseInt(e.target.value) })}
            />
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Current Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as PotholeStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Previous Repairs Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-warning" />
            <div>
              <Label htmlFor="previousRepairs" className="font-medium">Previous Repairs?</Label>
              <p className="text-xs text-muted-foreground">Has this pothole been repaired before?</p>
            </div>
          </div>
          <Switch
            id="previousRepairs"
            checked={formData.previousRepairs}
            onCheckedChange={(checked) => setFormData({ ...formData, previousRepairs: checked })}
          />
        </div>
        
        {/* Days Since Last Repair */}
        {formData.previousRepairs && (
          <div className="space-y-2 animate-slide-up">
            <Label htmlFor="daysSinceLastRepair">Days Since Last Repair</Label>
            <Input
              id="daysSinceLastRepair"
              type="number"
              min={0}
              placeholder="Enter number of days"
              value={formData.daysSinceLastRepair || ''}
              onChange={(e) => setFormData({ ...formData, daysSinceLastRepair: parseInt(e.target.value) })}
            />
          </div>
        )}
        
        {/* Submit Button */}
        <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Analyze with ROAD-GUARDIAN AI'}
        </Button>
      </div>
    </form>
  );
}
