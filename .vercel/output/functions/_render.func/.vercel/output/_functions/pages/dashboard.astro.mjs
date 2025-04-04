/* empty css                                    */
import { c as createAstro, a as createComponent, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_D71bw25q.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_B8cdRYi9.mjs';
import { c as createServerClient } from '../chunks/supabase_3ag640aW.mjs';
export { renderers } from '../renderers.mjs';

async function isAuthenticated(Astro) {
  const supabase = createServerClient();
  const accessToken = Astro.cookies.get("sb-access-token")?.value;
  Astro.cookies.get("sb-refresh-token")?.value;
  if (!accessToken) {
    console.log("No se encontró token de acceso");
    return false;
  }
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error al verificar sesión:", error);
      return false;
    }
    if (!session) {
      console.log("No hay sesión activa");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error inesperado al verificar autenticación:", error);
    return false;
  }
}

async function protectDashboard(Astro) {
  const authenticated = await isAuthenticated(Astro);
  if (!authenticated) {
    console.log("Usuario no autenticado intentando acceder al dashboard");
    return Astro.redirect("/signin?error=unauthorized&error_description=Debes iniciar sesión para acceder al dashboard");
  }
  return true;
}

const $$Astro = createAstro("http://localhost:4321");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const authResult = await protectDashboard(Astro2);
  if (authResult !== true) {
    return authResult;
  }
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  session?.user?.email;
  const [profileStats, productStats, categoryStats] = await Promise.all([
    supabase.from("profiles").select("role", { count: "exact" }).eq("role", "customer"),
    supabase.from("products").select("*", { count: "exact" }),
    supabase.from("categories").select("*", { count: "exact" })
  ]);
  const totalCustomers = profileStats?.data?.length || 0;
  const totalProducts = productStats?.data?.length || 0;
  const totalCategories = categoryStats?.data?.length || 0;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {}, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"> <!-- Card de Clientes --> <div class="overflow-hidden rounded-lg bg-white shadow"> <div class="p-5"> <div class="flex items-center"> <div class="flex-shrink-0"> <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path> </svg> </div> <div class="ml-5 w-0 flex-1"> <dl> <dt class="truncate text-sm font-medium text-gray-500">Total Clientes</dt> <dd class="mt-1"> <div class="text-lg font-medium text-gray-900">${totalCustomers}</div> </dd> </dl> </div> </div> </div> <div class="bg-gray-50 px-5 py-3"> <div class="text-sm"> <a href="/dashboard/customers" class="font-medium text-cyan-700 hover:text-cyan-900">
Ver todos los clientes
</a> </div> </div> </div> <!-- Card de Productos --> <div class="overflow-hidden rounded-lg bg-white shadow"> <div class="p-5"> <div class="flex items-center"> <div class="flex-shrink-0"> <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path> </svg> </div> <div class="ml-5 w-0 flex-1"> <dl> <dt class="truncate text-sm font-medium text-gray-500">Total Productos</dt> <dd class="mt-1"> <div class="text-lg font-medium text-gray-900">${totalProducts}</div> </dd> </dl> </div> </div> </div> <div class="bg-gray-50 px-5 py-3"> <div class="text-sm"> <a href="/dashboard/products" class="font-medium text-cyan-700 hover:text-cyan-900">
Ver todos los productos
</a> </div> </div> </div> <!-- Card de Categorías --> <div class="overflow-hidden rounded-lg bg-white shadow"> <div class="p-5"> <div class="flex items-center"> <div class="flex-shrink-0"> <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path> </svg> </div> <div class="ml-5 w-0 flex-1"> <dl> <dt class="truncate text-sm font-medium text-gray-500">Total Categorías</dt> <dd class="mt-1"> <div class="text-lg font-medium text-gray-900">${totalCategories}</div> </dd> </dl> </div> </div> </div> <div class="bg-gray-50 px-5 py-3"> <div class="text-sm"> <a href="/dashboard/categories" class="font-medium text-cyan-700 hover:text-cyan-900">
Ver todas las categorías
</a> </div> </div> </div> </div> `, "header": ($$result2) => renderTemplate`<h1>Dashboard</h1>` })} `;
}, "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/dashboard/index.astro", void 0);

const $$file = "C:/Users/Santiago Martinez/Desktop/DESARROLLO BAR QR/Slainte-app-astro/src/pages/dashboard/index.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
