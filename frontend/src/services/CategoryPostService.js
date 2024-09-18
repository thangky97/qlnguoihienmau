import {
  GET_LIST_CATEGORY_POST,
  GET_ALL_CATEGORY_POST,
  CREATE_CATEGORY_POST,
  GET_DETAIL_CATEGORY_POST,
  UPDATE_CATEGORY_POST,
  DELETE_CATEGORY_POST,
} from "../constants/api";
import request from "./request";

class CategoryPostService {
  static async getListCategoryPost(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_CATEGORY_POST.path,
          method: GET_LIST_CATEGORY_POST.method,
          data,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async getAllCategoryPost(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_CATEGORY_POST.path,
          method: GET_ALL_CATEGORY_POST.method,
          query,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async addCategoryPost(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_CATEGORY_POST.path,
          method: CREATE_CATEGORY_POST.method,
          data,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async detailCategoryPost(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_CATEGORY_POST.method,
          path: GET_DETAIL_CATEGORY_POST.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateCategoryPost(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_CATEGORY_POST.method,
          path: UPDATE_CATEGORY_POST.path + "/" + data?.id,
          data,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async deleteCategoryPost(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_CATEGORY_POST.method,
          path: DELETE_CATEGORY_POST.path + "/" + data?.id,
          data,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }
}

export default CategoryPostService;
