import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "./url";
export const isAccessTokenExpired = (accessToken) => {
  try {
    const decodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return true;
  }
};

export const refreshTokenIfNeeded = async (refreshToken) => {
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}account/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok)
      throw new Error("Erreur lors de la demande de rafraîchissement");

    const newData = await response.json();
    console.log("newData", newData);
    return newData.access;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    return null;
  }
};
