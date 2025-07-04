import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function Login() {
    const [form, setForm] = useState({ email: "", password: ""});
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const res = await fetch("api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if(res.ok){
            toast.success("Login successful!");
            router.push("/profile");
        } else{
            toast.error(data.message || "Login failed.");
        }
    }

    return(
        <Layout>
        <div className='flex justify-center items-center h-screen bg-gray-100'>
            <form
                onSubmit={handleSubmit}
                className='bg-white p-8 rounded shadow-md w-full max-w-md'
            >
                <h2 className='text-2xl font-bold mb-6 text-center text-blue-600'>Login</h2>

                <h2 className="text-lg font-bold mb-2 text-blue-600">Email</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className='w-full p-2 mb-6 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                />

                <h2 className="text-lg font-bold mb-2 text-blue-600">Password</h2>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={form.password}
                    onChange={handleChange}
                    className='w-full p-2 mb-6 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                />

                <button className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'>Login</button>
            </form>

        </div>
        </Layout>
    )
}