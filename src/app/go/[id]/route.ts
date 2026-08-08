import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(`[Affiliate Click] Redirecting tracking ID: ${id}`);

  // 302 Redirect to destination
  const targetUrl = 'https://calendly.com?utm_source=saas_decision_engine';
  return NextResponse.redirect(targetUrl, 302);
}
