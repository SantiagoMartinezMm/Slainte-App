import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_1V3wy8fl.mjs';
import { manifest } from './manifest_B1u8oghf.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/signout.astro.mjs');
const _page2 = () => import('./pages/auth/callback.astro.mjs');
const _page3 = () => import('./pages/dashboard/categories.astro.mjs');
const _page4 = () => import('./pages/dashboard/products.astro.mjs');
const _page5 = () => import('./pages/dashboard.astro.mjs');
const _page6 = () => import('./pages/login.astro.mjs');
const _page7 = () => import('./pages/register.astro.mjs');
const _page8 = () => import('./pages/signin.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/signout.ts", _page1],
    ["src/pages/auth/callback.astro", _page2],
    ["src/pages/dashboard/categories/index.astro", _page3],
    ["src/pages/dashboard/products/index.astro", _page4],
    ["src/pages/dashboard/index.astro", _page5],
    ["src/pages/login.astro", _page6],
    ["src/pages/register.astro", _page7],
    ["src/pages/signin/index.astro", _page8],
    ["src/pages/index.astro", _page9]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "597035f5-b2eb-481a-b7df-9731df45243e",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
