import { ZodError } from "zod";
import { schemaRegistry } from "./schemaRegistry";
import type { AnyEvent, EventType } from "./types";

export class ValidationError extends Error {
	constructor(
		message: string,
		public readonly context?: unknown,
	) {
		super(message);
		this.name = "ValidationError";
	}
}

export function validateEvent(input: unknown): AnyEvent {
	if (typeof input !== "object" || input === null) {
		throw new ValidationError("Event must be a non-null object", { input });
	}

	if (!("eventType" in input)) {
		throw new ValidationError("Event missing required field: eventType", {
			input,
		});
	}

	const eventType = (input as { eventType: unknown }).eventType;

	if (typeof eventType !== "string") {
		throw new ValidationError("eventType must be a string", { eventType });
	}

	const schema = schemaRegistry[eventType as EventType];

	if (!schema) {
		throw new ValidationError(`Unsupported event type: ${eventType}`, {
			eventType,
			supportedTypes: Object.keys(schemaRegistry),
		});
	}

	try {
		return schema.parse(input);
	} catch (error) {
		if (error instanceof ZodError) {
			throw new ValidationError(`Schema validation failed for ${eventType}`, {
				eventType,
				errors: error.issues,
			});
		}
		throw error;
	}
}
