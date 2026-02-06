import { z } from "zod";

// Shared base schema for all events
export const BaseEventSchema = z.object({
	eventId: z.string().uuid(),
	source: z.string().min(1),
	timestamp: z.string().datetime(),
	version: z.string().default("1.0"),
	correlationId: z.string().uuid(),
	causationId: z.string().uuid().optional(),
});

// Helper to build event schemas
export function createEventSchema<T extends string, P extends z.ZodType>(
	eventType: T,
	payloadSchema: P,
) {
	return BaseEventSchema.extend({
		eventType: z.literal(eventType),
		payload: payloadSchema,
	});
}
