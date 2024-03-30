import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required.",
    })
    .trim()
    .min(1, {
      message: "First name is required.",
    }),
  lastName: z
    .string({
      required_error: "Last name is required.",
    })
    .trim()
    .min(1, {
      message: "Last name is required",
    }),
  email: z
    .string({
      required_error: "E-mail is required.",
    })
    .email({
      message: "Please provide a valid e-mail.",
    })
    .trim()
    .min(1, {
      message: "E-mail is required.",
    }),
  password: z
    .string({
      required_error: "Password is required.",
    })
    .trim()
    .min(6, {
      message: "Password must have at least 6 characters.",
    }),
});

export const updateUserSchema = createUserSchema.partial().strict({
  message: "Some provided field is not allowed.",
});
