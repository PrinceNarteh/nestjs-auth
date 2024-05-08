export interface ActiveUserData {
  /**
   * The "subject" of the token, The value of this property is the user ID
   * that granted this token
   */
  sub: number;

  /**
   * The subjects (user) email
   */
  email: string;
}
