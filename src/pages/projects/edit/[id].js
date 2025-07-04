import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function EditProject() {
    const [project, setProject] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", techStack : ""});
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if(!id) return;

        fetch(`/api/projects/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProject(data);
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    techStack: data.techStack || "",
                });
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json "},
            credentials: "include",
            body: JSON.stringify(formData),
        });

        if(res.ok){
            router.push(`/projects/${id}`);
        } else {
            alert("Update Failed");
        }
    };

    if(!project) return null;

    return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Edit Project</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Project Title"
            className="w-full border px-4 py-2 rounded text-black"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border px-4 py-2 rounded text-black"
          />
          <input
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="Tech Stack"
            className="w-full border px-4 py-2 rounded text-black"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Project
          </button>
        </form>
      </div>
    </Layout>
  );
}