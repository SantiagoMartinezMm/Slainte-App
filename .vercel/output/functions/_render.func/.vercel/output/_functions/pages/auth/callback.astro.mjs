/* empty css                                       */
import { c as createAstro, a as createComponent, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_D71bw25q.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DDb9sHnj.mjs';
import { c as createServerClient } from '../../chunks/supabase_3ag640aW.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("http://localhost:4321");
const $$Callback = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Callback;
  console.log("=== Iniciando proceso de callback ===");
  const handleError = (error, description) => {
    console.error("Error en callback:", { error, description });
    return Astro2.redirect(`/signin?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(description || "Error durante la autenticación")}`);
  };
  let response;
  try {
    const requestUrl = new URL(Astro2.request.url);
    console.log("URL recibida:", requestUrl.toString());
    const urlParams = Object.fromEntries(requestUrl.searchParams.entries());
    console.log("Parámetros de la URL:", urlParams);
    const code = requestUrl.searchParams.get("code");
    const error = requestUrl.searchParams.get("error");
    const error_description = requestUrl.searchParams.get("error_description");
    const code_verifier = Astro2.cookies.get("code_verifier")?.value;
    console.log("Code verifier de cookie:", {
      exists: !!code_verifier,
      length: code_verifier?.length,
      value: code_verifier ? `${code_verifier.slice(0, 10)}...${code_verifier.slice(-10)}` : null
    });
    if (error) {
      console.error("Error OAuth:", { error, error_description });
      response = await handleError(error, error_description);
    } else if (!code || !code_verifier) {
      console.error("Faltan parámetros requeridos:", {
        code: code ? `${code.slice(0, 8)}...` : null,
        code_verifier: code_verifier ? `${code_verifier.slice(0, 8)}...` : null,
        code_exists: !!code,
        verifier_exists: !!code_verifier
      });
      response = await handleError(
        "invalid_request",
        "Faltan parámetros requeridos para la autenticación"
      );
    } else {
      try {
        const supabaseUrl = "https://myjqdrrqfdugzmuejypz.supabase.co";
        if (!supabaseUrl) ;
        console.log("Intercambiando código por sesión...", {
          code: code.slice(0, 8) + "...",
          code_verifier: code_verifier.slice(0, 8) + "...",
          code_length: code.length,
          verifier_length: code_verifier.length,
          verifier_valid: /^[A-Za-z0-9_-]{43,128}$/.test(code_verifier)
        });
        const exchangeResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=authorization_code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15anFkcnJxZmR1Z3ptdWVqeXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MzQ2NTMsImV4cCI6MjA0ODQxMDY1M30.xYKMe1AkPD3wxCMPR1yybGphQDvalQ62K92VVZtNerI"
          },
          body: JSON.stringify({
            auth_code: code,
            code_verifier
          })
        });
        const data = await exchangeResponse.json();
        if (!exchangeResponse.ok) {
          console.error("Error al intercambiar código por sesión:", {
            status: exchangeResponse.status,
            data
          });
          response = await handleError("auth_error", data.error_description || "Error al intercambiar código por sesión");
        } else {
          console.log("✅ Sesión obtenida correctamente");
          const supabase = createServerClient();
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token
          });
          if (sessionError) {
            console.error("Error al establecer la sesión:", sessionError);
            response = await handleError("session_error", "Error al establecer la sesión");
          } else {
            response = Astro2.redirect("/dashboard");
          }
        }
      } catch (error2) {
        console.error("Error inesperado durante el intercambio:", error2);
        response = await handleError("unexpected_error", "Error inesperado durante la autenticación");
      }
    }
  } catch (error) {
    console.error("Error general en el callback:", error);
    response = await handleError("general_error", "Error general durante la autenticación");
  }
  if (!response) {
    response = await handleError("unknown_error", "Error desconocido durante la autenticación");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Autenticando..." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex min-h-screen items-center justify-center"> <div class="text-center"> <h1 class="text-xl font-semibold">Procesando autenticación...</h1> <p class="mt-2 text-gray-600">Por favor espere...</p> </div> </div> ` })}`;
}, "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/auth/callback.astro", void 0);
const $$file = "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/auth/callback.astro";
const $$url = "/auth/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Callback,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
