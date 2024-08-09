"use client";

import { useState, useEffect } from "react";

export const Form = () => {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [imageName, setImageName] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateImageId, setUpdateImageId] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch("/api/images");
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched images:", data); // Debugging line
                    setUploadedImages(data);
                } else {
                    throw new Error("Failed to fetch images");
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };
        fetchImages();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files);
        }
    };

    const handleNameChange = (e) => {
        setImageName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isUpdating && updateImageId) {
            await handleUpdate(updateImageId);
        } else if (selectedFiles && imageName) {
            const formData = new FormData();
            Object.values(selectedFiles).forEach((file) => {
                formData.append("file", file);
            });
            formData.append("name", imageName);

            try {
                const response = await fetch("/api/images", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log("Upload result:", result); // Debugging line

                    if (result.success) {
                        const newImage = {
                            _id: result._id,
                            url: result.url,
                            name: result.name,
                        };

                        setUploadedImages((prevImages) => [...prevImages, newImage]);

                        alert("Upload successful: " + result.name);

                        setSelectedFiles(null);
                        setImageName("");
                        e.target.reset();
                    } else {
                        throw new Error("Upload failed");
                    }
                } else {
                    throw new Error("Upload failed");
                }
            } catch (error) {
                alert("Upload failed: " + error.message);
            }
        } else {
            alert("Please select a file and provide a name.");
        }
    };

    const handleUpdateClick = (image) => {
        setIsUpdating(true);
        setUpdateImageId(image._id);
        setImageName(image.name);
        setSelectedFiles(null);
    };

    const handleUpdate = async (id) => {
        try {
            const formData = new FormData();
            if (selectedFiles) {
                Object.values(selectedFiles).forEach((file) => {
                    formData.append("file", file);
                });
            }
            formData.append("name", imageName);
            formData.append("id", id);

            const response = await fetch("/api/images", {
                method: "PATCH",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Update result:", result); // Debugging line

                if (result.success) {
                    setUploadedImages(uploadedImages.map(img => img._id === id ? { ...img, name: result.name, url: result.url || img.url } : img));
                    setIsUpdating(false);
                    setUpdateImageId(null);
                    setSelectedFiles(null);
                    setImageName("");
                    alert("Update successful!");
                } else {
                    throw new Error("Update failed");
                }
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            alert("Update failed: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch("/api/images", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setUploadedImages(uploadedImages.filter(img => img._id !== id));
                } else {
                    throw new Error("Delete failed");
                }
            } else {
                throw new Error("Delete failed");
            }
        } catch (error) {
            alert("Delete failed: " + error.message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    multiple
                />
                <input
                    type="text"
                    name="name"
                    value={imageName}
                    onChange={handleNameChange}
                    placeholder="Enter image name"
                />
                <button type="submit">{isUpdating ? "Update Data" : "Submit"}</button>
            </form>

            <div className="uploaded-images">
                {uploadedImages.length > 0 && (
                    <div>
                        <h3>Uploaded Images:</h3>
                        <div className="image-gallery">
                            {uploadedImages.map((image) => (
                                <div key={image._id} style={{ margin: "10px", textAlign: "center" }}>
                                    <img
                                        src={image.url}
                                        alt={`Uploaded ${image._id}`}
                                        style={{ width: "150px", display: "block", margin: "auto" }}
                                        onError={() => console.error(`Failed to load image at ${image.url}`)}
                                    />
                                    <p>{image.name}</p>
                                    <button onClick={() => handleUpdateClick(image)}>Update</button>
                                    <button onClick={() => handleDelete(image._id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};