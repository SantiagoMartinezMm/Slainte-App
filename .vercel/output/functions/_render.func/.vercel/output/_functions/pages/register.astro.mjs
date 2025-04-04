/* empty css                                    */
import { a as createComponent, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_D71bw25q.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DDb9sHnj.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { s as supabase } from '../chunks/supabase_3ag640aW.mjs';
export { renderers } from '../renderers.mjs';

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });
      if (signUpError) throw signUpError;
      if (authData.user) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          name,
          email,
          role: "customer",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (profileError) {
          console.error("Error creating profile:", profileError);
          throw new Error(`Failed to create profile: ${profileError.message}`);
        }
        window.location.href = "/login";
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Crear una cuenta" }) }),
    /* @__PURE__ */ jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [
      error && /* @__PURE__ */ jsx("div", { className: "rounded-md bg-red-50 p-4", children: /* @__PURE__ */ jsx("div", { className: "text-sm text-red-700", children: error }) }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "sr-only", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "name",
              name: "name",
              type: "text",
              required: true,
              className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
              placeholder: "Nombre"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "sr-only", children: "Email" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "email",
              name: "email",
              type: "email",
              required: true,
              className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
              placeholder: "Email"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "sr-only", children: "Contraseña" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password",
              name: "password",
              type: "password",
              required: true,
              className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
              placeholder: "Contraseña"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          children: loading ? "Registrando..." : "Registrarse"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-center", children: /* @__PURE__ */ jsx("a", { href: "/login", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "¿Ya tienes cuenta? Inicia sesión" }) })
    ] })
  ] }) });
}

const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registrarse - Slainte" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50"> ${renderComponent($$result2, "RegisterForm", RegisterForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/components/auth/RegisterForm", "client:component-export": "default" })} </main> ` })}`;
}, "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/register.astro", void 0);

const $$file = "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
