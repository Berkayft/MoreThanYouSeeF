import { useState } from "react";
import { useRouter } from "next/router"; 
import { getCallBack } from "../../services/api";

export default function PredictPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    const router = useRouter();
    const { catalogId } = router.query;

    const handlePredict = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!catalogId) {
            setMessage("Catalog ID is missing");
            return;
        }

        if (!file) {
            setMessage("Please select a file");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setVideoUrl("");

            const response = await getCallBack(catalogId, file);
            
            if (response) {
                setVideoUrl(response);
                setMessage("Prediction successful!");
            } else {
                setMessage("No video link found");
            }
        } catch (error) {
            setError(error);
            setMessage("Error predicting");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const openVideoLink = () => {
        if (videoUrl) {
            window.open(videoUrl, '_blank', 'noopener,noreferrer');
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Predict</h1>
            <form onSubmit={handlePredict} className="mb-4">
                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    disabled={loading}
                    className="mb-2"
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {loading ? 'Predicting...' : 'Predict'}
                </button>
            </form>

            {loading && <p>Loading...</p>}
            {message && <p>{message}</p>}
            
            {videoUrl && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Matched Video</h2>
                    <iframe 
                        width="560" 
                        height="315" 
                        src={videoUrl} 
                        title="Matched Video"
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="mx-auto"
                    />
                    <div className="mt-2 text-center">
                        <button 
                            onClick={openVideoLink}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Open in YouTube
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500">Error: {error.message}</p>}
        </div>
    )
}