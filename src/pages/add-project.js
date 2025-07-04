import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function AddProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
  });

  const [imageFile, setImageFile] = useState(null); // Image state
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth/me', { credentials: "include" });
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUserId(data.user.id);
    }

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Save selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/projects/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      imageUrl = data.imageUrl;
    }

        if (form.title.trim().length < 3) {
        toast.error("Title must be at least 3 characters long.");
        return;
    }

    if (form.description.trim().length < 10) {
        toast.error("Description must be at least 10 characters long.");
        return;
    }

    if (!form.techStack.trim()) {
        toast.error("Please enter the tech stack.");
        return;
    }

    const res = await fetch('/api/projects/add', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...form,
        userId,
        image: imageUrl // Add image URL to payload
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Project Posted");
      router.push('/projects');
    } else {
      toast.error(data.message || 'Error posting project');
    }
  };

  return (
    <Layout>
      <div className='min-h-screen bg-gray-100 flex justify-center items-center p-4'>
        <form
          onSubmit={handleSubmit}
          className='bg-white p-6 rounded shadow-md w-full max-w-lg'
        >
          <h2 className='text-2xl font-bold mb-6 text-blue-600 text-center'>
            Post a New Project
          </h2>

          <input
            name='title'
            value={form.title}
            onChange={handleChange}
            placeholder='Project Title'
            className='w-full p-2 mb-4 border rounded text-black'
            required
          />

          <textarea
            name='description'
            value={form.description}
            onChange={handleChange}
            placeholder='Project Description'
            rows={4}
            className='w-full p-2 mb-4 border rounded text-black'
            required
          />

          <input
            name='techStack'
            value={form.techStack}
            onChange={handleChange}
            placeholder='Tech Stack (e.g., React, Node)'
            className='w-full p-2 mb-4 border rounded text-black'
            required
          />

          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='w-full p-2 mb-6 border rounded text-black'
          />

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
          >
            Post Project
          </button>
        </form>
      </div>
    </Layout>
  );
}
