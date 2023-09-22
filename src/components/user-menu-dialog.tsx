import { useAuth0 } from "@auth0/auth0-react";

export function UserMenuDialog() {
  const { user, logout } = useAuth0();
  return (
    <div className="absolute bottom-0 z-20 flex h-5/6 w-full flex-1 flex-col gap-4 rounded-lg border  bg-white shadow-md lg:-bottom-72 lg:-left-56 lg:h-72 lg:w-64">
      <div className="flex items-center gap-4 border-b px-6 py-3">
        <img
          className="h-8 w-8 overflow-hidden rounded-full"
          src={user?.picture}
          alt="user-profile-image"
        />
        <span className="text-sm font-medium">{user?.name}</span>
      </div>
      <div className="flex flex-1 flex-col justify-end px-6 py-4">
        <button
          onClick={() => logout()}
          className="text-start text-sm font-medium text-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
