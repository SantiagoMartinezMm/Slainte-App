/* empty css                                       */
import { c as createAstro, a as createComponent, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_D71bw25q.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DDb9sHnj.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, Fragment } from 'react';
import { s as supabase } from '../../chunks/supabase_3ag640aW.mjs';
import { Transition, Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
export { renderers } from '../../renderers.mjs';

function AddProductModal({
  isOpen,
  onClose,
  onProductSaved,
  categories,
  editingProduct
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price.toString());
      setCategoryId(editingProduct.category_id.toString());
      setImageUrl(editingProduct.image_url || "");
    } else {
      resetForm();
    }
  }, [editingProduct]);
  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setImageUrl("");
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const productData = {
        name,
        description,
        price: parseFloat(price),
        category_id: parseInt(categoryId),
        image_url: imageUrl || null
      };
      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id);
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        toast.success("Product added successfully");
      }
      onProductSaved();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(editingProduct ? "Failed to update product" : "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsx(Transition, { appear: true, show: isOpen, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-10", onClose, children: [
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
        children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-25" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-center justify-center p-4 text-center", children: /* @__PURE__ */ jsx(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-out duration-300",
        enterFrom: "opacity-0 scale-95",
        enterTo: "opacity-100 scale-100",
        leave: "ease-in duration-200",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-95",
        children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all", children: [
          /* @__PURE__ */ jsx(
            Dialog.Title,
            {
              as: "h3",
              className: "text-lg font-medium leading-6 text-gray-900 mb-4",
              children: editingProduct ? "Edit Product" : "Add New Product"
            }
          ),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    id: "name",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    required: true,
                    className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    id: "description",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    rows: 3,
                    className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "price", className: "block text-sm font-medium text-gray-700", children: "Price" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    id: "price",
                    value: price,
                    onChange: (e) => setPrice(e.target.value),
                    required: true,
                    step: "0.01",
                    min: "0",
                    className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "category", className: "block text-sm font-medium text-gray-700", children: "Category" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "category",
                    value: categoryId,
                    onChange: (e) => setCategoryId(e.target.value),
                    required: true,
                    className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select a category" }),
                      categories.map((category) => /* @__PURE__ */ jsx("option", { value: category.id, children: category.name }, category.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "imageUrl", className: "block text-sm font-medium text-gray-700", children: "Image URL (optional)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    id: "imageUrl",
                    value: imageUrl,
                    onChange: (e) => setImageUrl(e.target.value),
                    className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end space-x-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: isSubmitting,
                  className: "rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50",
                  children: isSubmitting ? "Saving..." : editingProduct ? "Update" : "Add"
                }
              )
            ] })
          ] })
        ] })
      }
    ) }) })
  ] }) });
}

function ProductList({ categories }) {
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchProducts();
  }, []);
  async function fetchProducts() {
    try {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  }
  async function handleEdit(product) {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  }
  function getCategoryName(categoryId) {
    return categories.find((cat) => cat.id === categoryId)?.name || "Unknown Category";
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { children: "Loading..." });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          setEditingProduct(null);
          setIsAddModalOpen(true);
        },
        className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors",
        children: "Add New Product"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Name" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Description" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Price" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: products.map((product) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: product.name }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: product.description }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
          "$",
          product.price.toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getCategoryName(product.category_id) }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleEdit(product),
              className: "text-indigo-600 hover:text-indigo-900 mr-4",
              children: "Edit"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(product.id),
              className: "text-red-600 hover:text-red-900",
              children: "Delete"
            }
          )
        ] })
      ] }, product.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(
      AddProductModal,
      {
        isOpen: isAddModalOpen,
        onClose: () => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        },
        onProductSaved: () => {
          fetchProducts();
          setIsAddModalOpen(false);
          setEditingProduct(null);
        },
        categories,
        editingProduct
      }
    )
  ] });
}

const $$Astro = createAstro("http://localhost:4321");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return Astro2.redirect("/signin");
  }
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
  if (!profile || !profile.is_admin) {
    return Astro2.redirect("/");
  }
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Products Management" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <div class="flex justify-between items-center mb-6"> <h1 class="text-2xl font-bold text-gray-800">Products Management</h1> </div> ${renderComponent($$result2, "ProductList", ProductList, { "client:load": true, "categories": categories || [], "client:component-hydration": "load", "client:component-path": "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/components/dashboard/ProductList", "client:component-export": "default" })} </div> ` })}`;
}, "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/dashboard/products/index.astro", void 0);

const $$file = "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/dashboard/products/index.astro";
const $$url = "/dashboard/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
