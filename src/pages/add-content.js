import { useState } from "react";
import { addContentToCatalog } from "../services/api";

export default function AddContentPage() {
  const [catalogId, setCatalogId] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await addContentToCatalog(catalogId, file, token);
      setMessage("Content added successfully!");
    } catch (error) {
      setMessage("Error adding content");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Add Content to Catalog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Catalog ID"
          value={catalogId}
          onChange={(e) => setCatalogId(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Add Content</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
