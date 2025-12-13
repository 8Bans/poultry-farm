import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut, LayoutDashboard, Package2 } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';

async function signOutAction() {
  'use server';
  const { signOut } = await import('@/lib/auth/auth');
  await signOut();
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
                🐔 Poultry Farm
              </Link>
              <Navigation />
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <form action={signOutAction}>
                    <button type="submit" className="w-full">
                      <DropdownMenuItem className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
