import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/catalogs", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export const createCatalog = async (data, token) => {
  const response = await api.post("/newCatalog", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserCatalogs = async (token) => {
  const response = await api.post("/getusercatalogs", {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addContentToCatalog = async (catalogId, file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/newContent/${catalogId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getCatalogContents = async (catalogId, token) => {
  const response = await api.get(`/${catalogId}/contents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const setCallbackUrl = async (contentId, callbackUrl, token) => {
  const response = await api.post(`/contents/${contentId}`, 
    { callBackUrl: callbackUrl }, // Wrap in an object
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" // Change back to application/json
      }
    }
  );
  return response.data;
};

export const deleteContent = async (contentId, token) => {
  const response = await api.delete(`/deletecontent/${contentId}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
};

export const deleteCatalog = async (catalogId, token) => {
  const response = await api.delete(`/${catalogId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

