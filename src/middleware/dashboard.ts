import type { AstroGlobal } from 'astro';
import { isAuthenticated } from './auth';

export async function protectDashboard(Astro: AstroGlobal) {
  const authenticated = await isAuthenticated(Astro);

  if (!authenticated) {
    console.log('Usuario no autenticado intentando acceder al dashboard');
    return Astro.redirect('/signin?error=unauthorized&error_description=Debes iniciar sesión para acceder al dashboard');
  }

  return true;
}
