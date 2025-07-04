import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout';

export default function Profile(){
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
       fetch('/api/auth/me', { credentials: "include" })
        .then((res) => {
            if(!res.ok) throw new Error("Unauthenticated");
            return res.json();
        })
        .then((data) => setUser(data.user))
        .catch(() => router.push('/login'));
    }, []);

    if(!user) return null;

    return(
        <Layout>
        <div className='min h-screen bg-gray-100 p-6 flex flex-col  items-center'>
            <div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
                <h2 className='text-2xl font-bold text-blue-600 mb-4 text-center'>My Profile</h2>
                <p className='text-black mb-2'><strong>Name:</strong> {user.name}</p>
                <p className='text-black mb-2'><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
        </Layout>
    )
}