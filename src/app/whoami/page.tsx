import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function WhoAmIPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = user
    ? await supabase
        .from("profiles")
        .select("id, full_name_kh, full_name_en, role")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null, error: null };

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="font-moul text-xl">Supabase Diagnostic</h1>

      <section className="rounded-card border border-border bg-surface p-4">
        <h2 className="font-moul text-base mb-2">Session</h2>
        {userError ? (
          <pre className="text-xs text-red-600">
            {userError.message}
          </pre>
        ) : user ? (
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(
              { id: user.id, email: user.email },
              null,
              2,
            )}
          </pre>
        ) : (
          <p className="text-muted text-sm">
            Not signed in. (Expected until Phase 3.)
          </p>
        )}
      </section>

      <section className="rounded-card border border-border bg-surface p-4">
        <h2 className="font-moul text-base mb-2">Profile</h2>
        {profileError ? (
          <pre className="text-xs text-red-600">
            {profileError.message}
          </pre>
        ) : profile ? (
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(profile, null, 2)}
          </pre>
        ) : (
          <p className="text-muted text-sm">
            No profile loaded (requires an authenticated user).
          </p>
        )}
      </section>

      <section className="rounded-card border border-border bg-surface p-4">
        <h2 className="font-moul text-base mb-2">Public RPC smoke test</h2>
        <PublicRpcProbe />
      </section>
    </main>
  );
}

async function PublicRpcProbe() {
  await connection();
  
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_public_report", {
    p_student_code: "S001",
    p_dob: "2012-05-15",
  });

  if (error) {
    return (
      <pre className="text-xs text-amber-700 whitespace-pre-wrap">
        {error.message}
      </pre>
    );
  }

  return (
    <pre className="text-xs whitespace-pre-wrap max-h-64 overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}