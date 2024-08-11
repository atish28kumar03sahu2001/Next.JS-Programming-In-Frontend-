// src/app/profile/page.js
'use client'
import styles from './page.module.css';
import { getData } from '@/data/getData';
import { useEffect, useState } from 'react';
import { updateUserProfile } from '@/actions';
export default function page() {
    const [currentUser, setCurrentUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getData();
                setCurrentUser(userData);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchData();
    }, []);
    if (!currentUser) {
        return <p>Loading...</p>;
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        let form = e.target;
        let formData = new FormData(form);
        let formObj = Object.fromEntries(formData.entries());
        if (currentUser && currentUser._id) {
            formObj._id = currentUser._id;
        }
        const res = await updateUserProfile(formObj);
        if (res?.success) {
            window.location.reload();
        } else {
            console.error('Update failed:', res?.message);
        }
    }
    return (
        <>
            <h1 className={styles.h1d}>Welcome To profile Page</h1>
            <div className={styles.prof}>
                <p>{currentUser.userName}</p>
                <p>{currentUser.userEmail}</p>
                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Update Profile'}
                </button>
            </div>
            {showForm && (
                <form onSubmit={handleUpdate}>
                    <label>Username</label>
                    <input type="text" name="userName" placeholder="Enter New Username" />
                    <label>Usermail</label>
                    <input type="text" name="userEmail" placeholder="Enter New Usermail" />
                    <label>Userpassword</label>
                    <input type="password" name="userPassword" placeholder="Enter New Userpassword" />
                    <input type="submit" value="Update" />
                </form>
            )}
        </>
    );
}