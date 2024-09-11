import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import useAuthStore from "../utils/userStore.jsx";
import "./../assets/css/inscription.css";
import fetchAPI from "./../utils/API.jsx";

const LoginSchema = z.object({
  username: z
    .string({
      required_error: "Le nom d'utilisateur est requis",
    })
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Le nom d'utilisateur doit contenir uniquement des lettres et des chiffres"
    )
    .min(1, "Le nom d'utilisateur est requis"),
  first_name: z
    .string({
      required_error: "Le prénom est requis",
    })
    .min(1, "Le prénom est requis"),
  last_name: z
    .string({
      required_error: "Le nom est requis",
    })
    .min(1, "Le nom est requis"),
  email: z
    .string({
      required_error: "L'email est requis",
    })
    .email("L'email doit être valide"),
  password: z
    .string({
      required_error: "Le mot de passe est requis",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
      message:
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
    }),
});

function Inscription() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useNavigate();
  const { setUser } = useAuthStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      setIsLoading(true);
      const response = await fetchAPI(
        "account/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
        false
      );

      console.log("response", response);
      if (!response.status) {
        setUser({ ...data, password: undefined });
        router("/connexion");
      } else {
        if (response.status === 400) {
          if (response.data.username) {
            setServerError("Le nom d'utilisateur existe déja");
          } else if (response.data.email) {
            setServerError("L'email existe déja");
          }
        }
      }

      console.log("response", response);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="inscription w-[100%] h-[100vh] bg-gray-300 ">
      <div className="w-full h-full flex justify-center items-center  rounded-lg">
        <div className="flex container w-[55rem] h-auto py-4   shadow-xl bg-gray-50 rounded-lg">
          <div className="flex-1 flex justify-center items-center">
            <div className="w-[95%] h-[95%]  mx-auto rounded-lg">
              <img
                className="w-full h-full object-cover rounded-lg"
                src="https://img.freepik.com/free-vector/human-resource-management-job-analysis-sourcing-screening-selection-female-cartoon-character-reading-job-applications-cv-candidatees_335657-2682.jpg?t=st=1717206539~exp=1717210139~hmac=41e395832ccf195c49f41af3b3548bd2e16eda21afac4f552c52b4acb9d8b187&w=740"
                alt="Connexion"
              />
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <button
              type="button"
              onClick={() => router("/")}
              className="absolute top-8 left-12"
            >
              <ArrowLeft size={24} />
            </button>
            <form
              className="max-w-[20rem] mx-auto space-y-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-4">
                <h1 className="text-3xl text-center font-bold">Bienvenue</h1>
                <p className="text-center text-sm">
                  Veuillez entrer vos informations pour la création
                </p>
              </div>
              <div className="">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  id="username"
                  className="flex h-9 w-full rounded-md  bg-slate-100 px-3 py-1 text-sm text-slate-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  placeholder="Diara123"
                  {...register("username")}
                />
                {errors.username?.message && (
                  <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="nom"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nom
                </label>
                <input
                  id="nom"
                  className="flex h-9 w-full rounded-md  bg-slate-100 px-3 py-1 text-sm text-slate-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  placeholder="Akissi"
                  {...register("first_name")}
                />
                {errors.first_name?.message && (
                  <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.first_name.message}
                  </span>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="prenom"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Prenom
                </label>
                <input
                  id="prenom"
                  placeholder="Grégoire"
                  className="flex h-9 w-full rounded-md  bg-slate-100 px-3 py-1 text-sm text-slate-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  {...register("last_name")}
                />
                {errors.last_name?.message && (
                  <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.last_name.message}
                  </span>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  id="email"
                  className="flex h-9 w-full rounded-md  bg-slate-100 px-3 py-1 text-sm text-slate-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  placeholder="name@exemple.com"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="*************************"
                    className="flex h-9 w-full rounded-md  bg-slate-100 px-3 py-1 text-sm text-slate-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    {...register("password")}
                  />
                  {errors.password?.message && (
                    <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                    onClick={togglePassword}
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {serverError && (
                  <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {serverError}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <button
                  type="submit"
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 mt-2 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2 text-center flex justify-center items-center"
                >
                  {isLoading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    "Inscription"
                  )}
                </button>
              </div>
              <div className="flex justify-center">
                <p className="text-sm">
                  <span className="mr-2">J'ai déjà un compte ?</span>
                  <Link
                    to="/connexion"
                    className="text-[388da8] hover:underline cursor-pointer"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inscription;
