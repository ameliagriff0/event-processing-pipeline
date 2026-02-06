import type { z } from "zod";
import type { schemaRegistry } from "./schemaRegistry";

export type EventSchemas = typeof schemaRegistry;
export type EventType = keyof EventSchemas;
export type AnyEvent = z.infer<EventSchemas[EventType]>;
