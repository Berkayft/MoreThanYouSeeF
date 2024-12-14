import { useState } from "react";

export default function Home() {
  const [catalogId, setCatalogId] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/catalogs/${catalogId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch signed URLs");
      }
      const data = await response.json();
      const signedUrls = data.map((item: { url: string }) => item.url);
      setUrls(signedUrls);

      // Dosyaları indirip IndexedDB'ye kaydet
      for (const url of signedUrls) {
        await downloadAndStoreFile(url, catalogId);
      }

      alert("Files downloaded and stored successfully!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAndStoreFile = async (url: string, catalogId: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download file from ${url}`);
      }
      const blob = await response.blob();

      // IndexedDB'ye kaydet
      const db = await openIndexedDB();
      const transaction = db.transaction(catalogId, "readwrite");
      const objectStore = transaction.objectStore(catalogId);
      objectStore.add({ url, file: blob });

      console.log(`File from ${url} stored in IndexedDB`);
    } catch (error) {
      console.error("File download or storage error:", error);
    }
  };

  const openIndexedDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("catalogDB", 1);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(catalogId)) {
          db.createObjectStore(catalogId, { keyPath: "url" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">Catalog Downloader</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-4 bg-white shadow rounded">
        <div className="mb-4">
          <label htmlFor="catalogId" className="block text-sm font-medium text-gray-700">
            Catalog ID
          </label>
          <input
            id="catalogId"
            type="text"
            value={catalogId}
            onChange={(e) => setCatalogId(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Processing..." : "Fetch and Store"}
        </button>
      </form>
      {urls.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-black mb-2">Signed URLs</h2>
          <ul className="list-disc pl-5">
            {urls.map((url, index) => (
              <li key={index} className="text-sm text-gray-700 break-all">
                {url}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
