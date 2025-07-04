import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects/list")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects))
      .catch((err) => console.error("Error loading Projects", err));
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Developer Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500">No Projects Posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="bg-gray-50 p-5 rounded border-l-4 border-blue-500 shadow hover:shadow-md transition cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                  <p className="text-gray-600 mb-2">{project.description}</p>
                  <p className="text-sm text-gray-500">
                    Tech Stack: {project.techStack}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Posted by: {project.user?.name || "Unknown"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
