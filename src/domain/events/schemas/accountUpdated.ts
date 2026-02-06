import { z } from "zod";
import { createEventSchema } from "../baseEvent";

const AccountStatus = z.enum([
	"active",
	"suspended",
	"closed",
	"pending_verification",
]);

const AccountUpdatedPayload = z.object({
	accountId: z.string().uuid(),
	status: AccountStatus,
	updatedFields: z.array(z.string()).optional(),
	previousStatus: AccountStatus.optional(),
});

export const AccountUpdatedSchema = createEventSchema(
	"ACCOUNT_UPDATED",
	AccountUpdatedPayload,
);

export type AccountUpdatedEvent = z.infer<typeof AccountUpdatedSchema>;
export type AccountStatusType = z.infer<typeof AccountStatus>;
