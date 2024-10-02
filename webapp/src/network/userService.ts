import Request from "./request";
import Response, { IResponse } from "@Constants/models/responseInterface";

class UserService {
  static async updateUserInfo(data = {}, token = undefined) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        path: "/user/user-update-info",
        method: "POST",
        token
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async updateProfile(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: `/user/user-update-info`,
        method: "POST",
        data: data
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data || [], isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async changePassowrd(data = {}, token = undefined) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        path: "/user/change-password",
        method: "POST",
        token
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async getDetail() {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: "/user/get-detail",
        method: "GET"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async getDetailUser_certificate(productId: any, usersId: any) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        method: "GET",
        path: "/user_certificate/user-get-detail",
        query: { productId, usersId }
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }
  static async getNotification(productId: any, usersId: any) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        method: "GET",
        path: "/notification/user-get-detail",
        query: { productId, usersId }
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }
}

export default UserService;
