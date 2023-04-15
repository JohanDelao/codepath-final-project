import { createClient } from '@supabase/supabase-js'
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(URL, API_KEY) 