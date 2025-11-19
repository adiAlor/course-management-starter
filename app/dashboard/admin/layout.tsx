"use client"

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useSession } from '@/lib/auth-client';
import { CustomQueryClientProvider } from '@/components/providers/query-client-provider';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { data: session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && (!session || !session.user)) {
      router.push('/auth/signin');
      return;
    }

    // Check if user has admin role
    if (!isLoading && session?.user && !hasAdminRole(session.user)) {
      router.push('/dashboard');
      return;
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session || !hasAdminRole(session.user)) {
    return null; // Will redirect
  }

  return (
    <CustomQueryClientProvider>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, courses, classes, cohorts, and learning materials
            </p>
          </div>
        </div>
        {children}
      </div>
    </CustomQueryClientProvider>
  );
}

// Helper function to check if user has admin role
function hasAdminRole(user: any): boolean {
  const role = user?.role || user?.user_type || user?.userRole;
  return role === 'admin' || role === 'administrator' || role === 'Admin';
}