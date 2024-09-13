import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fetchApi from "../utils/API.jsx";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Récupère le jeton de réinitialisation depuis l'URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Vérifier si le token est valide, si nécessaire
    // Vous pouvez également ajouter une vérification pour le token ici
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchApi(
        `account/reset-password/${token}`,
        {
          method: "POST",
          body: JSON.stringify({ newPassword }),
          headers: { "Content-Type": "application/json" },
        },
        false
      );
      setMessage("Votre mot de passe a été réinitialisé avec succès.");
      navigate("/connexion");
    } catch (error) {
      console.error("Failed to reset password", error);
      setMessage("Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-16">
      <div className="p-8 mt-24 bg-white shadow mx-auto max-w-md">
        <h1 className="text-2xl font-medium text-gray-700 text-center mb-4">Réinitialiser votre mot de passe</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          {message && <p className="text-red-500 mb-4">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="text-white py-2 px-4 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
