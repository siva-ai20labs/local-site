import { LogoutButton } from "@/components/LogoutButton";

// Blueprint "not-admin / 403" state: an authenticated non-admin user is shown a
// clear access-denied screen. (The APIs independently return 403.)
export function NotAdmin({ email }: { email: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
          🔒
        </div>
        <h1 className="text-lg font-bold text-slate-900">403 — Admin access required</h1>
        <p className="mt-2 text-sm text-slate-500">
          You are signed in as <span className="font-medium">{email}</span>, which is not an
          admin account. The prospect dashboard and its APIs are restricted to admins.
        </p>
        <div className="mt-6 flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}

