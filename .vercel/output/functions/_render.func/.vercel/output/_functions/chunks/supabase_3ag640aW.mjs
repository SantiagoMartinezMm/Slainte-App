import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://myjqdrrqfdugzmuejypz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15anFkcnJxZmR1Z3ptdWVqeXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MzQ2NTMsImV4cCI6MjA0ODQxMDY1M30.xYKMe1AkPD3wxCMPR1yybGphQDvalQ62K92VVZtNerI";
const storage = {
  memoryStorage: /* @__PURE__ */ new Map(),
  getItem: (key) => {
    try {
      if (typeof window !== "undefined") {
        const value = window.localStorage.getItem(key);
        console.log("🔍 Storage.getItem (Browser):", { key, exists: !!value });
        return value;
      } else {
        if (key === "sb-auth-token-code-verifier" && globalThis.Astro?.cookies) {
          const cookieValue = globalThis.Astro.cookies.get("code_verifier")?.value;
          console.log("🔍 Storage.getItem (Server/Cookie):", {
            key,
            exists: !!cookieValue,
            value: cookieValue ? `${cookieValue.slice(0, 10)}...${cookieValue.slice(-10)}` : null
          });
          return cookieValue || null;
        }
        const value = storage.memoryStorage.get(key);
        console.log("🔍 Storage.getItem (Server/Memory):", { key, exists: !!value });
        return value ?? null;
      }
    } catch (error) {
      console.error("Error al leer del storage:", error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== "undefined") {
        console.log("💾 Storage.setItem (Browser):", { key });
        window.localStorage.setItem(key, value);
      } else {
        console.log("💾 Storage.setItem (Server):", { key });
        storage.memoryStorage.set(key, value);
        if (key === "sb-auth-token-code-verifier" && globalThis.Astro?.cookies) {
          globalThis.Astro.cookies.set("code_verifier", value, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 300
            // 5 minutos
          });
        }
      }
    } catch (error) {
      console.error("Error al escribir en el storage:", error);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== "undefined") {
        console.log("🗑️ Storage.removeItem (Browser):", { key });
        window.localStorage.removeItem(key);
      } else {
        console.log("🗑️ Storage.removeItem (Server):", { key });
        storage.memoryStorage.delete(key);
        if (key === "sb-auth-token-code-verifier" && globalThis.Astro?.cookies) {
          globalThis.Astro.cookies.delete("code_verifier");
        }
      }
    } catch (error) {
      console.error("Error al eliminar del storage:", error);
    }
  }
};
function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      storage,
      storageKey: "sb-auth-token",
      autoRefreshToken: true,
      persistSession: true
    }
  });
}
function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: false,
      storage,
      storageKey: "sb-auth-token",
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
const supabase = createBrowserClient();

export { createBrowserClient as a, createServerClient as c, supabase as s };
