import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import useAuthStore from "../utils/userStore.jsx";
import { initializeMobileNavToggle } from "./../assets/js/main.js";
import DialogConfirm from "./Dialog.jsx";

const Header = () => {
  const { isLoggedIn, user, logout } = useAuthStore((state) => state);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log(isLoggedIn);
  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  useEffect(() => {
    initializeMobileNavToggle();
  }, []);

  return (
    <>
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center justify-center sm:justify-start">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="QuickStart Logo"
                  className="h-6 w-6 mr-2 sm:h-10 sm:w-auto"
                />
                <h1 className="text-xl font-bold text-gray-900 sm:text-sm">
                O'SpeeCh
                </h1>
              </Link>
            </div>

            {isLoggedIn ? (
              <>
                <div className="flex items-center">
                  <Link
                    to={"/marketing"}
                    className="bg-[#569EB5] text-white hover:bg-gray-200 px-4 py-2 text-sm font-medium rounded-md ml-4 sm:ml-6"
                  >
                    marketing
                  </Link>
                  <Link
                    to={"/education"}
                    className="bg-[#569EB5] text-white hover:bg-gray-200 px-4 py-2 text-sm font-medium rounded-md ml-4 sm:ml-6"
                  >
                    education
                  </Link>
                </div>

                <div
                  className="relative"
                  onMouseEnter={() => setShowProfileOptions(true)}
                  onMouseLeave={() => setShowProfileOptions(false)}
                >
                  <img
                    className="h-10 rounded-full cursor-pointer"
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email}`}
                    alt="Logo"
                  />

                  {showProfileOptions && (
                    <div className="card absolute right-0 mb-2- p-2 rounded-lg shadow-lg">
                      <Link
                        to="/profile"
                        className="block text-[#569EB5] hover:text-green-700"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => setDialogOpen(true)}
                        className="block text-[#569EB5] hover:text-green-700"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <Link
                  to={"/connexion"}
                  className="bg-[#569EB5] text-white hover:bg-gray-200 px-4 py-2 text-sm font-medium rounded-md ml-4 sm:ml-6"
                >
                  Connexion
                </Link>
                <Link
                  to={"/inscription"}
                  className="bg-[#569EB5] text-white hover:bg-gray-200 px-4 py-2 text-sm font-medium rounded-md ml-4 sm:ml-6"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>

        <DialogConfirm
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleLogout}
          message="Êtes-vous sûr de vouloir vous déconnecter ?"
        />
      </header>
    </>
  );
};

export default Header;
