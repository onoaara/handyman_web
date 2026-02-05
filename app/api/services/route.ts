import { NextResponse } from "next/server";
import {
  supabaseAdmin,
  validateSupabaseAdminConfig,
} from "@/app/lib/supabase-admin";

export async function GET() {
  try {
    validateSupabaseAdminConfig();
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch services";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
