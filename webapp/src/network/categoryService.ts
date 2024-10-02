import Request from "./request";
import Response, { IResponse } from "@Constants/models/responseInterface";

class CategoryService {
  static async getListCategory(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        method: "POST",
        path: "/category/user-get-list"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async getListCategories(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        method: "POST",
        path: "/categories/user-get-list"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async getListCategoryPost(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        method: "POST",
        path: "/categoryPost/user-get-list"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res.data, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }

  static async getListCompanyInformation(data = {}) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        method: "POST",
        path: "/company_infomation/user-get-list"
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

export default CategoryService;
