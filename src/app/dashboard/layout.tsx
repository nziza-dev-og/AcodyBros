
'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui/loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="container mx-auto px-4 py-16 md:px-6 flex min-h-[calc(100vh-20rem)] items-center justify-center">
         <Loader text="Loading Dashboard..." />
      </div>
    );
  }

  return <>{children}</>;
}
