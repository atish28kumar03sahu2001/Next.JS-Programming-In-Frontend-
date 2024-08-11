'use client'
import { getData } from '@/data/getData';
import { useEffect, useState } from 'react';
export default function page () {
    const [currentUser, setCurrentUser] = useState(null);

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
    return(
        <>
            <h1>Welcome To Home Page</h1>
            <div>
                <p>{currentUser.userName}</p>
                <p>{currentUser.userEmail}</p>
            </div>
        </>
    );
}