import { z } from "zod";
import { createEventSchema } from "../baseEvent";

const AccountCreatedPayload = z.object({
	accountId: z.string(),
	status: z.string(),
});

export const AccountCreatedSchema = createEventSchema(
	"ACCOUNT_CREATED",
	AccountCreatedPayload,
);

export type AccountCreatedEvent = z.infer<typeof AccountCreatedSchema>;
