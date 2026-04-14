import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaHZ5cHNqbXN3amZubWR0YWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTU2MzksImV4cCI6MjA5MTczMTYzOX0.xMwdozKgEUeENyOKvbfmoQu1Hnitw6yf2ucLBavEJNo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
