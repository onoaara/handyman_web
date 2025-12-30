import { NextResponse } from "next/server";
import {
  supabaseAdmin,
  validateSupabaseAdminConfig,
} from "@/app/lib/supabase-admin";

export async function GET() {
  try {
    validateSupabaseAdminConfig();
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const users = data.users.map((user) => {
      // Extract name from user_metadata or app_metadata
      const userMetadata =
        user.user_metadata && typeof user.user_metadata === "object"
          ? (user.user_metadata as Record<string, unknown>)
          : null;
      const appMetadata =
        user.app_metadata && typeof user.app_metadata === "object"
          ? (user.app_metadata as Record<string, unknown>)
          : null;

      const name =
        (typeof userMetadata?.displayName === "string" &&
          userMetadata.displayName.trim()) ||
        (typeof userMetadata?.name === "string" && userMetadata.name.trim()) ||
        (typeof userMetadata?.full_name === "string" &&
          userMetadata.full_name.trim()) ||
        (typeof appMetadata?.name === "string" && appMetadata.name.trim()) ||
        (typeof appMetadata?.full_name === "string" &&
          appMetadata.full_name.trim()) ||
        null;

      const location =
        typeof userMetadata?.location === "string" &&
        userMetadata.location.trim()
          ? userMetadata.location.trim()
          : null;

      const emailVerified =
        typeof userMetadata?.email_verified === "boolean"
          ? userMetadata.email_verified
          : typeof userMetadata?.email_verified === "string"
          ? userMetadata.email_verified === "true"
          : null;

      const phoneVerified =
        typeof userMetadata?.phone_verified === "boolean"
          ? userMetadata.phone_verified
          : typeof userMetadata?.phone_verified === "string"
          ? userMetadata.phone_verified === "true"
          : null;

      return {
        id: user.id,
        name,
        email: user.email,
        location,
        email_verified: emailVerified,
        phone_verified: phoneVerified,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        app_metadata: user.app_metadata,
        user_metadata: user.user_metadata,
      };
    });

    return NextResponse.json(users);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";

    // Provide helpful error message for missing env vars
    if (message.includes("Missing Supabase env vars")) {
      return NextResponse.json(
        {
          error: message,
          hint: "Please create a .env.local file in the project root with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. See ENV_SETUP.md for detailed instructions.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
