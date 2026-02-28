import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ping the database to verify connectivity
    // Using a lightweight query on a table that always exists or just a select
    const { error } = await supabase.from('projects').select('id').limit(1);
    
    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    }, { status: 200 });
  } catch (error) {
    logger.error('Health check failed', error);
    return NextResponse.json({ 
      status: 'unhealthy', 
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown database error'
    }, { status: 503 });
  }
}
