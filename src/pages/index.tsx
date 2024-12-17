import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isCatalogExist } from "../services/api";

export default function Home() {
  const [catalogId, setCatalogId] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
    const savedCatalogs = JSON.parse(localStorage.getItem("catalogs") || "[]");
    setCatalogs(savedCatalogs);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await isCatalogExist(catalogId);
      console.log("Response:", response);
      if (response) {
        // Add to localStorage if catalog exists
        const updatedCatalogs = [...catalogs, catalogId];
        setCatalogs(updatedCatalogs);
        localStorage.setItem("catalogs", JSON.stringify(updatedCatalogs));

        // Redirect to the predicts page
        router.push(`/predicts/${catalogId}`);
      } else {
        alert("Catalog does not exist.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToCatalog = (id: string) => {
    router.push(`/predicts/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="w-full bg-blue-500 text-white p-4">
        <div className="flex justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Catalog App</h1>
          <div>
            {accessToken ? (
              <>
                <button onClick={() => router.push("/profile")} className="mr-4">
                  Profile
                </button>
                <button onClick={handleLogout} className="ml-4">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => router.push("/login")} className="mr-4">
                  Login
                </button>
                <button onClick={() => router.push("/register")}>
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
  
      {/* Main Content */}
      <main className="flex flex-grow justify-center items-center">
        <div className="w-full max-w-lg p-6 bg-white shadow rounded">
          {/* Get Catalog Section */}
          <h2 className="text-2xl font-bold mb-6 text-center">Get Catalog</h2>
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-6">
              <label
                htmlFor="catalogId"
                className="block text-sm font-medium text-gray-700"
              >
                Catalog ID
              </label>
              <input
                id="catalogId"
                type="text"
                value={catalogId}
                onChange={(e) => setCatalogId(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Checking..." : "Get Catalog"}
            </button>
          </form>
  
          {/* Previously Added Catalogs */}
          <h3 className="text-xl font-bold mb-4">Previously Added Catalogs</h3>
          <ul className="list-disc pl-5 space-y-2">
            {catalogs.map((id) => (
              <li key={id} className="flex justify-between items-center">
                <span className="text-sm">{id}</span>
                <button
                  onClick={() => handleGoToCatalog(id)}
                  className="text-blue-500 underline"
                >
                  Go to Catalog
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
  
}
