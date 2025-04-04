# Instrucciones para configurar OAuth con Google en Supabase

Para que la autenticación con Google funcione correctamente en tu aplicación Slainte-app-astro, sigue estos pasos:

## 1. Configurar Google Cloud Console

1. Ve a la [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs y servicios" > "Pantalla de consentimiento de OAuth"
   - Configura la pantalla de consentimiento con la información de tu aplicación
   - Asegúrate de agregar el dominio de Supabase (`myjqdrrrqfdugzmuejypz.supabase.co`) a los dominios autorizados
4. Ve a "APIs y servicios" > "Credenciales"
5. Haz clic en "Crear credenciales" y selecciona "ID de cliente de OAuth"
6. Selecciona "Aplicación web" como tipo de aplicación
7. Agrega los siguientes orígenes JavaScript autorizados:
   - `http://localhost:4321` (para desarrollo local)
   - `https://tu-dominio-de-produccion.com` (si tienes un dominio de producción)
8. Agrega las siguientes URLs de redirección autorizadas:
   - `http://localhost:4321/auth/callback` (para desarrollo local)
   - `https://tu-dominio-de-produccion.com/auth/callback` (si tienes un dominio de producción)
   - `https://myjqdrrrqfdugzmuejypz.supabase.co/auth/v1/callback` (URL de callback de Supabase)
9. Haz clic en "Crear" y anota el ID de cliente y el secreto de cliente

## 2. Configurar Supabase

1. Ve al [panel de Supabase](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a "Authentication" > "Providers"
4. Busca "Google" y habilítalo
5. Ingresa el ID de cliente y el secreto de cliente que obtuviste de Google Cloud Console
6. Asegúrate de que la URL de redirección esté configurada correctamente:
   - Debe ser `https://myjqdrrrqfdugzmuejypz.supabase.co/auth/v1/callback`
7. Guarda la configuración

## 3. Verificar variables de entorno

Asegúrate de que las siguientes variables de entorno estén configuradas correctamente en tu archivo `.env`:

```
PUBLIC_SUPABASE_URL=https://myjqdrrrqfdugzmuejypz.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-key
PUBLIC_SITE_URL=http://localhost:4321
```

Para producción, actualiza `PUBLIC_SITE_URL` a tu dominio de producción.

## 4. Probar la autenticación

1. Inicia tu aplicación con `npm run dev`
2. Ve a la página de inicio de sesión
3. Haz clic en el botón "Google"
4. Deberías ser redirigido a la pantalla de consentimiento de Google
5. Después de autenticarte, deberías ser redirigido de vuelta a tu aplicación

## Solución de problemas

Si encuentras problemas durante la autenticación, verifica lo siguiente:

1. **Errores en la consola del navegador**: Revisa la consola del navegador para ver si hay errores relacionados con la autenticación.

2. **Logs de Supabase**: Ve a "Authentication" > "Logs" en el panel de Supabase para ver los logs de autenticación.

3. **URLs de redirección**: Asegúrate de que las URLs de redirección estén configuradas correctamente tanto en Google Cloud Console como en Supabase.

4. **Cookies**: La autenticación con PKCE requiere que las cookies funcionen correctamente. Asegúrate de que no haya problemas con las cookies en tu navegador.

5. **CORS**: Si ves errores de CORS, asegúrate de que los orígenes JavaScript autorizados estén configurados correctamente en Google Cloud Console.

Si sigues teniendo problemas, consulta la [documentación oficial de Supabase sobre autenticación con Google](https://supabase.com/docs/guides/auth/social-login/auth-google).
