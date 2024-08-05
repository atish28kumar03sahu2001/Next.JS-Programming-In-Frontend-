import Link from "next/link";

export default function home() {
    return (
        <>
            <h1>Welcome To Next CRUD</h1>
            <Link href='/expense'>Expense</Link>
        </>
    );
}