import { type } from "os";
import { z } from "zod";

export const QueryValidator = z.object({
  category: z.string().optional(),
  sort: z.enum(["ASC", "DSC"]).optional(),
  limit: z.number().optional(),
});

export type TqueryValidator = z.infer<typeof QueryValidator>;
