export interface PurchaseRequest {
  id: string;
  title: string;
  department: string;
  requestedBy: string;
  budget: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Draft' | 'Open' | 'Under Review' | 'Approved' | 'Rejected' | 'Closed';
  deadline: string;
  itemCategory: string;
  quantity: number;
  deliveryDate: string;
  officer: string;
  approver: string;
  description: string;
  notes?: string;
  numQuotations: number;
  updatedAt: string;
}

export interface QuotationItem {
  name: string;
  quantity: number;
  unitPrice: number;
  specs: string;
}

export interface Quotation {
  id: string;
  requestId: string;
  vendorName: string;
  quoteNumber: string;
  quoteDate: string;
  gstNumber: string;
  contactName: string;
  email: string;
  phone: string;
  price: number;
  currency: string;
  taxAmount: number;
  discount: number;
  warranty: string;
  deliveryDays: number;
  paymentTerms: string;
  validityDays: number;
  confidence: number; // 0 to 100
  confidenceLevel: 'Low' | 'Medium' | 'High';
  aiNotes: string[];
  status: 'Ready' | 'Processing' | 'Waiting';
  fileName: string;
  fileSize: string;
  items: QuotationItem[];
}

export interface POHistoryItem {
  poId: string;
  date: string;
  amount: number;
  department: string;
  status: 'Draft' | 'In Transit' | 'Delivered' | 'Paid';
}

export interface VendorProfile {
  id: string;
  name: string;
  rating: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Verified' | 'Warning' | 'Unverified';
  gst: string;
  email: string;
  phone: string;
  address: string;
  yearsInBusiness: number;
  industry: string;
  website: string;
  prevContracts: number;
  avgDeliveryTime: string;
  avgResponseTime: string;
  contractSuccessRate: number;
  violations: number;
  onTimeDelivery: number;
  poHistory: POHistoryItem[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  decision: string;
  reason: string;
  status: 'Completed' | 'Pending' | 'Failed';
  vendor?: string;
  requestId?: string;
}

