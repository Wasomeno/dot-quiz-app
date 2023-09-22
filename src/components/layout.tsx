import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { UserMenuDialog } from "./user-menu-dialog";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authSession = useAuth0();

  return (
    <main className="flex min-h-screen flex-1 flex-col antialiased">
      <div className="flex items-center justify-end px-4 py-2">
        {!authSession.isLoading && !authSession.isAuthenticated && (
          <button
            onClick={() => authSession.loginWithRedirect()}
            className="rounded-lg border border-slate-900 px-4 py-2 text-xs font-medium transition duration-200 lg:text-sm lg:hover:scale-105 lg:hover:bg-slate-900 lg:hover:text-slate-50"
          >
            Sign in
          </button>
        )}
        {!authSession.isLoading && authSession.isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-10 w-10 overflow-hidden rounded-full border-2"
            >
              <img
                src={authSession.user?.picture}
                alt="user-profile-image"
                className="h-full w-full"
                referrerPolicy="no-referrer"
              />
            </button>
            {isMenuOpen && <UserMenuDialog />}
          </div>
        )}
      </div>
      <Outlet />
    </main>
  );
}
