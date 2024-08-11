// src/components/Header/Header.js
import Logout from '../Logout/Logout';
import Link from 'next/link';
import '../style/Header.css';
export default function Header({ isLoggedIn }) {
    return (
        <>
            <div className="NHD1">
                <h1>Project Name</h1>
                {isLoggedIn ? (
                    <>
                        <div className='NHD2'>
                            <Link href="/home">Home</Link>
                            <Link href="/profile">Profile</Link>
                            <Logout />
                        </div>
                    </>
                ) : (
                    <div className='nav1'>
                        <Link className='nav11' href="/signup">Signup</Link>
                        <Link className='nav11' href="/signin">Login</Link>
                        <Link className='nav11' href="/project">Home</Link>
                    </div>
                )}
            </div>
        </>
    );
}