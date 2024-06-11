import { SIGN_IN, SIGN_OUT } from "./action";

export interface IAccountState {
  saveAuth: boolean;
  authToken: null | string | undefined;
  username: string;
  email: string;
}

const initState: IAccountState = {
  saveAuth: false,
  authToken: null,
  username: "",
  email: "",
};

const accountReducer = (state = initState, action: any) => {
  switch (action.type) {
    case SIGN_IN: {
      const { saveAuth, authToken, username, email } = action.data;
      return {
        ...state,
        saveAuth,
        authToken,
        username,
        email,
      };
    }
    case SIGN_OUT: {
      return {
        ...state,
        saveAuth: false,
        authToken: null,
        username: "",
        email: "",
      };
    }
    default: {
      return state;
    }
  }
};

export default accountReducer;
