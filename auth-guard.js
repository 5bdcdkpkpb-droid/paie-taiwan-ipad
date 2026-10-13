
import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://sjsdmzvmuugrpxewhflz.supabase.co",
  "sb_publishable_k_H4nkAEc2tzmppak1h8ww_nz2T8kbB"
);

const loginUrl = new URL("./login.html", location.href);


async function verifyAccess() {
  function showError(message) {
    document.body.style.visibility = "visible";
    document.body.innerHTML = `
      <main style="display:block;padding:30px;font-family:sans-serif">
        <h2>Diagnostic de connexion</h2>
        <p id="diagnosticMessage"></p>
        <p>Actualise la page pour réessayer.</p>
      </main>
    `;
    document.getElementById("diagnosticMessage").textContent = message;
  }

  try {
    const { data: { user }, error } =
      await supabase.auth.getUser();

    if (error || !user) {
      location.replace(loginUrl.href);
      return;
    }

    const { data: isAdmin, error: roleError } =
      await supabase.rpc("is_payroll_admin");

    if (roleError) {
      showError("Erreur Supabase : " + roleError.message);
      return;
    }

    if (isAdmin !== true) {
      showError("Compte connecté, mais accès administrateur non autorisé.");
      return;
    }

    document.body.style.visibility = "visible";
  } catch (err) {
    showError("Erreur technique : " + String(err));
  }
}

await verifyAccess();

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    logoutButton.textContent = "Déconnexion…";

    const { error } = await supabase.auth.signOut();

    if (error) {
      logoutButton.disabled = false;
      logoutButton.textContent = "Se déconnecter";
      alert("Déconnexion impossible. Réessaie.");
      return;
    }

    window.location.replace("./login.html");
  });
}

