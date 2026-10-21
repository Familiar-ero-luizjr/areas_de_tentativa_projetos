import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { URL } from "node:url";
import { db } from "../data/database/db.ts";
import { authService } from "../modules/auth/auth.service.ts";
import { runFunction } from "../modules/functions/functions.runner.ts";
import { functionNames } from "../modules/functions/functions.registry.ts";
import { stripeService } from "../modules/stripe/stripe.service.ts";
import { mapsService } from "../modules/maps/maps.service.ts";
import { scenarioRegistry, scenarioById } from "../scenarios/registry.ts";
import { runScenario } from "../scenarios/scenario.engine.ts";
import { chaosEngine } from "../chaos/chaos.engine.ts";
import { logger } from "../logs/logger.ts";

const port = Number(process.env.MOCK_API_PORT ?? 8787);
const host = process.env.MOCK_API_HOST ?? "0.0.0.0";

const json = (res: ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
  });
  res.end(JSON.stringify(body));
};

async function body(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (!chunks.length) return {};
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function collectionCounts() {
  const snap = db.snapshot();
  return Object.fromEntries(Object.entries(snap).map(([name, items]) => [name, items.length]));
}

const server = http.createServer(async (req, res) => {
  if (!req.url) return json(res, 400, { ok:false, error:"URL ausente" });
  if (req.method === "OPTIONS") return json(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
  const parts = url.pathname.split("/").filter(Boolean);
  const method = req.method ?? "GET";
  try {
    if (url.pathname === "/health" && method === "GET") return json(res, 200, { ok:true, data:{ service:"advogadoja-mock-services", status:"ok", at:new Date().toISOString(), collections:collectionCounts() } });
    if (url.pathname === "/api/firestore" && method === "GET") return json(res, 200, { ok:true, data:collectionCounts() });
    if (parts[0] === "api" && parts[1] === "firestore" && parts[2]) {
      await chaosEngine.before("firestore");
      const collection = decodeURIComponent(parts[2]); const id = parts[3] ? decodeURIComponent(parts[3]) : null;
      if (method === "GET") return json(res, 200, { ok:true, data:id ? (db.find(collection,id) ?? null) : db.collection(collection) });
      if (method === "POST" && !id) { const input=await body(req); const next={id:input.id ?? `${collection}-${Date.now()}`, ...input}; db.insert(collection,next); return json(res,201,{ok:true,data:next}); }
      if (method === "PATCH" && id) { const next=db.update(collection,id,await body(req)); return next ? json(res,200,{ok:true,data:next}) : json(res,404,{ok:false,error:"Documento não encontrado"}); }
      if (method === "DELETE" && id) { const removed=db.remove(collection,id); return json(res, removed?200:404, removed?{ok:true,data:true}:{ok:false,error:"Documento não encontrado"}); }
    }
    if (url.pathname === "/api/functions" && method === "GET") return json(res,200,{ok:true,data:functionNames});
    if (parts[0] === "api" && parts[1] === "functions" && parts[2] && method === "POST") return json(res,200,{ok:true,data:await runFunction(decodeURIComponent(parts[2]),await body(req))});
    if (url.pathname === "/api/auth/sign-in" && method === "POST") { await chaosEngine.before("auth"); const input=await body(req); return json(res,200,{ok:true,data:await authService.signIn(String(input.email??""),String(input.password??""))}); }
    if (url.pathname === "/api/auth/sign-out" && method === "POST") { await chaosEngine.before("auth"); await authService.signOut(); return json(res,200,{ok:true,data:true}); }
    if (url.pathname === "/api/stripe/checkout" && method === "POST") { await chaosEngine.before("stripe"); return json(res,200,{ok:true,data:await stripeService.createCheckout(await body(req))}); }
    if (url.pathname === "/api/stripe/webhook" && method === "POST") { await chaosEngine.before("stripe"); return json(res,200,{ok:true,data:await stripeService.handleWebhook(await body(req))}); }
    if (url.pathname === "/api/maps/location" && method === "GET") { await chaosEngine.before("maps"); return json(res,200,{ok:true,data:await mapsService.currentLocation()}); }
    if (url.pathname === "/api/maps/geocode" && method === "POST") { await chaosEngine.before("maps"); const input=await body(req); return json(res,200,{ok:true,data:await mapsService.geocode(String(input.address??""))}); }
    if (url.pathname === "/api/maps/distance" && method === "POST") { await chaosEngine.before("maps"); const input=await body(req); return json(res,200,{ok:true,data:await mapsService.distance(input.a,input.b)}); }
    if (url.pathname === "/api/scenarios" && method === "GET") return json(res,200,{ok:true,data:scenarioRegistry.map(({id,title,description})=>({id,title,description}))});
    if (parts[0] === "api" && parts[1] === "scenarios" && parts[2] && parts[3] === "run" && method === "POST") { const scenario=scenarioById[decodeURIComponent(parts[2])]; if(!scenario)return json(res,404,{ok:false,error:"Cenário não encontrado"}); return json(res,200,{ok:true,data:await runScenario(scenario)}); }
    if (url.pathname === "/api/chaos" && method === "GET") return json(res,200,{ok:true,data:chaosEngine.get()});
    if (url.pathname === "/api/chaos" && method === "POST") return json(res,200,{ok:true,data:chaosEngine.set(await body(req))});
    if (url.pathname === "/api/logs" && method === "GET") return json(res,200,{ok:true,data:logger.entries});
    if (url.pathname === "/api/admin/reset" && method === "POST") { db.reset(); chaosEngine.reset(); logger.clear(); await authService.signOut(); return json(res,200,{ok:true,data:{reset:true,collections:collectionCounts()}}); }
    return json(res,404,{ok:false,error:`Rota não encontrada: ${method} ${url.pathname}`});
  } catch (error) {
    const message=error instanceof Error?error.message:String(error); logger.write("error","http.error",{method,path:url.pathname,message}); return json(res,500,{ok:false,error:message});
  }
});

server.listen(port, host, () => console.log(`AdvogadoJá Mock API em http://localhost:${port}`));
