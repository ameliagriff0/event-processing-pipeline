import { AccountCreatedSchema } from "./schemas/accountCreated";
import { AccountUpdatedSchema } from "./schemas/accountUpdated";

export const schemaRegistry = {
	ACCOUNT_CREATED: AccountCreatedSchema,
	ACCOUNT_UPDATED: AccountUpdatedSchema,
} as const;
