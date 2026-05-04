"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Manage Your Team Tasks <br />
          <span style={{ color: "var(--primary)" }}>with Elegance</span>
        </h1>
        <p className="text-lg text-muted mb-8">
          Taskify is a modern, collaborative team task management platform. Create projects,
          assign tasks, and track your team's progress seamlessly.
        </p>

        <div className="flex justify-center gap-4">
          {user ? (
            <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-3">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn btn-primary text-lg px-8 py-3">
                Get Started for Free
              </Link>
              <Link href="/login" className="btn btn-secondary text-lg px-8 py-3">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-4xl">
        <div className="card">
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <span style={{ color: "var(--primary)" }}>✦</span> Collaborate
          </h3>
          <p className="text-muted">Work together with your team seamlessly. Share projects and assign tasks instantly.</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <span style={{ color: "var(--secondary)" }}>✦</span> Track
          </h3>
          <p className="text-muted">Keep an eye on the progress. Know what's in progress, done, or overdue.</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <span style={{ color: "var(--warning)" }}>✦</span> Manage Roles
          </h3>
          <p className="text-muted">Admins manage the tasks while members focus on getting their assigned work done.</p>
        </div>
      </div>
    </div>
  );
}
