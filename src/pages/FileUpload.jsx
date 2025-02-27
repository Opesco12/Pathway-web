import React, { useState, useEffect } from "react";

const ClientPhotoUploader = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // 'success', 'error', or ''
  const [clientPhoto, setClientPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing client photo when component mounts
  useEffect(() => {
    fetchClientPhoto();
  }, []);

  const fetchClientPhoto = async () => {
    try {
      setIsLoading(true);

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiRW1tYW51ZWwgT3llbGVrZSIsInN1YiI6IkVtbWFudWVsIE95ZWxla2UiLCJqdGkiOiI4MDcwNzE5Yi0xZWE5LTQ2ZjUtYWI4NC0xYzI1YzlkNjg5NWYiLCJlbWFpbCI6Im9wZXNjbzExNUBnbWFpbC5jb20iLCJpYXQiOiIwMi8yNy8yMDI1IDIyOjQ3OjE4IiwiYWNjb3VudG5vIjoiMDA4OTA2NjQiLCJ1c2VybmFtZSI6Im9wZXNjbzExNUBnbWFpbC5jb20iLCJ1c2VydHlwZSI6IkkiLCJtYWluYWNjb3VudG5vIjoiMDA4OTA2NjQiLCJleHAiOjE3NDA2OTY0MzgsImlzcyI6Inhmcm9udCIsImF1ZCI6IlhmdW5kZnJvbnRhdWRpZW5jZSJ9.gpWko-mEaE2UJZbujC16SwBHeL-HzZTGJUY47LYoQKM";

      const response = await fetch(
        "http://127.0.0.1:3000/api/v1/getclientphoto",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error fetching photo: ${response.status}`);
      }

      const data = await response.json();
      setClientPhoto(data);
    } catch (error) {
      console.error("Error fetching client photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilename(selectedFile.name);
      setMessage("");
      setStatus("");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      setStatus("error");
      return;
    }

    try {
      setIsUploading(true);

      // Convert file to base64
      const base64String = await convertToBase64(file);

      // Prepare request body
      const requestBody = {
        base64: base64String,
        filename: filename,
      };

      // Update the fetch function in the handleUpload function:
      const response = await fetch(
        "https://102.207.208.18:6545/api/v1/uploadclientphoto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json-patch+json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiRW1tYW51ZWwgT3llbGVrZSIsInN1YiI6IkVtbWFudWVsIE95ZWxla2UiLCJqdGkiOiI4MDcwNzE5Yi0xZWE5LTQ2ZjUtYWI4NC0xYzI1YzlkNjg5NWYiLCJlbWFpbCI6Im9wZXNjbzExNUBnbWFpbC5jb20iLCJpYXQiOiIwMi8yNy8yMDI1IDIyOjQ3OjE4IiwiYWNjb3VudG5vIjoiMDA4OTA2NjQiLCJ1c2VybmFtZSI6Im9wZXNjbzExNUBnbWFpbC5jb20iLCJ1c2VydHlwZSI6IkkiLCJtYWluYWNjb3VudG5vIjoiMDA4OTA2NjQiLCJleHAiOjE3NDA2OTY0MzgsImlzcyI6Inhmcm9udCIsImF1ZCI6IlhmdW5kZnJvbnRhdWRpZW5jZSJ9.gpWko-mEaE2UJZbujC16SwBHeL-HzZTGJUY47LYoQKM",
          },
          body: JSON.stringify(requestBody),
        },
      );

      // Handle response
      if (response.status === 200) {
        setMessage("Photo uploaded successfully");
        setStatus("success");

        // Fetch the updated client photo after successful upload
        await fetchClientPhoto();
      } else if (response.status === 400) {
        setMessage("Error while processing request");
        setStatus("error");
      } else if (response.status === 500) {
        setMessage("Internal server error");
        setStatus("error");
      } else {
        setMessage(`Unexpected response: ${response.status}`);
        setStatus("error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload: " + error.message);
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFilename("");
    setMessage("");
    setStatus("");
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Upload Client Photo</h2>

      {/* Current Client Photo Display */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium">Current Photo</h3>
        {isLoading ? (
          <div className="flex h-48 w-full items-center justify-center rounded bg-gray-100">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : clientPhoto && clientPhoto.photo ? (
          <div className="rounded border border-gray-200 p-2">
            <img
              src={`data:image/jpeg;base64,${clientPhoto.photo}`}
              alt="Client"
              className="mx-auto max-h-48 rounded"
            />
            <p className="mt-2 text-center text-sm text-gray-500">
              Client ID: {clientPhoto.clientId}
            </p>
          </div>
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded bg-gray-100">
            <p className="text-gray-500">No photo available</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Upload New Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {file && (
        <div className="mb-4">
          <div className="flex items-center rounded bg-gray-50 p-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-200">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {filename}
              </p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={resetForm}
              className="ml-2 flex-shrink-0 rounded-full p-1 hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mb-4 rounded p-3 text-sm ${
            status === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className={`rounded-md px-4 py-2 font-medium text-white ${
            isUploading || !file
              ? "cursor-not-allowed bg-blue-300"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg
                className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Photo"
          )}
        </button>

        <button
          onClick={resetForm}
          disabled={isUploading || !file}
          className={`rounded-md px-4 py-2 font-medium text-gray-700 ${
            isUploading || !file
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ClientPhotoUploader;
