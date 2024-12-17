import { useState, useEffect } from "react";
import { getUserCatalogs, deleteCatalog, createCatalog } from "../../services/api";
import Link from "next/link";

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catalogName, setCatalogName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await createCatalog({ name: catalogName }, token);
      setMessage("Catalog created successfully!");

      // Refresh catalogs after creation
      const updatedCatalogs = await getUserCatalogs(token);
      setCatalogs(updatedCatalogs);

      setCatalogName("");
    } catch (error) {
      setMessage("Error creating catalog");
      console.error(error);
    }
  };

  const handleDeleteCatalog = async (catalogId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await deleteCatalog(catalogId, token);

      // Refresh catalogs after deleting
      const updatedCatalogs = await getUserCatalogs(token);
      setCatalogs(updatedCatalogs);

      setMessage("Catalog deleted successfully!");
    } catch (error) {
      setMessage("Error deleting catalog");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const data = await getUserCatalogs(token);
        setCatalogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Your Catalogs</h1>
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Create Catalog Section */}
        <section className="bg-white shadow rounded p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Catalog</h2>
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Catalog Name"
              value={catalogName}
              onChange={(e) => setCatalogName(e.target.value)}
              required
              className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Create
            </button>
          </form>
        </section>

        {/* Catalog List Section */}
        <section className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Existing Catalogs</h2>
          <ul className="space-y-4">
            {catalogs.map((catalog) => (
              <li
                key={catalog.catalogId}
                className="flex justify-between items-center p-4 bg-gray-50 rounded shadow"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{catalog.catalogName}</h3>
                  <p className="text-sm text-gray-500">Code: {catalog.catalogId}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/catalogs/${catalog.catalogId}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDeleteCatalog(catalog.catalogId)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
