import { NextResponse } from "next/server";
import {
  supabaseAdmin,
  validateSupabaseAdminConfig,
} from "@/app/lib/supabase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    validateSupabaseAdminConfig();
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("shops")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch shop";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    validateSupabaseAdminConfig();
    const { id } = await params;
    const body = await request.json();

    const payload = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("shops")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update shop";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    validateSupabaseAdminConfig();
    const { id } = await params;

    const { error } = await supabaseAdmin.from("shops").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Shop deleted successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete shop";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
