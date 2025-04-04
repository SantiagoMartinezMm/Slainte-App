import { c as createAstro, a as createComponent, r as renderTemplate, f as renderComponent, m as maybeRenderHead, e as renderSlot } from './astro/server_D71bw25q.mjs';
import 'kleur/colors';
import { s as supabase } from './supabase_3ag640aW.mjs';
import { $ as $$Layout } from './Layout_DDb9sHnj.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { u as useAuthStore } from './authStore_Bb2IrUcB.mjs';

function Navbar() {
  const { user, signOut } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/signin";
    } catch (error) {
      toast.error(error.message || "Error al cerrar sesión");
    }
  };
  return /* @__PURE__ */ jsxs("nav", { className: "bg-gray-800", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("h1", { className: "text-white text-xl font-bold", children: "Slainte Bar" }) }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxs("div", { className: "ml-10 flex items-baseline space-x-4", children: [
          /* @__PURE__ */ jsx("a", { href: "/dashboard", className: "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium", children: "Dashboard" }),
          /* @__PURE__ */ jsx("a", { href: "/dashboard/categories", className: "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium", children: "Categorías" }),
          /* @__PURE__ */ jsx("a", { href: "/dashboard/products", className: "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium", children: "Productos" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx("div", { className: "ml-4 flex items-center md:ml-6", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSignOut,
          className: "rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600",
          children: "Cerrar sesión"
        }
      ) }) }),
      /* @__PURE__ */ jsx("div", { className: "-mr-2 flex md:hidden", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsMenuOpen(!isMenuOpen),
          className: "inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800",
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Abrir menú principal" }),
            !isMenuOpen ? /* @__PURE__ */ jsx("svg", { className: "block h-6 w-6", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" }) }) : /* @__PURE__ */ jsx("svg", { className: "block h-6 w-6", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) })
          ]
        }
      ) })
    ] }) }),
    isMenuOpen && /* @__PURE__ */ jsxs("div", { className: "md:hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 px-2 pb-3 pt-2 sm:px-3", children: [
        /* @__PURE__ */ jsx("a", { href: "/dashboard", className: "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium", children: "Dashboard" }),
        /* @__PURE__ */ jsx("a", { href: "/dashboard/categories", className: "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium", children: "Categorías" }),
        /* @__PURE__ */ jsx("a", { href: "/dashboard/products", className: "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium", children: "Productos" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-700 pb-3 pt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center px-5", children: /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("div", { className: "text-base font-medium leading-none text-white", children: user?.email }) }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-1 px-2", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSignOut,
            className: "block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white",
            children: "Cerrar sesión"
          }
        ) })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro("http://localhost:4321");
const $$DashboardLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashboardLayout;
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return Astro2.redirect("/signin");
  }
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    return Astro2.redirect("/signin");
  }
  const { title } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title || "Dashboard - Slainte" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-full"> ${renderComponent($$result2, "Navbar", Navbar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/components/dashboard/Navbar", "client:component-export": "default" })} <header class="bg-white shadow"> <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> <h1 class="text-3xl font-bold tracking-tight text-gray-900"> ${renderSlot($$result2, $$slots["header"])} </h1> </div> </header> <main> <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"> ${renderSlot($$result2, $$slots["default"])} </div> </main> </div> ` })}`;
}, "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/layouts/DashboardLayout.astro", void 0);

export { $$DashboardLayout as $ };
