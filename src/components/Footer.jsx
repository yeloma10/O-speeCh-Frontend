import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "./../assets/css/footer.css";
function Footer() {
  return (
    <footer className="bg-gray-100 Footer">
      <div className="mt-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-center text-teal-600">
          <div className="flex flex-col items-center">
            <Link to="/" className="logo d-flex align-items-center me-auto">
              <img src={logo} alt="QuickStart Logo" className="logo-icon" />
              <h1 className="sitename font-bold text-3xl">O'SpeeCh</h1>
            </Link>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
          Restez connecté pour les dernières innovations. Découvrez nos produits
          et services pour améliorer votre expérience numérique. Ensemble,
          façonnons l'avenir technologique.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
