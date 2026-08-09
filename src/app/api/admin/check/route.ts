import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_auth_session');
  const isAuthenticated = session?.value === 'authenticated_token_2026_valid';

  return NextResponse.json({ authenticated: isAuthenticated });
}
