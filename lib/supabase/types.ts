export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string;
          url: string;
          domain: string;
          overall_score: number;
          checks: Json;
          html_content: string | null;
          metadata: Json | null;
          ai_insights: Json | null;
          ai_overall_readiness: string | null;
          ai_top_priorities: Json | null;
          enhanced_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          domain: string;
          overall_score: number;
          checks: Json;
          html_content?: string | null;
          metadata?: Json | null;
          ai_insights?: Json | null;
          ai_overall_readiness?: string | null;
          ai_top_priorities?: Json | null;
          enhanced_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          domain?: string;
          overall_score?: number;
          checks?: Json;
          html_content?: string | null;
          metadata?: Json | null;
          ai_insights?: Json | null;
          ai_overall_readiness?: string | null;
          ai_top_priorities?: Json | null;
          enhanced_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          analysis_id: string | null;
          email: string;
          company_name: string | null;
          marketing_consent: boolean;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id?: string | null;
          email: string;
          company_name?: string | null;
          marketing_consent?: boolean;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          analysis_id?: string | null;
          email?: string;
          company_name?: string | null;
          marketing_consent?: boolean;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          analysis_id: string | null;
          lead_id: string | null;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          stripe_customer_id: string | null;
          amount_cents: number;
          currency: string;
          status: string;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          analysis_id?: string | null;
          lead_id?: string | null;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_customer_id?: string | null;
          amount_cents: number;
          currency?: string;
          status?: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          analysis_id?: string | null;
          lead_id?: string | null;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_customer_id?: string | null;
          amount_cents?: number;
          currency?: string;
          status?: string;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      pdf_reports: {
        Row: {
          id: string;
          analysis_id: string | null;
          purchase_id: string | null;
          status: string;
          pdf_url: string | null;
          pdf_storage_key: string | null;
          generation_started_at: string | null;
          generation_completed_at: string | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id?: string | null;
          purchase_id?: string | null;
          status?: string;
          pdf_url?: string | null;
          pdf_storage_key?: string | null;
          generation_started_at?: string | null;
          generation_completed_at?: string | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          analysis_id?: string | null;
          purchase_id?: string | null;
          status?: string;
          pdf_url?: string | null;
          pdf_storage_key?: string | null;
          generation_started_at?: string | null;
          generation_completed_at?: string | null;
          error_message?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper types for easier usage
export type Analysis = Database['public']['Tables']['analyses']['Row'];
export type AnalysisInsert = Database['public']['Tables']['analyses']['Insert'];
export type Lead = Database['public']['Tables']['leads']['Row'];
export type LeadInsert = Database['public']['Tables']['leads']['Insert'];
export type Purchase = Database['public']['Tables']['purchases']['Row'];
export type PurchaseInsert = Database['public']['Tables']['purchases']['Insert'];
export type PdfReport = Database['public']['Tables']['pdf_reports']['Row'];
export type PdfReportInsert = Database['public']['Tables']['pdf_reports']['Insert'];
