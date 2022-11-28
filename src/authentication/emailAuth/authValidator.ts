import { body } from "express-validator";

class AuthValidator {
    checkUserLogin() {
        return [
            body('email')
                .notEmpty()
                .withMessage('email should not be empty')
                .isEmail()
                .withMessage('Provide a valid email address'),
            body('password')
                .notEmpty()
                .withMessage('password should not be empty')
                .isLength({ min: 5 })
                .withMessage('Minimum Password length is 5'),
        ];
    }
    checkUserForgotPassword() {
        return [
            body('email')
                .notEmpty()
                .withMessage('email should not be empty')
                .isEmail()
                .withMessage('Provide a valid email address')
        ];
    }
    checkUserPasswordReset() {
        return [
            body('UserId')
                .notEmpty()
                .withMessage('email should not be empty')
                .isNumeric()
                .withMessage('Provide a valid User id'),
            body('token')
                .notEmpty()
                .withMessage('token should not be empty'),
            body('password')
                .notEmpty()
                .withMessage('password should not be empty')
                .isLength({ min: 5 })
                .withMessage('Minimum Password length is 5'),
        ];
    }

    checkUserActivate() {
        return [
            body('UserId')
                .notEmpty()
                .withMessage('email should not be empty')
                .isNumeric()
                .withMessage('Provide a valid User id'),
            body('token')
                .notEmpty()
                .withMessage('token should not be empty'),
        ];
    }
}

export default new AuthValidator();