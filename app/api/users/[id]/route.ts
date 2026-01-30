import { NextResponse } from "next/server";
import {
  supabaseAdmin,
  validateSupabaseAdminConfig,
} from "@/app/lib/supabase-admin";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    validateSupabaseAdminConfig();
    const { id } = params;
    const body = await request.json();
    const { name, location, role, email_verified, phone_verified, ...otherUpdates } = body;

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) {
      updateData.user_metadata = { ...updateData.user_metadata, name };
    }
    if (location !== undefined) {
      updateData.user_metadata = { ...updateData.user_metadata, location };
    }
    if (role !== undefined) {
      updateData.app_metadata = { ...updateData.app_metadata, role };
    }
    if (email_verified !== undefined) {
      updateData.user_metadata = { ...updateData.user_metadata, email_verified };
    }
    if (phone_verified !== undefined) {
      updateData.user_metadata = { ...updateData.user_metadata, phone_verified };
    }

    // Handle other fields if needed
    if (Object.keys(otherUpdates).length > 0) {
      // For now, ignore other fields or handle them as needed
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      updateData
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the updated user in the same format as GET
    const user = data.user;
    const userMetadata =
      user.user_metadata && typeof user.user_metadata === "object"
        ? (user.user_metadata as Record<string, unknown>)
        : null;
    const appMetadata =
      user.app_metadata && typeof user.app_metadata === "object"
        ? (user.app_metadata as Record<string, unknown>)
        : null;

    const formattedUser = {
      id: user.id,
      name:
        (typeof userMetadata?.displayName === "string" &&
          userMetadata.displayName.trim()) ||
        (typeof userMetadata?.name === "string" && userMetadata.name.trim()) ||
        (typeof userMetadata?.full_name === "string" &&
          userMetadata.full_name.trim()) ||
        (typeof appMetadata?.name === "string" && appMetadata.name.trim()) ||
        (typeof appMetadata?.full_name === "string" &&
          appMetadata.full_name.trim()) ||
        null,
      email: user.email,
      location:
        typeof userMetadata?.location === "string" &&
        userMetadata.location.trim()
          ? userMetadata.location.trim()
          : null,
      email_verified:
        typeof userMetadata?.email_verified === "boolean"
          ? userMetadata.email_verified
          : typeof userMetadata?.email_verified === "string"
          ? userMetadata.email_verified === "true"
          : null,
      phone_verified:
        typeof userMetadata?.phone_verified === "boolean"
          ? userMetadata.phone_verified
          : typeof userMetadata?.phone_verified === "string"
          ? userMetadata.phone_verified === "true"
          : null,
      created_at: user.created_at,
      email_confirmed_at: user.email_confirmed_at,
      last_sign_in_at: user.last_sign_in_at,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata,
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}