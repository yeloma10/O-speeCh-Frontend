import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import DialogConfirm from "../components/Dialog.jsx";
import useAuthStore from "../utils/userStore.jsx";
function Choix() {
  const navigate = useNavigate();
  const { logout, isLoggedIn, user } = useAuthStore((state) => state);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  console.log(user);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="QuickStart Logo"
                className="h-6 w-6 mr-2 sm:h-10 sm:w-auto"
              />
              <h1 className="text-xl font-bold text-gray-900 sm:text-sm">
                SpeechSync
              </h1>
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setShowProfileOptions(true)}
              onMouseLeave={() => setShowProfileOptions(false)}
            >
              <img
                className="h-10 rounded-full cursor-pointer"
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.email}`}
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
          </div>
        </div>
      </header>

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Choisissez une option</h2>

          <Link
            className="inline-block mr-4 rounded bg-[#569EB5] px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-[#569EB5]"
            to={"/education"}
          >
            Education
          </Link>

          <Link
            className="inline-block mr-4 rounded bg-[#569EB5] px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-[5#69EB5]"
            to={"/marketing"}
          >
            Marketing
          </Link>
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
}

export default Choix;
