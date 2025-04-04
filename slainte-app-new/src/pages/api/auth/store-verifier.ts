import type { APIRoute } from 'astro';
import { CODE_VERIFIER_KEY } from '../../../lib/constants';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { codeVerifier } = await request.json();
    
    if (!codeVerifier) {
      return new Response(JSON.stringify({ error: 'Code verifier is required' }), {
        status: 400,
      });
    }

    // Configurar la cookie con opciones seguras
    cookies.set(CODE_VERIFIER_KEY, codeVerifier, {
      path: '/',
      secure: import.meta.env.PROD,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutos
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error storing code verifier:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};
