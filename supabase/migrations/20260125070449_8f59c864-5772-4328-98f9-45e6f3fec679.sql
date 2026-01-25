-- BHARAT-GUARDIAN Database Schema

-- Create enum types
CREATE TYPE pothole_status AS ENUM ('reported', 'assigned', 'in_progress', 'repaired', 'closed');
CREATE TYPE sla_status AS ENUM ('on_track', 'at_risk', 'breached');
CREATE TYPE supplier_status AS ENUM ('active', 'at_risk', 'disrupted', 'resolved', 'blacklisted');
CREATE TYPE supplier_tier AS ENUM ('tier_1', 'tier_2', 'tier_3');
CREATE TYPE disruption_risk AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_type AS ENUM ('delay', 'quality', 'safety', 'performance', 'phantom_stock', 'disruption', 'capacity');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE project_type AS ENUM ('road_guardian', 'phantom_x', 'water_monitoring', 'power_outage', 'waste_collection');

-- ROAD-GUARDIAN: Potholes table
CREATE TABLE public.potholes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pothole_id TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  date_reported TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  contractor TEXT NOT NULL,
  expected_sla INTEGER NOT NULL DEFAULT 7,
  status pothole_status NOT NULL DEFAULT 'reported',
  previous_repairs BOOLEAN NOT NULL DEFAULT false,
  days_since_last_repair INTEGER,
  days_open INTEGER NOT NULL DEFAULT 0,
  sla_status sla_status NOT NULL DEFAULT 'on_track',
  monsoon_impact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- PHANTOM-X: Suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tier supplier_tier NOT NULL DEFAULT 'tier_1',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  reported_stock INTEGER NOT NULL DEFAULT 0,
  actual_stock INTEGER,
  phantom_stock_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  production_capacity INTEGER NOT NULL DEFAULT 0,
  current_utilization DECIMAL(5,2) NOT NULL DEFAULT 0,
  lead_time_days INTEGER NOT NULL DEFAULT 0,
  status supplier_status NOT NULL DEFAULT 'active',
  last_audit_date TIMESTAMP WITH TIME ZONE,
  disruption_risk disruption_risk NOT NULL DEFAULT 'low',
  regional_factors TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alerts table (unified for all projects)
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type alert_type NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'low',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  entity_id TEXT,
  contractor TEXT,
  supplier TEXT,
  city TEXT,
  state TEXT,
  project project_type NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contractor scores table
CREATE TABLE public.contractor_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_name TEXT NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 80 CHECK (score >= 0 AND score <= 100),
  avg_response_time DECIMAL(5,2) NOT NULL DEFAULT 0,
  avg_completion_time DECIMAL(5,2) NOT NULL DEFAULT 0,
  repeat_occurrence INTEGER NOT NULL DEFAULT 0,
  total_assigned INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Supplier scores table
CREATE TABLE public.supplier_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_name TEXT NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 80 CHECK (score >= 0 AND score <= 100),
  accuracy_rate DECIMAL(5,2) NOT NULL DEFAULT 100,
  delivery_on_time DECIMAL(5,2) NOT NULL DEFAULT 100,
  phantom_stock_incidents INTEGER NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  fulfilled_orders INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.potholes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_scores ENABLE ROW LEVEL SECURITY;

-- Create public read policies (this is a public civic platform)
CREATE POLICY "Anyone can view potholes" ON public.potholes FOR SELECT USING (true);
CREATE POLICY "Anyone can view suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Anyone can view alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Anyone can view contractor scores" ON public.contractor_scores FOR SELECT USING (true);
CREATE POLICY "Anyone can view supplier scores" ON public.supplier_scores FOR SELECT USING (true);

-- Create insert policies (public reporting for civic engagement)
CREATE POLICY "Anyone can report potholes" ON public.potholes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can add suppliers" ON public.suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "System can create alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "System can add contractor scores" ON public.contractor_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "System can add supplier scores" ON public.supplier_scores FOR INSERT WITH CHECK (true);

-- Create update policies
CREATE POLICY "Anyone can update potholes" ON public.potholes FOR UPDATE USING (true);
CREATE POLICY "Anyone can update suppliers" ON public.suppliers FOR UPDATE USING (true);
CREATE POLICY "Anyone can update alerts" ON public.alerts FOR UPDATE USING (true);
CREATE POLICY "Anyone can update contractor scores" ON public.contractor_scores FOR UPDATE USING (true);
CREATE POLICY "Anyone can update supplier scores" ON public.supplier_scores FOR UPDATE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_potholes_updated_at BEFORE UPDATE ON public.potholes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contractor_scores_updated_at BEFORE UPDATE ON public.contractor_scores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_supplier_scores_updated_at BEFORE UPDATE ON public.supplier_scores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_potholes_state ON public.potholes(state);
CREATE INDEX idx_potholes_status ON public.potholes(status);
CREATE INDEX idx_potholes_sla_status ON public.potholes(sla_status);
CREATE INDEX idx_suppliers_state ON public.suppliers(state);
CREATE INDEX idx_suppliers_status ON public.suppliers(status);
CREATE INDEX idx_suppliers_disruption_risk ON public.suppliers(disruption_risk);
CREATE INDEX idx_alerts_project ON public.alerts(project);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_resolved ON public.alerts(resolved);