import type { NextConfig } from "next";
const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, "");
if (apiProxyTarget) {
  const url = new URL(apiProxyTarget);
  if (url.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(url.hostname)) {
    throw new Error("API_PROXY_TARGET deve usar HTTPS fora do ambiente local.");
  }
}

const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  async rewrites() {
    return apiProxyTarget
      ? [{ source: "/api/:path*", destination: `${apiProxyTarget}/api/:path*` }]
      : [];
  },
};
export default nextConfig;
