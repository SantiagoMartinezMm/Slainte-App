import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token) {
      return new Response(JSON.stringify({ error: 'No access token provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Set the access token cookie
    cookies.set('sb-access-token', access_token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    // Set the refresh token cookie if available
    if (refresh_token) {
      cookies.set('sb-refresh-token', refresh_token, {
        path: '/',
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error setting session:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to establish session',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
