// // src/app/home/page.js
// 'use client';
// import { getData } from '@/data/getData';
// import { useEffect, useState } from 'react';
// import { PostData, GetData} from '@/actions/userdata';

// export default function Page() {
//     const [currentUser, setCurrentUser] = useState(null);
//     const [formState, setFormState] = useState({ expid: '', expname: '', expprice: '', expdate: '', expimg: null });
//     const [storedData, setStoredData] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const userData = await getData();
//                 setCurrentUser(userData);
//             } catch (error) {
//                 console.error("Failed to fetch user data:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     useEffect(() => {
//         if (currentUser) {
//             getUserData();
//         }
//     }, [currentUser]);

//     const getUserData = async () => {
//         try {
//             const userId = currentUser._id;
//             const result = await GetData(userId);
//             if (result.success) {
//                 setStoredData(result.data);
//                 console.log(result.data);
//             } else {
//                 console.error("Failed to fetch user expenses:", result.message);
//             }
//         } catch (error) {
//             console.error("Error fetching user data:", error);
//         }
//     };

//     if (!currentUser) {
//         return <p>Loading...</p>;
//     }

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         if (!formState.expimg) {
//             console.error("No file uploaded");
//             return;
//         }
//         try {
//             const fileBuffer = await formState.expimg.arrayBuffer();
//             const expenseData = {
//                 ...formState,
//                 expimg: URL.createObjectURL(formState.expimg)
//             };
//             const userId = currentUser._id;
//             const result = await PostData(expenseData, userId);
//             setFormState({ expid: '', expname: '', expprice: '', expdate: '', expimg: null });

//         } catch (error) {
//             console.error("Failed to process file:", error);
//         }
//     };

//     return (
//         <>
//             <h1>Welcome To Home Page</h1>
//             <div>
//                 <p>{currentUser.userName} - - {currentUser.userEmail} -- {currentUser._id}</p>
//             </div>
//             <div>
//                 <form onSubmit={handleSubmit}>
//                     <div>
//                         <label htmlFor='expid'>Expense Id</label>
//                         <input required type="text" name="expid" onChange={(event) => setFormState({ ...formState, expid: event.target.value })} value={formState.expid} placeholder='Enter Expense Id' /><br />
//                     </div>
//                     <div>
//                         <label htmlFor='expname'>Expense Name</label>
//                         <input required type="text" name="expname" onChange={(event) => setFormState({ ...formState, expname: event.target.value })} value={formState.expname} placeholder='Enter Expense Name' /><br />
//                     </div>
//                     <div>
//                         <label htmlFor='expprice'>Expense Price</label>
//                         <input required type="text" name="expprice" onChange={(event) => setFormState({ ...formState, expprice: event.target.value })} value={formState.expprice} placeholder='Enter Expense Price' /><br />
//                     </div>
//                     <div>
//                         <label htmlFor='expdate'>Expense Date</label>
//                         <input required type="date" name="expdate" onChange={(event) => setFormState({ ...formState, expdate: event.target.value })} value={formState.expdate} placeholder='Enter Expense Date' /><br />
//                     </div>
//                     <div>
//                         <label htmlFor='expimg'>Expense Image</label>
//                         <input required type="file" name="expimg" accept=".jpg, .jpeg, .png, .gif, .bmp, .webp, .svg" onChange={(event) => setFormState({ ...formState, expimg: event.target.files[0] })} placeholder='Upload Expense Image' /><br />
//                     </div>
//                     <div>
//                         <input type="submit" value="Submit Expense" />
//                     </div>
//                 </form>
//             </div>
//             <div>
//                 <h2>Stored Data</h2>
//                 {storedData.length > 0 ? (
//                     <div>
//                         {storedData.map((data, index) => (
//                             <div key={index}>
//                                 <p><strong>Expense Id:</strong> {data.expid}</p>
//                                 <p><strong>Expense Name:</strong> {data.expname}</p>
//                                 <p><strong>Expense Price:</strong> {data.expprice}</p>
//                                 <p><strong>Expense Date:</strong> {data.expdate}</p>
//                                 {data.expimg && (
//                                     <div>
//                                         <p><strong>Expense Image:</strong></p>
//                                         <img src={data.expimg} alt="Expense" style={{ maxWidth: '300px', maxHeight: '300px' }} />
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p>No data to display</p>
//                 )}
//             </div>
//         </>
//     );
// }

'use client';
import { getData } from '@/data/getData';
import { useEffect, useState } from 'react';

export default function Page() {
    const [currentUser, setCurrentUser] = useState(null);
    const [formState, setFormState] = useState({ expid: "", expname: "", expprice: "", expdate: "" });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateImageId, setUpdateImageId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getData();
                setCurrentUser(userData);

                if (userData._id) {
                    const response = await fetch(`/api/images?user=${userData._id}`);
                    const result = await response.json();
                    if (result.success) {
                        setUploadedImages(result.expenses || []);
                    } else {
                        console.error("Failed to fetch images:", result.message);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchData();
    }, []);

    if (!currentUser) {
        return <p>Loading...</p>;
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Return the date part only
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (isUpdating && updateImageId) {
            await handleUpdate(updateImageId);
        } else if (selectedFiles.length > 0 && formState.expid && formState.expname && formState.expprice && formState.expdate) {
            const formData = new FormData();
            selectedFiles.forEach(file => formData.append("file", file));
            formData.append("expid", formState.expid);
            formData.append("expname", formState.expname);
            formData.append("expprice", formState.expprice);
            formData.append("expdate", formatDate(formState.expdate)); // Format the date here
            formData.append("user", currentUser._id);
    
            try {
                const response = await fetch("/api/images", { method: "POST", body: formData });
                if (response.ok) {
                    const result = await response.json();
                    console.log("Upload response:", result); // Log the result to inspect its structure
                    if (result.success) {
                        const newImage = result._doc || result; // Adjust according to the response structure
                        setUploadedImages(prevImages => [...prevImages, newImage]);
                        alert("Upload Successful: " + newImage.expname); // Access expname from newImage
                        setSelectedFiles([]);
                        setFormState({ expid: "", expname: "", expprice: "", expdate: "" });
                        event.target.reset();
                    } else {
                        throw new Error("Upload Failed");
                    }
                } else {
                    throw new Error("Upload Failed");
                }
            } catch (error) {
                alert("Upload failed: " + error.message);
            }
        } else {
            alert("Please select a file and provide all required information.");
        }
    };
    
    const handleUpdateClick = (id) => {
        const image = uploadedImages.find(img => img._id === id);
        if (image) {
            setUpdateImageId(id);
            setFormState({
                expid: image.expid || "",
                expname: image.expname || "",
                expprice: image.expprice || "",
                expdate: formatDate(image.expdate) || "",
            });
            setIsUpdating(true);
        }
    };

    const handleUpdate = async (id) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("expid", formState.expid || ""); // Ensure fields are included even if empty
        formData.append("expname", formState.expname || "");
        formData.append("expprice", formState.expprice || "");
        formData.append("expdate", formatDate(formState.expdate) || ""); // Format the date here
    
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => formData.append("file", file));
        }
    
        try {
            const response = await fetch("/api/images", { method: "PATCH", body: formData });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const updatedImage = result._doc || result; // Handle response structure
                    setUploadedImages(prevImages =>
                        prevImages.map(img => img._id === id ? updatedImage : img)
                    );
                    alert("Update Successful: " + (updatedImage.expname || "No Name")); // Use default if expname is missing
                    setFormState({ expid: "", expname: "", expprice: "", expdate: "" });
                    setSelectedFiles([]);
                    setIsUpdating(false);
                    setUpdateImageId(null);
                    // Assuming event is available here, otherwise remove or handle accordingly
                    // event.target.reset(); 
                } else {
                    throw new Error("Update Failed");
                }
            } else {
                throw new Error("Update Failed");
            }
        } catch (error) {
            alert("Update failed: " + error.message);
        }
    };
    
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                const response = await fetch("/api/images", { method: "DELETE", body: JSON.stringify({ id }), headers: { "Content-Type": "application/json" } });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setUploadedImages(prevImages => prevImages.filter(img => img._id !== id));
                        alert("Delete Successful");
                    } else {
                        throw new Error("Delete Failed");
                    }
                } else {
                    throw new Error("Delete Failed");
                }
            } catch (error) {
                alert("Delete failed: " + error.message);
            }
        }
    };

    return (
        <div>
            <h1>Expense Manager</h1>
            <div>
                <p>{currentUser.userName} - - {currentUser.userEmail} -- {currentUser._id}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="expid" placeholder="Expense ID" value={formState.expid} onChange={(e) => setFormState({ ...formState, expid: e.target.value })} required />
                <input type="text" name="expname" placeholder="Expense Name" value={formState.expname} onChange={(e) => setFormState({ ...formState, expname: e.target.value })} required />
                <input type="number" name="expprice" placeholder="Expense Price" value={formState.expprice} onChange={(e) => setFormState({ ...formState, expprice: e.target.value })} required />
                <input type="date" name="expdate" placeholder="Expense Date" value={formState.expdate} onChange={(e) => setFormState({ ...formState, expdate: e.target.value })} required />
                <input type="file" multiple onChange={handleFileChange} />
                <button type="submit">{isUpdating ? "Update" : "Add Expense"}</button>
            </form>

            <h2>Uploaded Images</h2>
            <ul>
                {uploadedImages.map((image) => (
                    <li key={image.expid}>
                        <img src={image.expimg} alt={image.expname} width="100" />
                        <p>{image.expid}--{image.expname}--{image.expprice}--{new Date(image.expdate).toLocaleDateString()}</p>
                        <button onClick={() => handleUpdateClick(image._id)}>Update</button>
                        <button onClick={() => handleDelete(image._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}