import Request from "./request";
import Response, { IResponse } from "@Constants/models/responseInterface";

class LoginService {
  static async login(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        path: "/user/login-user",
        method: "POST"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data || {}, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async forgotPassword(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        path: "/user/forgot-password",
        method: "POST"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data || {}, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async loginGoogle(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        method: "POST",
        path: "/user/login-google",
        data: data
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data || {}, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.message }));
        }
      });
    });
  }
}

export default LoginService;
