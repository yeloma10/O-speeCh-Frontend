import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import DialogConfirm from "../components/Dialog";
import fetchAPI from "../utils/API.jsx";
import useAuthStore from "../utils/userStore.jsx";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, isLoggedIn, user } = useAuthStore((state) => state);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDeconnectionOpen, setDeconnectionOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const fetchUsers = async () => {
    const response = await fetchAPI("account/api/all/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      const withoutAdmin = response.filter((item) => item.username !== "admin");
      setUsers(withoutAdmin);
      setFilteredUsers(withoutAdmin);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin-login");
    }
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  const handleDeleteUser = async (id) => {
    const response = await fetchAPI(`account/api/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log("User deleted:", response);
      fetchUsers();
    }
  };

  const openDeleteDialog = (userId) => {
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUserId) {
      handleDeleteUser(selectedUserId);
      setDialogOpen(false);
    }
  };

  return (
    <>
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
                O&apos;Speech
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
                    onClick={() => setDeconnectionOpen(true)}
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
        <div className="w-screen bg-gray-50">
          <div className="mx-auto max-w-screen-xl px-2 py-10">
            <div className="mt-4 w-full">
              <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
                <form className="relative flex w-full max-w-2xl items-center">
                  <svg
                    className="absolute left-2 block h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" className=""></circle>
                    <line
                      x1="21"
                      y1="21"
                      x2="16.65"
                      y2="16.65"
                      className=""
                    ></line>
                  </svg>
                  <input
                    type="text"
                    name="search"
                    className="h-12 w-full border-b-gray-400 bg-transparent py-4 pl-12 text-sm outline-none focus:border-b-2"
                    placeholder="Rechercher par nom d'utilisateur ou email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl bg-white px-6 shadow lg:px-4">
              <table className="min-w-full border-collapse border-spacing-y-2 border-spacing-x-2">
                <thead className="hidden border-b lg:table-header-group">
                  <tr className="">
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                      Username
                    </td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                      Nom
                    </td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                      Prenom
                    </td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                      Email
                    </td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                      Actions
                    </td>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((item, index) => (
                    <tr key={index} className="">
                      <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-600 sm:px-3 lg:table-cell">
                        {item.username}
                      </td>
                      <td className="whitespace-no-wrap hidden py-4 text-left text-sm text-gray-600 sm:px-3 lg:table-cell">
                        {item.first_name}
                      </td>
                      <td className="whitespace-no-wrap hidden py-4 text-left text-sm text-gray-600 sm:px-3 lg:table-cell">
                        {item.last_name}
                      </td>
                      <td className="whitespace-no-wrap hidden py-4 text-left text-sm text-gray-600 sm:px-3 lg:table-cell">
                        {item.email}
                      </td>

                      <td className="py-4 text-sm text-gray-600">
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded"
                          onClick={() => openDeleteDialog(item.id)}
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <DialogConfirm
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Confirmer la suppression"
        content="Voulez-vous vraiment supprimer cet utilisateur ?"
      />

      <DialogConfirm
        isOpen={isDeconnectionOpen}
        onClose={() => setDeconnectionOpen(false)}
        onConfirm={handleLogout}
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
      />
    </>
  );
}
