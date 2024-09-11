import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DialogConfirm from "../components/Dialog.jsx";
import fetchApi from "../utils/API.jsx";
import useAuthStore from "../utils/userStore";
const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn, setIsLoading, setUser } = useAuthStore(
    (state) => state
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
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
              Deconnexion
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
              <span className="font-light text-gray-500"></span>
            </h1>
            <p className="mt-3 font-light text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
      <DialogConfirm
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleLogout}
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
      />
    </div>
  );
};

export default Profile;
