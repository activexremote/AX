import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data as Profile | null;
});

export function userInitials(profile: Profile | null) {
  if (!profile) return "?";
  const name = profile.full_name ?? profile.email ?? "?";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 1).toUpperCase();
}

export function firstName(profile: Profile | null) {
  if (!profile?.full_name) return profile?.email?.split("@")[0] ?? "Usuario";
  return profile.full_name.split(" ")[0];
}
