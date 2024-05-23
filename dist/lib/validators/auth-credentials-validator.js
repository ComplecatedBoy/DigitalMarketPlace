"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCredentialsValidator = void 0;
var zod_1 = require("zod");
exports.AuthCredentialsValidator = zod_1.z
    .object({
    email: zod_1.z.string().email({ message: "Please Enter a valid Email Address." }),
    password: zod_1.z.string().min(8, {
        message: "Password must be 8 characters long",
    }),
})
    .superRefine(function (_a, checkPassComplexity) {
    var password = _a.password;
    var containsUppercase = function (ch) { return /[A-Z]/.test(ch); };
    var containsLowercase = function (ch) { return /[a-z]/.test(ch); };
    var containsSpecialChar = function (ch) {
        return /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    };
    var countOfUpperCase = 0, countOfLowerCase = 0, countOfNumbers = 0, countOfSpecialChar = 0, countOfSpace = 0;
    for (var i = 0; i < password.length; i++) {
        var ch = password.charAt(i);
        if (ch === " ")
            countOfSpace++;
        else if (!isNaN(+ch))
            countOfNumbers++;
        else if (containsUppercase(ch))
            countOfUpperCase++;
        else if (containsLowercase(ch))
            countOfLowerCase++;
        else if (containsSpecialChar(ch))
            countOfSpecialChar++;
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
