"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, UploadCloud } from "lucide-react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const API_BASE = "http://127.0.0.1:8000/api";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title || `Photo_${Date.now()}`);
    formData.append("image", image);

    const res = await fetch(`${API_BASE}/photos/`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPhotos([data, ...photos]);
    setTitle("");
    setImage(null);
    setPreview(null);
  };

  const loadPhotos = async () => {
    const res = await fetch(`${API_BASE}/photos/`);
    const data = await res.json();
    setPhotos(data);
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this photo?");
    if (!confirmed) return;

    const res = await fetch(`${API_BASE}/photos/${id}/`, {
      method: "DELETE",
    });

    if (res.status === 204) {
      setPhotos(photos.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete photo.");
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 text-gray-800">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 drop-shadow">📸 CloudLink Gallery</h1>

      <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-lg rounded-xl p-6 mb-10">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Upload a New Photo</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter image title (optional)"
          className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-indigo-300"
        />

        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 rounded-lg p-6 mb-4 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
        >
          <UploadCloud className="h-10 w-10 text-indigo-600 mb-2" />
          <p className="text-sm text-indigo-700">Drag & drop your image here or click to select</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {preview && (
          <div className="mb-4">
            <p className="mb-2 font-semibold text-sm text-gray-600">Preview:</p>
            <img src={preview} alt="Preview" className="w-72 h-auto rounded-lg shadow" />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
        >
          Upload
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-indigo-700">🖼 Uploaded Photos</h2>
      {photos.length === 0 ? (
        <p className="text-gray-500">No photos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl shadow-md overflow-hidden relative group">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-3">
                <p className="font-medium text-sm truncate text-gray-800" title={photo.title}>
                  {photo.title}
                </p>
              </div>
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
