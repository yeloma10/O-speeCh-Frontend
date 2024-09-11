// Api.jsx

import { BASE_URL } from "./url";

const fetchApi = async (endpoint, options = {}, besoinAuth = false) => {
  const accessToken = localStorage.getItem("accessToken") || "";
  const refreshToken = localStorage.getItem("refreshToken") || "";

  const headersParDefaut = {
    "Content-Type": "application/json",
  };

  // Ajoutez le header Authorization uniquement si la requête nécessite une authentification
  const headers = besoinAuth
    ? {
        ...headersParDefaut,
        Authorization: `Bearer ${accessToken}`,
      }
    : headersParDefaut;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  console.log("response", response);
  const data = await response.json();
  if (!response.ok) {
    return {
      status: response.status,
      data,
    };
  }
  return data;
};

export default fetchApi;
