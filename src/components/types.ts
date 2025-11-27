// types.ts

// --- Diagram Parts ---
export interface ServiceNode {
  id: string;
  label: string;
  type: string;
  iconUrl?: string;
  description?: string;
  groupId?: string;
}

export interface ServiceGroup {
  id: string;
  label: string;
}

export interface ServiceConnection {
  id: string;
  sourceId: string;
  targetId: string;
}

// --- Pricing Parts ---
export interface PricingItem {
  service: string;
  description: string;
  cost: string;
}

// --- The Full Payload ---
export interface ArchitectureData {
  // Visuals
  services: ServiceNode[];
  connections: ServiceConnection[];
  groups?: ServiceGroup[];
  // Financials
  pricing: PricingItem[];
  totalCost: string;
}