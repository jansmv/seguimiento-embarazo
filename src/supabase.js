import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://nydvvjiugrzfgsartbkb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZHZ2aml1Z3J6ZmdzYXJ0YmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzA0NDcsImV4cCI6MjA5MDEwNjQ0N30.pAihVGI9K6fMFITagiySgvzfr-Q5tFglirtkZTX2me0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
