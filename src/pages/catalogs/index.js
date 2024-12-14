import { useState, useEffect } from "react";
import { getUserCatalogs ,deleteCatalog , createCatalog} from "../../services/api";
import Link from 'next/link';  // Doğru import

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catalogName, setCatalogName] = useState("");
  const [message, setMessage] = useState("");


  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem("accessToken");
        const response = await createCatalog({ name: catalogName }, token);
        setMessage("Catalog created successfully!");
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
  }


  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Kullanıcı girişinden alınan token
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Catalogs</h1>

      <div>
      <h1>Create New Catalog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Catalog Name"
          value={catalogName}
          onChange={(e) => setCatalogName(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>

      <ul>
        {catalogs.map((catalog) => (
          <li key={catalog.catalogId}>
            <h1>{catalog.catalogName}</h1>
            <h2>Code: {catalog.catalogId}</h2>
            <Link href={`/catalogs/${catalog.catalogId}`}>
              View Catalog
            </Link>
            <button onClick={() => handleDeleteCatalog(catalog.catalogId)} style={{ backgroundColor: "red", color: "white"}}>Delete Catalog</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
