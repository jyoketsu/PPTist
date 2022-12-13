/* eslint-disable */
import axios from "axios";
import Resource from "./types/Resource";
const AUTH_URL = "https://baokudata.qingtime.cn/sgbh";

let token: string | null = null;

const request = {
  get(path: string, params?: object) {
    return new Promise(function(resolve, reject) {
      try {
        axios({
          method: "get",
          url: path,
          params: params,
          headers: {
            token: token,
          },
        }).then(function(response) {
          resolve(response.data);
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  post(path: string, params: object) {
    return new Promise(function(resolve, reject) {
      try {
        axios({
          method: "post",
          url: path,
          data: params,
          headers: {
            token: token,
          },
        }).then(function(response) {
          resolve(response.data);
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  patch(path: string, params: object) {
    return new Promise(function(resolve, reject) {
      try {
        axios({
          method: "patch",
          url: path,
          data: params,
          headers: {
            token: token,
          },
        }).then(function(response) {
          resolve(response.data);
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  delete(path: string, params: object) {
    return new Promise(function(resolve, reject) {
      try {
        axios({
          method: "delete",
          url: path,
          data: params,
          headers: {
            token: token,
          },
        }).then(function(response) {
          resolve(response.data);
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};

const qiniu = {
  remainingStorage(fileSize?: number) {
    return request.get(AUTH_URL + "/qiniuResource/remainSize", { fileSize });
  },
  updateStorage(resourceArr: Resource[]) {
    return request.post(AUTH_URL + "/qiniuResource", { resourceArr });
  },
  deleteQiniu(urls: string[]) {
    return request.delete(AUTH_URL + "/qiniuResource", { urlArr: urls });
  },
};

export default {
  request,
  qiniu,
  setToken: (_token: string) => {
    token = _token;
  },
  getToken: () => {
    return token;
  },
};
