export const errorMessages: Record<string, string> = {
  OAuthSignin: "There was an error in constructing an authorization URL. Please try again later.",
  OAuthCallback: "There was an error in handling the response. Please try another authentication method.",
  OAuthCreateAccount: "There was an error in creating a new account. Please try another authentication method.",
  EmailCreateAccount: "There was an error in creating a new account. Please try another authentication method.",
  Callback: "There was an error handling your request. Please try another authentication method.",
  OAuthAccountNotLinked: "Please login with the method you used to sign up.",
  EmailSignin: "There was an error sending the verification email. Please try again later.",
  CredentialsSignin: "The credentials you provided were incorrect. Please try again.",
  SessionRequired: "You must be signed in to view this page.",
  Default: "An error occurred. Please try again later."
}