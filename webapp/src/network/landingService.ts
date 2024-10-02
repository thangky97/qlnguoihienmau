import Request from "./request";
import Response, { IResponse } from "@Constants/models/responseInterface";

export default class LandingService {
  static async getDetailPost(id: any) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: `/envent/get-detail-user/${id}`,
        method: "GET"
      })
        .then(res => {
          resolve({ data: res, isSuccess: true });
        })
        .catch(res => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async getDataAbout(lang: string) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: `/about/list?lang=${lang}`,
        method: "GET"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data || {}, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async getContactUs(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: `/about/contact`,
        method: "POST",
        data: data
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data || {}, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async getDataSetting() {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: `/setting/detail`,
        method: "GET"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data || {}, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async getDataSlider(lang: string) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: `/slider/list?lang=${lang}`,
        method: "GET"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data || {}, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async getContent(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: `/envent/find-user`,
        method: "POST",
        data
      })
        .then(res => {
          resolve({ data: res, isSuccess: true });
        })
        .catch(res => {
          resolve({ isSuccess: false });
        });
    });
  }
}
