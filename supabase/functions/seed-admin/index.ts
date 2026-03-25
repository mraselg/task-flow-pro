import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = "admin@rasel.cloud";
  const password = "R@sel889900#@";

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u: any) => u.email === email);

  if (existing) {
    // Update password
    await supabase.auth.admin.updateUserById(existing.id, { password });
    
    // Ensure super_admin role
    const { data: roleExists } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", existing.id)
      .eq("role", "super_admin")
      .maybeSingle();

    if (!roleExists) {
      await supabase.from("user_roles").insert({ user_id: existing.id, role: "super_admin" });
    }

    return new Response(JSON.stringify({ message: "Admin updated", userId: existing.id }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create new user
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: "Rasel Ahmed" },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Add super_admin role
  await supabase.from("user_roles").insert({ user_id: newUser.user.id, role: "super_admin" });

  return new Response(JSON.stringify({ message: "Admin created", userId: newUser.user.id }), {
    headers: { "Content-Type": "application/json" },
  });
});
