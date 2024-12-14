import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCatalogContents, addContentToCatalog, setCallbackUrl,  deleteContent   } from "../../services/api";

export default function CatalogPage() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [editingContentId, setEditingContentId] = useState(null);
    const [newCallbackUrl, setNewCallbackUrl] = useState("");
    

    const router = useRouter();
    const { catalogId } = router.query;

    const handleDeleteContent = async (contentId) => {
      try {
        const token = localStorage.getItem("accessToken");
        await deleteContent(contentId, token);
        
        // Refresh contents after deleting
        const updatedContents = await getCatalogContents(catalogId, token);
        setContents(updatedContents);
        
        setMessage("Content deleted successfully!");
      } catch (error) {
        setMessage("Error deleting content");
        console.error(error);
      }
    };

    const handleAddContent = async (e) => {
      e.preventDefault();
      if (!catalogId) {
        setMessage("Catalog ID is missing");
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const response = await addContentToCatalog(catalogId, file, token);
        setMessage("Content added successfully!");
        // Refresh contents after adding
        const updatedContents = await getCatalogContents(catalogId, token);
        setContents(updatedContents);
      } catch (error) {
        setMessage("Error adding content");
        console.error(error);
      }
    };

    const handleSaveCallbackUrl = async (contentId) => {
      try {
          const token = localStorage.getItem("accessToken");
          await setCallbackUrl(contentId, newCallbackUrl, token);
          
          // Refresh contents to get updated data
          const updatedContents = await getCatalogContents(catalogId, token);
          setContents(updatedContents);
          
          // Reset editing state
          setEditingContentId(null);
          setNewCallbackUrl("");
          setMessage("Callback URL updated successfully!");
      } catch (error) {
          setMessage("Error updating callback URL");
          console.error(error);
      }
  };

    useEffect(() => {
        if (!catalogId) return;

        const fetchContents = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const data = await getCatalogContents(catalogId, token);
                setContents(data);
            } catch (error) {
                setError('An error occurred while fetching the catalog contents.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchContents();
    }, [catalogId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Catalog Contents</h1>
            
            {/* Add Content Form */}
            <div>
              <h2>Add Content to Catalog</h2>
              <form onSubmit={handleAddContent}>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
                <button type="submit">Add Content</button>
              </form>
              {message && <p>{message}</p>}
            </div>

            
            <h2>Contents</h2>
            <ul>
                {contents.map((content) => (
                    <li key={content.contentId} style={{ color: "black", marginBottom: "20px" }}>
                        <img 
                          src={content.imageUrl} 
                          alt={`Image for ${content.contentId}`} 
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                        
                        <div>
                          <strong>Stored Callback URL:</strong> 
                          {content.contentCallBackUrl || "No URL set"}
                        </div>

                        {/* Delete button added here */}
                        <button 
                          onClick={() => handleDeleteContent(content.contentId)}
                          style={{ 
                            backgroundColor: 'red', 
                            color: 'white', 
                            marginRight: '10px' 
                          }}
                        >
                          Delete
                        </button>

                        {editingContentId === content.contentId ? (
                          <div>
                            <input 
                              type="text" 
                              placeholder="Enter new callback URL"
                              value={newCallbackUrl}
                              onChange={(e) => setNewCallbackUrl(e.target.value)}
                            />
                            <button onClick={() => handleSaveCallbackUrl(content.contentId)}>
                              Save URL
                            </button>
                            <button onClick={() => {
                              setEditingContentId(null);
                              setNewCallbackUrl("");
                            }}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => {
                            setEditingContentId(content.contentId);
                            setNewCallbackUrl(content.contentCallBackUrl || "");
                          }}>
                            Edit Callback URL
                          </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}