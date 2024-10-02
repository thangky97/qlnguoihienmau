import { IUser } from "./userInterface";

export interface IUserInitState extends IUser {
  isLoggedIn: boolean;
}

export interface IAction {
  type: string;
  payload?: any;
}
