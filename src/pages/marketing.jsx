import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgMarketing from "../assets/img/hero-bg-light.webp";
import MarketingImg from "../assets/img/marketing.jpg";
import DialogConfirm from "../components/Dialog.jsx";
import Footer from "../components/Footer.jsx";
import TextToSpeech from "../components/tts_form.jsx";
import useAuthStore from "../utils/userStore.jsx";
import "./../assets/css/marketing.css";

function Marketing() {
  const { isLoggedIn, user, logout } = useAuthStore((state) => state);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log("User data:", user);

  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <div>
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Bouton de retour */}
              <Link
                to={"/choix"}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Retour au choix
              </Link>

              {/* Logo ou image arrondie avec gestion du hover */}
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

                {/* La carte affichée lorsque showProfileOptions est true */}
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

              {/* Autres options dans le header */}
              <div className="flex items-center">
                <Link
                  to={"/education"}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Education
                </Link>
              </div>
            </div>
          </div>
        </header>
        <section id="hero" className="hero section">
          <div className="hero-bg">
            <img src={bgMarketing} alt="" />
          </div>
          <div className="container text-center">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h1 data-aos="fade-up">
                Bienvenue sur la section<span> Marketing Digitale</span>
              </h1>

              <img
                src={MarketingImg}
                className="img-fluid hero-img"
                alt="Service de conversion de texte en discours"
                data-aos="zoom-out"
                data-aos-delay="300"
              />
            </div>
          </div>
        </section>
        <TextToSpeech />
        <Footer />

        <DialogConfirm
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleLogout}
          message="Êtes-vous sûr de vouloir vous déconnecter ?"
        />
      </div>
    </>
  );
}

export default Marketing;
