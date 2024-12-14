import { useState } from "react";
import { createCatalog } from "../services/api";

export default function NewCatalogPage() {
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

  return (
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
  );
}
