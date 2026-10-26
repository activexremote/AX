import "server-only";

import { AsyncLocalStorage } from "node:async_hooks";

import type { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
//  Quién llama cuando la llamada viene del conector de Claude
//
//  Las acciones de banners y publicaciones comprueban la sesión del navegador
//  (cookies). Desde Claude no hay cookies: hay un token que /api/mcp ya ha
//  validado (sólo administradores). Mientras dura esa llamada, este contexto
//  les dice quién es y les da un cliente de servidor, y las acciones hacen
//  exactamente lo mismo que desde el panel, con sus mismas comprobaciones.
// ══════════════════════════════════════════════════════════

type Cliente = Awaited<ReturnType<typeof createClient>>;

export type ContextoMcp = { supabase: Cliente; userId: string; origen: string };

const almacen = new AsyncLocalStorage<ContextoMcp>();

export const conContextoMcp = <T,>(ctx: ContextoMcp, fn: () => Promise<T>) => almacen.run(ctx, fn);

/** El contexto del conector, o null si la llamada viene del panel. */
export const contextoMcp = (): ContextoMcp | null => almacen.getStore() ?? null;
