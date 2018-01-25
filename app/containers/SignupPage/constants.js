/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const USERNAME_IN = 'boilerplate/SignupPage/USERNAME_IN';
export const FULLNAME_IN = 'boilerplate/SignupPage/FULLNAME_IN';
export const EMAIL_IN = 'boilerplate/SignupPage/EMAIL_IN';
export const CONTACT_IN = 'boilerplate/SignupPage/CONTACT_IN';
export const PASSWORD_IN = 'boilerplate/SignupPage/PASSWORD_IN';
export const SIGN_UP = 'boilerplate/SignupPage/SIGN_UP';

