import Request from "./request";
import Response, { IResponse } from "@Constants/models/responseInterface";

class DocumentService {
  static async getList(data: any) {
    return new Promise<IResponse>(resolve => {
      Request.send({
        data: data,
        method: "POST",
        path: "/course/documents/user-get-list"
      }).then((res: any) => {
        if (res.statusCode === 200) {
          resolve(new Response({ data: res?.data, isSuccess: true }));
        } else {
          resolve(new Response({ isSuccess: false, error: res.error }));
        }
      });
    });
  }
}

export default DocumentService;
