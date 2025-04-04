import { c as createServerClient } from '../../../chunks/supabase_3ag640aW.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ cookies, redirect }) => {
  const supabase = createServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error al cerrar sesión:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return new Response(JSON.stringify({ success: true }), {
    status: 200
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
