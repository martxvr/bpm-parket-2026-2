export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageUpload?: any;
  images?: string[];
  areaSize: number;
  location: string;
  date: string;
  category?: string;
  brand?: string;
  brandSlug?: string;
  longDescription?: string;
  techniques?: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  floorType: string;
  areaSize: number;
  message?: string;
  status: 'new' | 'contacted' | 'completed';
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string; // ISO string
  notes: string;
  source: 'chatbot' | 'manual';
}

export interface KnowledgeItem {
  id: string;
  topic: string;
  content: string;
}

export interface Policy {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  companyName?: string; // Optional
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  vatRate: number; // 9 or 21
}

export interface Invoice {
  id: string;
  number: string; // e.g., INV-2024-001
  customerId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  type: 'quote' | 'invoice'; // Offerte of Factuur
  totalAmount: number;
}

export interface AdminSettings {
  adminName: string;
  adminEmail: string;
  adminRole: string;
  adminAvatar: string;
  password?: string;
  chatbotEnabled: boolean;
  phone?: string;

  // Company Details for Invoices
  companyName?: string;
  companyAddress?: string;
  companyZip?: string;
  companyCity?: string;
  companyKvk?: string;
  companyBtw?: string;
  companyIban?: string;
  companyLogo?: string;
}