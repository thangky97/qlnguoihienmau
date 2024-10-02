import { IUser } from "./userTypes";

export interface IUserInitState extends IUser {
  isLoggedIn: boolean;
}
export interface IAction {
  type: string;
  payload?: any;
}
