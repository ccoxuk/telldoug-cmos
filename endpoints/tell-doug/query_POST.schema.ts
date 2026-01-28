import { z } from "zod";

export const schema = z.object({
  message: z.string().min(1),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      })
    )
    .optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  answer: string;
  matchedPattern: string | null;
};
