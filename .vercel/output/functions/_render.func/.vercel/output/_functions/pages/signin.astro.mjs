/* empty css                                    */
import { a as createComponent, r as renderTemplate, f as renderComponent } from '../chunks/astro/server_D71bw25q.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DDb9sHnj.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { a as createBrowserClient } from '../chunks/supabase_3ag640aW.mjs';
import toast from 'react-hot-toast';
export { renderers } from '../renderers.mjs';

const siteUrl = "http://localhost:4321";
const supabaseUrl = "https://myjqdrrqfdugzmuejypz.supabase.co";
function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const handleInitialCheck = async () => {
      console.log(" Inicializando SignInForm...");
      console.log(" Site URL:", siteUrl);
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      const errorDescription = params.get("error_description");
      if (urlError) {
        console.log(" Error en URL:", { error: urlError, description: errorDescription });
        setError(errorDescription || `Error: ${urlError}`);
        toast.error(errorDescription || `Error: ${urlError}`);
        return;
      }
      try {
        const supabase = createBrowserClient();
        console.log(" Verificando sesión existente...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error(" Error al verificar sesión:", sessionError);
          return;
        }
        if (session) {
          console.log(" Sesión activa encontrada:", session.user.email);
          window.location.href = "/dashboard";
        } else {
          console.log(" No hay sesión activa");
        }
      } catch (error2) {
        console.error(" Error al verificar sesión:", error2);
      }
    };
    handleInitialCheck();
  }, []);
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(" Iniciando proceso de login con Google...");
      const supabase = createBrowserClient();
      if (!supabaseUrl) ;
      const { data, error: error2 } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent"
          }
        }
      });
      if (error2) {
        console.error(" Error de autenticación:", error2);
        setError(error2.message);
        toast.error(error2.message);
        return;
      }
      console.log(" Autenticación iniciada correctamente");
    } catch (error2) {
      console.error(" Error inesperado:", error2);
      const errorMessage = error2 instanceof Error ? error2.message : "Error desconocido";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col items-center justify-center bg-gray-900", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsx("img", { src: "/logo.svg", alt: "Slainte", className: "h-16 w-auto" }) }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8 shadow-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white", children: "Iniciar sesión" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: "Ingresa a tu cuenta para continuar" }),
        error && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-md bg-red-500/10 p-4 text-sm text-red-500", children: error })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleGoogleSignIn,
          disabled: loading,
          className: "group relative flex w-full items-center justify-center space-x-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          children: /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", viewBox: "0 0 18 18", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsxs("g", { fill: "none", fillRule: "evenodd", children: [
              /* @__PURE__ */ jsx("path", { d: "M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z", fill: "#4285F4" }),
              /* @__PURE__ */ jsx("path", { d: "M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z", fill: "#34A853" }),
              /* @__PURE__ */ jsx("path", { d: "M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z", fill: "#FBBC05" }),
              /* @__PURE__ */ jsx("path", { d: "M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z", fill: "#EA4335" })
            ] }) }),
            /* @__PURE__ */ jsx("span", { children: loading ? "Conectando..." : "Continuar con Google" })
          ] })
        }
      ) })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Iniciar Sesi\xF3n - Slainte" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SignInForm", SignInForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/components/auth/SignInForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/signin/index.astro", void 0);

const $$file = "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/signin/index.astro";
const $$url = "/signin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
