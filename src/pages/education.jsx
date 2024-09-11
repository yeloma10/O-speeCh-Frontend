import axios from "axios";
import { Download, Loader, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import bgLight from "../assets/img/hero-bg-light.webp";
import bgTextToSpeech from "../assets/img/text-to-speech.png";
import DialogConfirm from "../components/Dialog.jsx";
import Footer from "../components/Footer.jsx";
import useAuthStore from "../utils/userStore.jsx";
import "./../assets/css/education.css";
function Education() {
  const [text, setText] = useState("");
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [playLoading, setPlayLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [playError, setPlayError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isLoggedIn, user, logout } = useAuthStore((state) => state);
  const audioRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const schema = z.object({
    text: z.string().min(1, "Le texte ne peut pas être vide"),
    language: z.string().min(1, "Veuillez sélectionner une langue"),
    selectedVoice: z.string().min(1, "Veuillez sélectionner une voix"),
  });

  const validateForm = () => {
    try {
      schema.parse({ text, language, selectedVoice });
      return true;
    } catch (e) {
      setPlayError(e.errors[0].message);
      setDownloadError(e.errors[0].message);
      return false;
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handlePlay = async () => {
    if (!validateForm()) return;

    setPlayLoading(true);
    setPlayError("");
    try {
      const response = await axios.post(
        "https://speechsync.pythonanywhere.com/education/text-to-speech/",
        {
          text,
          language,
          selectedVoice,
        },
        {
          responseType: "arraybuffer",
        }
      );
      const audioBlob = new Blob([response.data], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
      });

      audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error generating speech:", error);
      setPlayError(
        "Une erreur est survenue lors de la génération du discours."
      );
    } finally {
      setPlayLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!validateForm()) return;

    setDownloadLoading(true);
    setDownloadError("");
    try {
      const response = await axios.post(
        "https://speechsync.pythonanywhere.com/education/text-to-speech/",
        {
          text,
          language,
          selectedVoice,
        },
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "speech.mp3");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading speech:", error);
      setDownloadError(
        "Une erreur est survenue lors du téléchargement du discours."
      );
    } finally {
      setDownloadLoading(false);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const progressValue =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progressValue);
    }
  };

  const handlePauseResume = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <div className="Education">
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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

            <div className="flex items-center">
              <Link
                to={"/marketing"}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Marketing
              </Link>
            </div>
          </div>
        </div>
      </header>
      <section id="hero" className="hero section">
        <div className="hero-bg">
          <img src={bgLight} alt="" />
        </div>
        <div className="container text-center">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h1 data-aos="fade-up">
              Bienvenue sur la section<span> Education et Formation</span>
            </h1>

            <img
              src={bgTextToSpeech}
              className="img-fluid hero-img"
              alt="Service de conversion de texte en discours"
              data-aos="zoom-out"
              data-aos-delay="300"
            />
          </div>
        </div>
      </section>
      <div className="container">
        <h1>
          Text to Speech <span>Convertisseur</span>
        </h1>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 mb-1 lg:mb-0 lg:pr-2">
            <textarea
              className="w-full h-48 bg-green-500 text-white text-base p-1 rounded-md"
              placeholder="Écrivez quelque chose ici...."
              onChange={handleTextChange}
              value={text}
            ></textarea>
            {(playError || downloadError) && (
              <p className="text-red-500">{playError || downloadError}</p>
            )}

            <div className="flex justify-start mt-1">
              <button
                type="button"
                id="play"
                className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 flex items-center"
                onClick={handlePlay}
                disabled={playLoading || downloadLoading || isPlaying}
              >
                {playLoading ? (
                  <Loader className="animate-spin mr-2" />
                ) : (
                  <Play className="mr-2" />
                )}
                Lire
              </button>
              <button
                type="button"
                id="pause"
                className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 flex items-center"
                onClick={handlePauseResume}
                disabled={playLoading || downloadLoading}
              >
                {isPlaying ? (
                  <Pause className="mr-2" />
                ) : (
                  <Play className="mr-2" />
                )}
                {isPlaying ? "Pause" : "Resume"}
              </button>
              <button
                type="button"
                id="download"
                className="bg-[#569EB5] text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleDownload}
                disabled={playLoading || downloadLoading}
              >
                {downloadLoading ? (
                  <Loader className="animate-spin mr-2" />
                ) : (
                  <Download className="mr-2" />
                )}
                Télécharger
              </button>
            </div>
            {isPlaying && (
              <div className="w-full bg-gray-200 rounded-full mt-2">
                <div
                  className="bg-green-500 text-xs leading-none py-1 text-center text-white rounded-full"
                  style={{ width: `${progress}%` }}
                >
                  {Math.round(progress)}%
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 lg:pl-2">
            <div className="w-full md:w-1/2 lg:w-auto mb-4 md:mb-0">
              <label htmlFor="language" className="block text-gray-700">
                Sélectionnez la langue:
              </label>
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-green-400"
              >
                <option value="">Choisir une langue</option>
                <option value="en-US">Anglais</option>
                <option value="fr-FR">Français</option>
                {/* Ajoutez d'autres langues ici */}
              </select>
            </div>
            <div className="w-full md:w-1/2 lg:w-auto">
              <label htmlFor="voice" className="block text-gray-700">
                Sélectionnez la voix:
              </label>
              <select
                id="voice"
                value={selectedVoice}
                onChange={handleVoiceChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-green-400"
              >
                <option value="">Choisir une voix</option>
                <option value="Male">Homme</option>
                <option value="Female">Femme</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <DialogConfirm
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleLogout}
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
      />
    </div>
  );
}

export default Education;
