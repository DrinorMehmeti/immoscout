import { supabase } from './lib/supabase';

async function grantAdminRights() {
  try {
    console.log("Versuche Admin-Rechte für USER-9e82fe zu vergeben...");
    
    // Rufe die RPC-Funktion auf, die in der Datenbank definiert ist
    const { data, error } = await supabase.rpc(
      'set_user_as_admin',
      { user_personal_id: 'USER-9e82fe' }
    );
    
    if (error) throw error;
    
    if (data === true) {
      console.log("✅ Erfolg! Der Benutzer USER-9e82fe ist jetzt ein Administrator.");
      console.log("Du kannst dich jetzt auf /admin anmelden und solltest Zugriff haben.");
    } else {
      console.error("❌ Der Benutzer wurde nicht gefunden oder konnte nicht zum Admin gemacht werden.");
    }
  } catch (error) {
    console.error("Fehler beim Vergeben von Admin-Rechten:", error);
  }
}

// Führe die Funktion aus
grantAdminRights();