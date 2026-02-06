import { NextResponse } from "next/server";
import {
  supabaseAdmin,
  validateSupabaseAdminConfig,
} from "@/app/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    validateSupabaseAdminConfig();
    const { searchParams } = new URL(request.url);
    const shop_id = searchParams.get("shop_id");

    let query = supabaseAdmin
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (shop_id) {
      query = query.eq("shop_id", shop_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch items";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
