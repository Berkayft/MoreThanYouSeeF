import axios from "axios";

const api = axios.create({
  baseURL: "/api/catalogs", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

const authApi = axios.create({
  baseURL: "/api/auth", // Backend URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const createCatalog = async (data, token) => {
  const response = await api.post("/newCatalog", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const handleLogin = async (data) => {
  const jsonData = JSON.stringify(data);
  const response = await authApi.post("/login", jsonData);
  return response.data;
}

export const handleRegister = async (data) => {
  const jsonData = JSON.stringify(data);
  const response = await authApi.post("/register", jsonData);
  return response.data;
}

export const getUserCatalogs = async (token) => {
  const response = await api.post("/getusercatalogs", {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addContentToCatalog = async (catalogId, file, token) => {
    try {
    // Resmi yeniden boyutlandır
    const resizedFile = await resizeImage(file, 244, 244);

    const formData = new FormData();
    formData.append("file", resizedFile);

    const response = await api.post(`/newContent/${catalogId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Hata:", err);
    throw err;
  }
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

export const resizeImage = async (file, width, height) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            reject(new Error("Resim dönüştürme hatası"));
          }
        },
        file.type,
        1 // kalite (1 = maksimum kalite)
      );
    };
    img.onerror = (err) => reject(err);
    img.src = URL.createObjectURL(file);
  });
};


export const getCallBack = async (catalogId, file) => {

  try {
    const resizedFile = await resizeImage(file, 244, 244);

    const formData = new FormData();
    formData.append("file", resizedFile);

    const response = await api.post(`/matchImage/${catalogId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
    return response.data; // URL string
  } catch (err) {
    console.error("Hata:", err);
    throw err;
  }
};

export const isCatalogExist = async (catalogId) => {
  const response = await api.post(`/isCatalogExist/${catalogId}`,{
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.data;

}
