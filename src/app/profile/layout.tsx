'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLayout({
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
       <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </div>
        <div className="max-w-2xl mx-auto mt-12">
            <Skeleton className="h-48 w-full"/>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
