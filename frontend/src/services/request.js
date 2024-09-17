// @ts-nocheck
import axios from "axios";
import { HOST } from "./../constants/url";
import { toast } from "react-toastify";
import { getQueryString } from "../helper/common";
import { FORMAT_ERROR } from "../constants/status";
function send({
  method = "get",
  path,
  data = null,
  query = null,
  headers = {},
  newUrl,
}) {
  return new Promise((resolve, reject) => {
    let url = HOST + `${path}${getQueryString(query)}`;
    if (newUrl) {
      url = `${newUrl}${getQueryString(query)}`;
    }
    let token = window.localStorage.getItem("accessToken");

    if (token) {
      const newToken = token.replace(/"/g, "");
      headers.Authorization = `Bearer ${newToken}`;
    }
    axios({
      method,
      url,
      data,
      headers,
    })
      .then((result) => {
        const data = result.data;
        return resolve(data);
      })
      .catch((error) => {
        const { response = {} } = error;

        const result = response.data ? response.data : null;
        console.log("====================================");
        console.log(HOST + `/product/import` == url);
        console.log("====================================");
        if (!result) {
          toast.warn("Somethig was wrong");
        } else {
          const { statusCode, message: data } = result;
          if (statusCode == 401) {
            if (!HOST + `/product/import` == url) {
              toast.warn(FORMAT_ERROR?.[result?.message]);
            }
            window.localStorage.clear();
            // window.location.href = "/";
            return reject();
          } else if (statusCode == 400 || statusCode == 404) {
            if (!HOST + `/product/import` == url) {
              toast.warn(FORMAT_ERROR?.[result?.message] || result?.message);
            } else {
              toast.warn(FORMAT_ERROR?.[result?.message] || result?.message);
            }
            // return resolve(result);
            return reject(error);
          } else if (statusCode === 505) {
            toast.warn("Unauthorized");
          } else if (
            statusCode === 401 &&
            data === "Expired token received for JSON Web Token validation"
          ) {
            // window.localStorage.clear();
            // window.location.href = "/";
          } else if (statusCode) {
            toast.warn(data || "Somethig was wrong");
          } else {
            return resolve(result.data);
          }
        }
      });
  });
}

export default {
  send,
};
