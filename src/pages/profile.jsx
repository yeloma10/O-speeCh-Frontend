import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DialogConfirm from "../components/Dialog.jsx";
import fetchApi from "../utils/API.jsx";
import useAuthStore from "../utils/userStore";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn, setIsLoading, setUser } = useAuthStore(
    (state) => state
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetPasswordMessage, setResetPasswordMessage] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi(
        `account/reset-password`,
        {
          method: "POST",
          body: JSON.stringify({ email: resetPasswordEmail }),
          headers: { "Content-Type": "application/json" },
        },
        true
      );
      setResetPasswordMessage("Un e-mail de réinitialisation a été envoyé.");
    } catch (error) {
      console.error("Failed to send reset password email", error);
      setResetPasswordMessage("Échec de l'envoi de l'e-mail de réinitialisation.");
    } finally {
      setIsLoading(false);
      setResetPasswordDialogOpen(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/connexion");
      return;
    }

    const { user_id } = jwtDecode(token);
    setIsLoading(true);

    const getUser = async () => {
      try {
        const response = await fetchApi(
          `account/profile/${user_id}`,
          { method: "GET" },
          true
        );
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    if (!isLoggedIn) navigate("/connexion");
  }, [navigate, setIsLoading, setUser]);

  return (
    <div className="p-16">
      <div className="p-8 mt-24 bg-white shadow">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 flex items-center justify-center w-32 h-32 mx-auto -mt-24 text-gray-500 bg-gray-100 rounded-full shadow-2xl">
              <img
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email}`}
                className="w-24 h-24"
                alt="Profile"
              />
            </div>
          </div>
          <div className="flex justify-between mt-32 space-x-8 md:mt-0 md:justify-center">
            <button
              onClick={() => setDialogOpen(true)}
              className="text-white py-2 px-4 uppercase rounded bg-gray-400 hover:bg-gray-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              Déconnexion
            </button>
            <Link to="/choix">
              <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                Retour au choix
              </button>
            </Link>
          </div>
        </div>
        <div className="pb-12 mt-20 text-center border-b">
          <div>
            <h1 className="text-4xl font-medium text-gray-700">
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="mt-3 font-light text-gray-600">{user?.email}</p>
            <button
              onClick={() => setResetPasswordDialogOpen(true)}
              className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
            >
             Réinitialiser le mot de passe
            </button>
          </div>
        </div>
      </div>

      <DialogConfirm
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleLogout}
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
      />
      <DialogConfirm
        isOpen={resetPasswordDialogOpen}
        onClose={() => setResetPasswordDialogOpen(false)}
        onConfirm={handleResetPassword}
        message={
          <div>
            <input
              type="email"
              value={resetPasswordEmail}
              onChange={(e) => setResetPasswordEmail(e.target.value)}
              placeholder="Votre e-mail"
              className="border p-2 rounded mb-2 w-full"
            />
            <p className="text-gray-700">{resetPasswordMessage}</p>
          </div>
        }
        confirmButtonText="Envoyer l'e-mail"
      />
    </div>
  );
};

export default Profile;
