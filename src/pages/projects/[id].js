import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function ProjectDetail() {
    const [project, setProject] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if(!id) return;
        //fetch project
        fetch(`/api/projects/${id}`)
            .then((res) => res.json())
            .then((data) => setProject(data));

        //fetch logged-in user
        fetch("/api/auth/me", { credentials: "include" })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => setCurrentUser(data?.user || null));
    }, [id]);

    const handleDelete = async () => {
        const confirmed = confirm("Are you sure you want to delete this project?");
        if(!confirmed) return;

        await fetch(`/api/projects/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        router.push("/projects");   
    };

    if(!project) return null;

    const isOwner = currentUser?.id === project.userId;

    return(
        <Layout>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">{project.title}</h1>
                    <p className="text-gray-700 mb-4">{project.description}</p>
                    <p className="text-sm text-gray-500">Tech Stack: {project.techStack}</p>
                    <p className="text-sm text-gray-500 mt-2">Posted by: {project.user?.name}</p>

                    {isOwner && (
                        <div className="flex gap-4 mt-4">
                            <Link href={`/projects/edit/${project.id}`}>
                                <button className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                            </Link>
                            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    )}
            </div>
        </Layout>
    )
}