import { z } from "zod";

export const AuthCredentialsValidator = z
  .object({
    email: z.string().email({ message: "Please Enter a valid Email Address." }),
    password: z.string().min(8, {
      message: "Password must be 8 characters long",
    }),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    console.log("yaha tak");
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0,
      countOfSpace = 0;

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (ch === " ") countOfSpace++;
      else if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    if (countOfSpace > 0) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password should not contain space",
        path: ["password"],
      });
    }
    if (countOfLowerCase < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password must contain 1 lowercase character",
        path: ["password"],
      });
    }
    if (countOfUpperCase < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password must contain 1 uppercase character",
        path: ["password"],
      });
    }
    if (countOfSpecialChar < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password must contain 1 Special character",
        path: ["password"],
      });
    }
    if (countOfNumbers < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password must contain 1 Number character",
        path: ["password"],
      });
    }
  });

export type TauthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;
