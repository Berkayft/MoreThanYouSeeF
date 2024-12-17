import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCatalogContents, addContentToCatalog, setCallbackUrl,  deleteContent   } from "../../services/api";
import { jwtDecode } from "jwt-decode";

export default function CatalogPage() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [editingContentId, setEditingContentId] = useState(null);
    const [newCallbackUrl, setNewCallbackUrl] = useState("");
    const [email, setEmail] = useState("");

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
                if (!token) {
                    router.push("/login");
                    return;
                }
                const decodedToken = jwtDecode(token);
                setEmail(decodedToken.email || "");
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
      <div className="h-screen w-screen flex flex-col bg-gray-100">
        <nav className="w-full bg-blue-500 text-white p-4">
        <div className="flex justify-between max-w-7xl mx-auto items-center">
          {/* Sol: Home Butonu */}
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold hover:underline"
          >
            Home
          </button>

          {/* Sağ: Kullanıcı Bilgisi */}
          <div className="flex items-center space-x-4">
            {email && <span className="text-sm font-medium">{email}</span>}
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                router.push("/login");
              }}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="p-6 max-w-4xl mx-auto">
        

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Catalog Contents</h1>
  
        {/* Add Content Form */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Content to Catalog</h2>
          <form onSubmit={handleAddContent} className="flex flex-col space-y-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add Content
            </button>
          </form>
          {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
  
        {/* Contents List */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contents</h2>
        <ul className="space-y-6">
          {contents.map((content) => (
            <li
              key={content.contentId}
              className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6"
            >
              <img
                src={content.imageUrl}
                alt={`Image for ${content.contentId}`}
                className="w-full md:w-40 h-40 object-cover rounded"
              />
  
              <div className="flex-1">
                <p className="text-gray-700">
                  <strong>Stored Callback URL:</strong>{" "}
                  {content.contentCallBackUrl || "No URL set"}
                </p>
              </div>
  
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDeleteContent(content.contentId)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
  
                {editingContentId === content.contentId ? (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      placeholder="Enter new callback URL"
                      value={newCallbackUrl}
                      onChange={(e) => setNewCallbackUrl(e.target.value)}
                      className="border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveCallbackUrl(content.contentId)}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                      >
                        Save URL
                      </button>
                      <button
                        onClick={() => {
                          setEditingContentId(null);
                          setNewCallbackUrl("");
                        }}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingContentId(content.contentId);
                      setNewCallbackUrl(content.contentCallBackUrl || "");
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Edit Callback URL
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      </div>
    );
}