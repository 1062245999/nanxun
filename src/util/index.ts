import axios, { AxiosResponse } from "axios";
import QS from "qs";
import { Message } from "element-ui";
import { Loading } from "element-ui";
// 环境的切换
if (process.env.NODE_ENV == "development") {
  axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
} else if (process.env.NODE_ENV == "production") {
  axios.defaults.baseURL = "https://bycl.worldmaipu.com";
}
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
axios.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response: any) => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error: any) => {
    if (error.response.status) {
      Message.error(error.response.message);
      return Promise.reject(error.response);
    }
  }
);

export function get(
  url: string,
  params: any,
  is_change_base_url?: boolean
): Promise<AxiosResponse> {
  const loadingInstance = Loading.service({ fullscreen: true });
  if (is_change_base_url) {
    axios.defaults.baseURL = "https://restapi.amap.com";
  } else {
    axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
  }
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params })
      .then((res: any) => {
        setTimeout(() => {
          loadingInstance.close();
        }, 500);
        resolve(res.data);
      })
      .catch((err: any) => {
        setTimeout(() => {
          loadingInstance.close();
        }, 500);
        reject(err.data);
      });
  });
}
export function post(url: string, params: any): Promise<AxiosResponse> {
  const loadingInstance = Loading.service({ fullscreen: true });
  axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
  return new Promise((resolve, reject) => {
    axios
      .post(url, QS.stringify(params))
      .then((res: any) => {
        setTimeout(() => {
          loadingInstance.close();
        }, 500);
        resolve(res.data);
      })
      .catch((err: any) => {
        setTimeout(() => {
          loadingInstance.close();
        }, 500);
        reject(err.data);
      });
  });
}
