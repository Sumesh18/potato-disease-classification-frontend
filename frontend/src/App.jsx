import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post("https://api-potato-disease-classification.onrender.com/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      console.error("Upload error:", err.response || err.message);
      alert("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen animate-gradient overflow-y-auto bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 flex flex-col items-center py-10">

      {/* Main Card */}
      <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">🌿 Potato Disease Predictor</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-sky-600 file:text-white hover:file:bg-sky-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-sky-500 hover:bg-sky-400 rounded-lg font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Upload & Predict"}
          </button>
        </form>

        {/* Image Preview */}
        {preview && (
          <div className="mt-6 text-center">
            <h3 className="font-medium mb-2">Preview:</h3>
            <img
              src={preview}
              alt="preview"
              className="mx-auto rounded-xl shadow-lg border border-sky-500 w-64"
            />
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Prediction Result */}
        {result && (
          <div className="mt-6 p-4 bg-gray-800/60 rounded-xl text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Prediction Result:</h3>
            <p className="text-lg">
              <span className="font-bold text-sky-400">Class:</span> {result.class}
            </p>
            <p className="text-lg">
              <span className="font-bold text-sky-400">Confidence:</span>{" "}
              {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;