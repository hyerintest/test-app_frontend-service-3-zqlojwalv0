export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export const signIn = (data: Object) => ({
  type: SIGN_IN,
  data: data,
});

export const signOut = () => ({
  type: SIGN_OUT,
  data: {},
});
