import { NextResponse } from 'next/server';

import fs from 'fs';
import path from 'path';

// GET - Retrieve debug log contents
export async function GET() {
  try {
    const logPath = path.join(process.cwd(), 'logs', 'api-debug.log');

    if (!fs.existsSync(logPath)) {
      return NextResponse.json({ content: 'No debug log file found.' });
    }

    const content = fs.readFileSync(logPath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to read debug log',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE - Clear debug log
export async function DELETE() {
  try {
    const logPath = path.join(process.cwd(), 'logs', 'api-debug.log');

    if (fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, '');
    }

    return NextResponse.json({ success: true, message: 'Debug log cleared' });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to clear debug log',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
