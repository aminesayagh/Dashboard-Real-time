"use client"
import { useSession } from "next-auth/react";

export default function Dashboard() {
    const { data: session, status } = useSession();

    if (status === "loading") return <div>Loading...</div>;
    // if the user is not auth redirect to the home
    if (status !== "authenticated") {
        window.location.href = "/";
    }
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}

// common