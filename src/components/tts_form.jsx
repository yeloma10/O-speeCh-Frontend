// tts_form.jsx
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import "./../assets/css/marketing.css";

const MAX_TEXT_LENGTH = 500000;

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    const synth = window.speechSynthesis;
    const populateVoices = () => {
      const voices = synth.getVoices();
      setVoices(voices);
      if (voices.length > 0) {
        setSelectedVoice(voices[0].name);
      }
    };
    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
  }, []);

  const handleTextChange = (e) => {
    if (e.target.value.length > MAX_TEXT_LENGTH) {
      setError(`Le texte ne peut pas dépasser ${MAX_TEXT_LENGTH} caractères.`);
    } else {
      setError("");
      setText(e.target.value);
    }
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.length > MAX_TEXT_LENGTH) {
      setError(`Le texte ne peut pas dépasser ${MAX_TEXT_LENGTH} caractères.`);
      return;
    }
    if (!videoFile) {
      setError("Veuillez télécharger un fichier vidéo.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("text", text);
    formData.append("language", language);
    formData.append("selectedVoice", selectedVoice);
    formData.append("videoFile", videoFile);

    try {
      const response = await axios.post(
        "https://speechsync.pythonanywhere.com/marketing/api/marketting/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (error) {
      console.error("Error processing the video:", error);
      setError("Une erreur s'est produite lors du traitement de la vidéo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tts-container">
      <h2>Formulaire de Text to Speech</h2>
      <form className="tts-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">Enter text:</label>
          <textarea id="text" value={text} onChange={handleTextChange} />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <div>
          <label htmlFor="language">Selectionnez une Language:</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en-US">Anglais (US)</option>
            <option value="fr-FR">Français</option>
            <option value="es-ES">Espagnol</option>
            <option value="de-DE">Allemand</option>
          </select>
        </div>
        <div>
          <label htmlFor="voice">Selectionnez une Voix:</label>
          <select id="voice" value={selectedVoice} onChange={handleVoiceChange}>
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="video">Télécharger une vidéo:</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
          />
        </div>
        <button
          type="submit"
          className="bg-[#569EB5] text-white flex justify-center items-center"
        >
          {loading ? <Loader className="animate-spin" /> : "Envoyer"}
        </button>
      </form>
      {downloadUrl && (
        <div className="download-container">
          <a href={downloadUrl} download="synced_video.mp4">
            Télécharger la vidéo
          </a>
          <video controls>
            <source src={downloadUrl} type="video/mp4" />
            Votre navigateur ne supporte pas la balise video.
          </video>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
