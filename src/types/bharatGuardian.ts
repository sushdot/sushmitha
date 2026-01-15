// BHARAT-GUARDIAN: Nationwide Agentic AI Platform Types

export type ProjectType = 'road_guardian' | 'phantom_x' | 'water_monitoring' | 'power_outage' | 'waste_collection';

export type PotholeStatus = 'reported' | 'assigned' | 'in_progress' | 'repaired' | 'closed';
export type SupplierStatus = 'active' | 'at_risk' | 'disrupted' | 'resolved' | 'blacklisted';
export type SLAStatus = 'on_track' | 'at_risk' | 'breached';

// ROAD-GUARDIAN Types
export interface Pothole {
  id: string;
  location: string;
  city: string;
  state: string;
  dateReported: Date;
  contractor: string;
  expectedSLA: number;
  status: PotholeStatus;
  previousRepairs: boolean;
  daysSinceLastRepair?: number;
  daysOpen: number;
  slaStatus: SLAStatus;
  monsoonImpact?: boolean;
}

// PHANTOM-X Types (Supply Chain)
export interface Supplier {
  id: string;
  name: string;
  tier: 'tier_1' | 'tier_2' | 'tier_3';
  city: string;
  state: string;
  reportedStock: number;
  actualStock?: number;
  phantomStockPercentage: number;
  productionCapacity: number;
  currentUtilization: number;
  leadTimeDays: number;
  status: SupplierStatus;
  lastAuditDate: Date;
  disruptionRisk: 'low' | 'medium' | 'high' | 'critical';
  regionalFactors: string[];
}

export interface SupplierScore {
  name: string;
  score: number;
  accuracyRate: number;
  deliveryOnTime: number;
  phantomStockIncidents: number;
  totalOrders: number;
  fulfilledOrders: number;
}

export interface ContractorScore {
  name: string;
  score: number;
  avgResponseTime: number;
  avgCompletionTime: number;
  repeatOccurrence: number;
  totalAssigned: number;
  completed: number;
}

// Unified Agent Analysis
export interface AgentAnalysis {
  agent: string;
  icon: string;
  color: string;
  analysis: string;
  status: 'success' | 'warning' | 'danger' | 'info';
  project: ProjectType;
}

export interface TimelineEvent {
  date: Date;
  status: string;
  description: string;
  project: ProjectType;
}

export interface Alert {
  id: string;
  type: 'delay' | 'quality' | 'safety' | 'performance' | 'phantom_stock' | 'disruption' | 'capacity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  entityId?: string;
  contractor?: string;
  supplier?: string;
  city?: string;
  state?: string;
  timestamp: Date;
  project: ProjectType;
}

// Project Configuration
export interface ProjectConfig {
  id: ProjectType;
  name: string;
  fullName: string;
  description: string;
  icon: string;
  color: string;
  agentCount: number;
  isActive: boolean;
}

// Indian States & Cities
export const INDIAN_STATES = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh',
  'West Bengal', 'Telangana', 'Rajasthan', 'Kerala', 'Andhra Pradesh', 'Punjab',
  'Haryana', 'Madhya Pradesh', 'Bihar', 'Odisha', 'Jharkhand', 'Chhattisgarh'
] as const;

export const INDIAN_CITIES: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane'],
  'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli-Dharwad', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Noida', 'Ghaziabad'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg']
};

// Indian Contractors (Road-Guardian)
export const INDIAN_CONTRACTORS = [
  'Larsen & Toubro Infrastructure',
  'NHAI Road Works Division',
  'Ashoka Buildcon Ltd.',
  'IRB Infrastructure',
  'Dilip Buildcon Ltd.',
  'Gayatri Projects Ltd.',
  'Municipal Corporation Works',
  'PWD Road Division'
];

// Indian Suppliers (Phantom-X)
export const INDIAN_SUPPLIERS = [
  'Tata Steel Ltd.',
  'JSW Steel Ltd.',
  'Hindustan Zinc Ltd.',
  'Vedanta Aluminium',
  'Bharat Forge Ltd.',
  'Motherson Sumi Systems',
  'Sundram Fasteners',
  'Bosch India Ltd.',
  'Mahindra CIE Automotive',
  'Varroc Engineering'
];
