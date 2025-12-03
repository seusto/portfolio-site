import { createClient } from "@supabase/supabase-js";

export const supabaseAdminGlucoTest = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_GLUCO_TEST!,
  process.env.SUPABASE_SERVICE_ROLE_GLUCO_TEST! // server only
);
