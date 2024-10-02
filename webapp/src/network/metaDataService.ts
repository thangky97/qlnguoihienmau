import Request from "./request";
import Response, { IResponse } from '@Constants/models/responseInterface'

class MetadataService {
  static async getListCountries(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        path: '/country/get-all',
        method: "GET"
      })
        .then((res: any) => {
          if (res.statusCode === 200) {
            resolve(new Response({ data: res.data || [], isSuccess: true }));
          } else {
            resolve(new Response({ isSuccess: false, error: res.error }));
          }
        })
    });
  }

  static async getListCities(data: any) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: `/city/get-all?show=all`,
        method: "POST",
        data
      })
        .then((res: any) => {
          if (res.statusCode === 200) {
            resolve(new Response({ data: res.data || [], isSuccess: true }));
          } else {
            resolve(new Response({ isSuccess: false, error: res.error }));
          }
        })
    });
  }

  static async uploadFile(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        path: `/upload/upload-media-file`,
        method: "POST",
        data: data
      })
        .then((res: any) => {
          if (res.statusCode === 200) {
            resolve(new Response({ data: res.data || [], isSuccess: true }));
          } else {
            resolve(new Response({ isSuccess: false, error: res.error }));
          }
        })
    });
  }

}

export default MetadataService;
