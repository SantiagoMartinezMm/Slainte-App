/* empty css                                       */
import { a as createComponent, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_D71bw25q.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_B8cdRYi9.mjs';
import { jsx, jsxs, Fragment as Fragment$1 } from 'react/jsx-runtime';
import { useState, Fragment } from 'react';
import { s as supabase } from '../../chunks/supabase_3ag640aW.mjs';
import { Transition, Dialog } from '@headlessui/react';
export { renderers } from '../../renderers.mjs';

function AddCategoryModal({ isOpen, onClose, onCategoryAdded }) {
  const [form, setForm] = useState({
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.from("categories").insert([
        {
          name: form.name,
          description: form.description
        }
      ]).select().single();
      if (error) throw error;
      onCategoryAdded(data);
      setForm({ name: "", description: "" });
      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error al agregar la categoría");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Transition.Root, { show: isOpen, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-10", onClose, children: [
    /* @__PURE__ */ jsx(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-out duration-300",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "ease-in duration-200",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
        children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-10 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0", children: /* @__PURE__ */ jsx(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-out duration-300",
        enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
        enterTo: "opacity-100 translate-y-0 sm:scale-100",
        leave: "ease-in duration-200",
        leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
        leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
        children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "mt-3 text-center sm:mt-0 sm:text-left", children: [
            /* @__PURE__ */ jsx(Dialog.Title, { as: "h3", className: "text-base font-semibold leading-6 text-gray-900", children: "Agregar Nueva Categoría" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-medium leading-6 text-gray-900", children: "Nombre" }),
                /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "name",
                    id: "name",
                    required: true,
                    value: form.name,
                    onChange: (e) => setForm({ ...form, name: e.target.value }),
                    className: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "description", className: "block text-sm font-medium leading-6 text-gray-900", children: "Descripción" }),
                /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    name: "description",
                    id: "description",
                    rows: 3,
                    value: form.description,
                    onChange: (e) => setForm({ ...form, description: e.target.value }),
                    className: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  }
                ) })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 sm:mt-4 sm:flex sm:flex-row-reverse", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto",
                children: loading ? "Guardando..." : "Guardar"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto",
                onClick: onClose,
                children: "Cancelar"
              }
            )
          ] })
        ] }) })
      }
    ) }) })
  ] }) });
}

function CategoryList({ categories: initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: ""
  });
  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };
  const startEdit = (category) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      description: category.description || ""
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "" });
  };
  const handleUpdate = async (id) => {
    try {
      const { error } = await supabase.from("categories").update({
        name: editForm.name,
        description: editForm.description,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id);
      if (error) throw error;
      setCategories(categories.map(
        (cat) => cat.id === id ? { ...cat, ...editForm, updated_at: (/* @__PURE__ */ new Date()).toISOString() } : cat
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error al actualizar la categoría");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error al eliminar la categoría");
    }
  };
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsxs("div", { className: "sm:flex sm:items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "sm:flex-auto", children: /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-700", children: "Lista de todas las categorías disponibles en el menú." }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 sm:ml-16 sm:mt-0 sm:flex-none", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setIsAddModalOpen(true),
          className: "block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
          children: "Agregar categoría"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 flow-root", children: /* @__PURE__ */ jsx("div", { className: "-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8", children: /* @__PURE__ */ jsx("div", { className: "inline-block min-w-full py-2 align-middle", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-300", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0", children: "Nombre" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", children: "Descripción" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", children: "Última actualización" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "relative py-3.5 pl-3 pr-4 sm:pr-0", children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Acciones" }) })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: categories.map((category) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0", children: editingId === category.id ? /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: editForm.name,
            onChange: (e) => setEditForm({ ...editForm, name: e.target.value }),
            className: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          }
        ) : category.name }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-3 py-4 text-sm text-gray-500", children: editingId === category.id ? /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: editForm.description,
            onChange: (e) => setEditForm({ ...editForm, description: e.target.value }),
            className: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          }
        ) : category.description || "-" }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-3 py-4 text-sm text-gray-500", children: new Date(category.updated_at).toLocaleDateString() }),
        /* @__PURE__ */ jsx("td", { className: "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0", children: editingId === category.id ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleUpdate(category.id),
              className: "text-indigo-600 hover:text-indigo-900",
              children: "Guardar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: cancelEdit,
              className: "text-gray-600 hover:text-gray-900",
              children: "Cancelar"
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => startEdit(category),
              className: "text-indigo-600 hover:text-indigo-900",
              children: "Editar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(category.id),
              className: "text-red-600 hover:text-red-900",
              children: "Eliminar"
            }
          )
        ] }) })
      ] }, category.id)) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(
      AddCategoryModal,
      {
        isOpen: isAddModalOpen,
        onClose: () => setIsAddModalOpen(false),
        onCategoryAdded: handleAddCategory
      }
    )
  ] });
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {}, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="sm:flex sm:items-center"> <div class="sm:flex-auto"> <p class="mt-2 text-sm text-gray-700">
Lista de todas las categorías disponibles en el menú.
</p> </div> <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> <button type="button" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
Agregar categoría
</button> </div> </div> <div class="mt-8 flow-root"> <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"> <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"> ${renderComponent($$result2, "CategoryList", CategoryList, { "client:load": true, "categories": categories || [], "client:component-hydration": "load", "client:component-path": "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/components/dashboard/CategoryList", "client:component-export": "default" })} </div> </div> </div> `, "header": ($$result2) => renderTemplate`<h1>Categorías</h1>` })}`;
}, "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/dashboard/categories/index.astro", void 0);

const $$file = "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/dashboard/categories/index.astro";
const $$url = "/dashboard/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
