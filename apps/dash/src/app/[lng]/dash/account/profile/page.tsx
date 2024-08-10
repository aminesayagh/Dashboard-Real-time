"use client"

export default function Dashboard({
    params: { lng: _ }
}: {
    params: {
        lng: "fr" | "en";
    };
}) {

    return (
        <div>
            Page content
        </div>
    );
}