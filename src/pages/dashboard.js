import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/auth/me", { credentials:"include" })
            .then((res) => {
                if(!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then((data) => setUser(data.user))
            .catch(() => router.push("/login"));
    }, []);

    if(!user) return null;

    return(
        <Layout>
            <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
                <h1 className="text-2xl font-bold text-blue-600 mb-4">
                    Welcome to your Dashboard
                </h1>
                <p className="text-black">
                    Hello, <strong>{user.name}</strong>! You are now viewing a protected page.
                </p>
            </div>
        </Layout>
    )
}