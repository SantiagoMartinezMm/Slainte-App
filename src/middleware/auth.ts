import { createServerClient } from '../lib/supabase';
import type { AstroGlobal } from 'astro';
import { PROJECT_ID } from '../lib/constants';

export async function isAuthenticated(Astro: AstroGlobal) {
  const supabase = createServerClient(Astro.cookies);
  
  // Obtener tokens de las cookies con el nombre correcto
  const accessToken = Astro.cookies.get(`sb-${PROJECT_ID}-access-token`)?.value;
  const refreshToken = Astro.cookies.get(`sb-${PROJECT_ID}-refresh-token`)?.value;

  if (!accessToken) {
    console.log('No se encontró token de acceso');
    return false;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error al verificar sesión:', error);
      return false;
    }

    if (!session) {
      console.log('No hay sesión activa');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error inesperado al verificar autenticación:', error);
    return false;
  }
}

export async function requireAuth(Astro: AstroGlobal) {
  const authenticated = await isAuthenticated(Astro);

  if (!authenticated) {
    console.log('Redirigiendo a signin - Usuario no autenticado');
    return Astro.redirect('/signin');
  }

  return true;
}

export async function requireAdmin(Astro: AstroGlobal) {
  const supabase = createServerClient(Astro.cookies);
  const authenticated = await isAuthenticated(Astro);

  if (!authenticated) {
    console.log('Redirigiendo a signin - Usuario no autenticado (admin check)');
    return Astro.redirect('/signin');
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      console.error('Error al obtener sesión (admin check):', error);
      return Astro.redirect('/signin');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      console.log('Usuario no es admin:', session.user.email);
      await supabase.auth.signOut();
      return Astro.redirect('/signin');
    }

    return true;
  } catch (error) {
    console.error('Error inesperado en requireAdmin:', error);
    return Astro.redirect('/signin');
  }
}
