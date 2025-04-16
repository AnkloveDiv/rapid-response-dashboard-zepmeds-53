
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://selkrzzcwbyyawcuwlpa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbGtyenpjd2J5eWF3Y3V3bHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODY2OTcsImV4cCI6MjA2MDM2MjY5N30.firDGbV2MsFOj9ZmN8vO2oAztPBQ2m0GBKE7jxtrxKA";

// Define custom database types to include the ambulances table
type CustomDatabase = Database & {
  public: {
    Tables: {
      ambulances: {
        Row: {
          id: string;
          name: string;
          vehicle_number: string;
          driver_name: string;
          driver_phone: string;
          status: string;
          last_latitude: number | null;
          last_longitude: number | null;
          last_updated: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          vehicle_number: string;
          driver_name: string;
          driver_phone: string;
          status?: string;
          last_latitude?: number | null;
          last_longitude?: number | null;
          last_updated?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          vehicle_number?: string;
          driver_name?: string;
          driver_phone?: string;
          status?: string;
          last_latitude?: number | null;
          last_longitude?: number | null;
          last_updated?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    } & Database["public"]["Tables"];
  };
};

export const supabase = createClient<CustomDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
