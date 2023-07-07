import { useState } from "react";
import axios from "axios";

import { auth } from "firebase-config";

import config from "./config";
import { showPermanantError } from "./toastify";

export const apiAuthOptions = async (
  isFormData = false
): Promise<RequestInit> => {
  const token = await auth.currentUser?.getIdToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export async function client(endpoint: string, customConfig: RequestInit = {}) {
  const { body } = customConfig;
  const isFormData = body instanceof FormData;

  if (body) {
    customConfig.body = isFormData ? body : JSON.stringify(body);
  }

  const headers = await apiAuthOptions(isFormData);

  const options = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  let data;
  try {
    const response = await window.fetch(
      `${config.API_URL}/api/v1${endpoint}`,
      options
    );
    data = await response.json();
    if (response.status !== 200) {
      const error = { status: response.status, error: data };
      throw error;
    }

    return {
      status: response.status,
      data,
      headers: response.headers,
      url: response.url,
    };
  } catch (err) {
    if (
      err?.error?.code === "auth/id-token-expired" ||
      err?.error?.code === "auth/id-token-revoked"
    ) {
      showPermanantError("Votre session a expiré, veuillez vous reconnecter");
    }
    return Promise.reject(err.message ? err.message : data);
  }
}

client.get = function (
  endpoint: string,
  customConfig: RequestInit = {}
): Promise<any> {
  return client(endpoint, { ...customConfig, method: "GET" });
};

client.post = function (
  endpoint: string,
  body: any,
  customConfig: RequestInit = {}
): Promise<any> {
  return client(endpoint, { ...customConfig, body });
};

client.patch = function (
  endpoint: string,
  body: any,
  customConfig: RequestInit = {}
) {
  return client(endpoint, { ...customConfig, method: "PATCH", body });
};

client.delete = function (
  endpoint: string,
  body?: any,
  customConfig: RequestInit = {}
) {
  return client(endpoint, { ...customConfig, method: "DELETE", body });
};

client.postFile = function (
  endpoint: string,
  body: any,
  customConfig: RequestInit = {}
) {
  return client(endpoint, { ...customConfig, method: "POST", body });
};

export const useUploadForm = (endpoint: string) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadForm = async (formData: FormData) => {
    const token = await auth.currentUser?.getIdToken();
    const result = await axios
      .post(`${config.API_URL}/api/v1${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 50;
          setProgress(progress);
        },
      })
      .finally(() => {
        setProgress(0);
      });

    setIsSuccess(true);
    return result;
  };

  return { uploadForm, isSuccess, progress };
};
