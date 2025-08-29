// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  phone?: string;
  role: 'user' | 'expert' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// ITR Filing types
export interface ItrForm {
  id: string;
  userId: string;
  assessmentYear: string;
  formType?: string;
  filingDate?: string;
  acknowledgmentNumber?: string;
  refundAmount?: string;
  incomeFromSalary: number;
  incomeFromHouseProperty: number;
  incomeFromCapitalGains: number;
  incomeFromOtherSources: number;
  deductions: {
    section80C: number;
    section80D: number;
    section80G: number;
    otherDeductions: number;
  };
  taxPaid: {
    tds: number;
    advanceTax: number;
    selfAssessmentTax: number;
  };
  status: 'draft' | 'submitted' | 'processed' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// GST types
export interface GstReturn {
  id: string;
  userId: string;
  gstin: string;
  returnType: 'GSTR1' | 'GSTR3B' | 'GSTR9';
  period: string;
  filingDate?: string;
  arn?: string;
  taxLiability?: string;
  sales: {
    taxableValue: number;
    igst: number;
    cgst: number;
    sgst: number;
  };
  purchases: {
    taxableValue: number;
    igst: number;
    cgst: number;
    sgst: number;
  };
  status: 'draft' | 'filed' | 'processed';
  createdAt: Date;
  updatedAt: Date;
}

// TDS types
export interface TdsReturn {
  id: string;
  userId: string;
  quarter: string;
  financialYear: string;
  formType?: string;
  tan?: string;
  filingDate?: string;
  token?: string;
  tdsDeposited?: string;
  deducteeDetails: {
    name: string;
    pan: string;
    amount: number;
    tdsDeducted: number;
  }[];
  totalTdsDeducted: number;
  status: 'draft' | 'filed' | 'processed';
  createdAt: Date;
  updatedAt: Date;
}

// Document types
export interface Document {
  id: string;
  userId: string;
  name: string;
  type: string;
  fileType?: string;
  size: number;
  url: string;
  category: 'itr' | 'gst' | 'tds' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

// Consultation types
export interface Consultation {
  id: string;
  userId: string;
  expertId: string;
  title: string;
  description: string;
  category: 'itr' | 'gst' | 'tds' | 'general';
  serviceType?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  scheduledAt?: Date;
  scheduledDate?: string;
  meetingLink?: string;
  duration: number;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pricing types
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string | number;
  userType?: string;
  features: string[];
  popular?: boolean;
  isPopular?: boolean;
  category: 'itr' | 'gst' | 'tds' | 'consultation';
}
