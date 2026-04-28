import { createClient } from "@supabase/supabase-js";

// Vite requires environment variables to be prefixed with 'VITE_', but we will check for both mapped variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vqwesznblttmeodxetkr.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_zjW5f0Idxn9yN-kxfw1fUg_7WmxqwNC";

export const supabase = createClient(supabaseUrl, supabaseKey);
