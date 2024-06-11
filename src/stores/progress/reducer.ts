import { SHOW_PROGRESS, HIDE_PROGRESS } from "./action";

export interface IProgressState {
  show: boolean;
}

const initState: IProgressState = {
  show: false,
};

const progressReducer = (state = initState, action: any) => {
  switch (action.type) {
    case SHOW_PROGRESS: {
      return {
        show: true,
      };
    }
    case HIDE_PROGRESS: {
      return {
        show: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default progressReducer;
