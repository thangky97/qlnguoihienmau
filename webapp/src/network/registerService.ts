import Request from "./request";
import Response, { IResponse } from '@Constants/models/responseInterface'

class RegisterService {
  static async register(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        path: '/user/register',
        method: "POST"
      })
        .then((res: any) => {
          if (res.statusCode === 200) {
            resolve(new Response({ data: res.data || {}, isSuccess: true }));
          } else {
            resolve(new Response({ isSuccess: false, error: res.error }));
          }
        })
    });
  }

  static async checkExisting(endpoint = '', data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        path: endpoint,
        method: "POST"
      })
        .then((res: any) => {
          if (res.statusCode === 200) {
            resolve(new Response({ data: res.data, isSuccess: true }));
          } else {
            resolve(new Response({ isSuccess: false, error: res.error }));
          }
        })
    });
  }
}

export default RegisterService;
