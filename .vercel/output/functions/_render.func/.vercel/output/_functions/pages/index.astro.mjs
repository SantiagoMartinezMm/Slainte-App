/* empty css                                    */
import { a as createComponent, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_D71bw25q.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DDb9sHnj.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
export { renderers } from '../renderers.mjs';

function DrinkCard({ name, description, price, image, alcohol }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-48", children: [
      /* @__PURE__ */ jsx("img", { src: image, alt: name, className: "w-full h-full object-cover" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full text-xs text-white", children: [
        alcohol,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: name }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm mb-4", children: description }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-primary text-xl font-bold", children: [
          "$",
          price
        ] }),
        /* @__PURE__ */ jsx("button", { className: "bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors", children: "Ordenar" })
      ] })
    ] })
  ] });
}

function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-4 scrollbar-hide", children: categories.map((category) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => onCategoryChange(category),
      className: `px-6 py-2 rounded-full whitespace-nowrap transition-colors ${activeCategory === category ? "bg-primary text-secondary font-bold" : "bg-white/10 text-white hover:bg-white/20"}`,
      children: category
    },
    category
  )) });
}

function PromotionCard({ title, discount, image }) {
  return /* @__PURE__ */ jsxs("div", { className: "relative rounded-xl overflow-hidden", children: [
    /* @__PURE__ */ jsx("img", { src: image, alt: title, className: "w-full h-32 object-cover" }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-white font-bold", children: title }),
      /* @__PURE__ */ jsxs("p", { className: "text-primary text-xl font-bold", children: [
        discount,
        "% OFF"
      ] })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const categories = ["Todos", "Cocteles", "Cervezas", "Vinos", "Sin Alcohol"];
  const drinks = [
    {
      name: "Margarita Cl\xE1sica",
      description: "Tequila, triple sec, jugo de lim\xF3n fresco",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1632789395770-20e6f63be806?w=500",
      alcohol: 12,
      category: "Cocteles"
    },
    {
      name: "Mojito Cubano",
      description: "Ron blanco, menta fresca, lima, az\xFAcar",
      price: 10.99,
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500",
      alcohol: 10,
      category: "Cocteles"
    },
    {
      name: "IPA Artesanal",
      description: "Cerveza India Pale Ale con notas c\xEDtricas",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500",
      alcohol: 6.5,
      category: "Cervezas"
    }
  ];
  const promotions = [
    {
      title: "Happy Hour",
      discount: "50",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500"
    },
    {
      title: "2x1 en Cocteles",
      discount: "40",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Bar Menu - Descubre nuestras bebidas" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-secondary p-4 md:p-8"> <header class="mb-8"> <h1 class="text-4xl font-bold text-white mb-2">Descubre</h1> <p class="text-gray-400">Nuestras mejores bebidas</p> </header> ${renderComponent($$result2, "CategoryFilter", CategoryFilter, { "client:load": true, "categories": categories, "activeCategory": "Todos", "onCategoryChange": (category) => console.log(category), "client:component-hydration": "load", "client:component-path": "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/components/CategoryFilter", "client:component-export": "default" })} <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8"> ${drinks.map((drink) => renderTemplate`${renderComponent($$result2, "DrinkCard", DrinkCard, { ...drink })}`)} </section> <section class="mt-12"> <h2 class="text-2xl font-bold text-white mb-4">Promociones</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${promotions.map((promo) => renderTemplate`${renderComponent($$result2, "PromotionCard", PromotionCard, { ...promo })}`)} </div> </section> </main> ` })} <boltAction type="start"> <command></command>npm run dev</boltAction>`;
}, "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/index.astro", void 0);

const $$file = "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
