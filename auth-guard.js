
import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://sjsdmzvmuugrpxewhflz.supabase.co",
  "sb_publishable_k_H4nkAEc2tzmppak1h8ww_nz2T8kbB"
);

const loginUrl = new URL("./login.html", location.href);

async function verifyAccess() {
  try {
    const { data: { user }, error } =
      await supabase.auth.getUser();

    if (error || !user) {
      location.replace(loginUrl.href);
      return;
    }

    const { data: isAdmin, error: roleError } =
      await supabase.rpc("is_payroll_admin");

    if (roleError || isAdmin !== true) {
      location.replace(loginUrl.href);
      return;
    }

    document.body.hidden = false;
  } catch {
    location.replace(loginUrl.href);
  }
}

document.body.hidden = true;
await verifyAccess();
