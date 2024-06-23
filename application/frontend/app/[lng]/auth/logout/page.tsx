"use client"
import { signOut } from '@auth/helpers';

export default function Dashboard({
    params: { lng: _ }
}: {
    params: {
        lng: "fr" | "en";
    };
}) {
    signOut();

    return (
        <div>
            Sign out
        </div>
    );
}