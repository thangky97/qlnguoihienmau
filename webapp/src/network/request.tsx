import axios from "axios";
import { message } from "antd";
import queryString from "query-string";
import { toast } from "react-toastify";
import { FORMAT_ERROR } from "./status";
const API_URL = process.env.REACT_APP_API_BASE_URL || `http://localhost:3006`;
const getQueryString = (query: any) => {
  const result = queryString.stringify(query);

  if (!result) return "";
  return `?${result}`;
};
function send({
  method = "get",
  path,
  data = null,
  query = null,
  headers = {},
  newUrl,
  token
}: any) {
  return new Promise(resolve => {
    let url = `${API_URL}${path}${getQueryString(query)}`;

    if (newUrl) {
      url = `${newUrl}${getQueryString(query)}`;
    }
    const dataString = window.localStorage.getItem("user_data");
    if (dataString) {
      const newData = JSON.parse(dataString || "{}");
      headers.authorization = `Bearer ${token ? token : newData.token}`;
    } else {
      headers.authorization = `Bearer ${token}`;
    }

    axios({
      method: method,
      url: url,
      data: data,
      headers: headers
    })
      .then((result: any) => {
        const data = result.data;
        return resolve(data);
      })
      .catch((error: any) => {
        const { response = {} } = error;

        const result = response.data ? response.data : null;

        if (!result) {
        } else {
          const { message: data } = result;
          if (response.status === 500) {
            toast.error(FORMAT_ERROR?.[result?.error]);
          }

          if (response.status === 401 || data === 403) {
            window.localStorage.removeItem("user_data");
            message.error("Unauthorize");
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          } else if (response.status === 505) {
            window.localStorage.removeItem("user_data");
            message.error("Unauthorize");
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          } else {
            return resolve(result);
          }
        }
      });
  });
}

export default {
  send
};
