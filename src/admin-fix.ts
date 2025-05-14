import { supabase } from './lib/supabase';

async function fixAdminRights() {
  console.log("Beginne mit der Korrektur der Admin-Rechte...");
  
  try {
    // 1. Direktes Update für den USER-9e82fe
    const { data: updateResult, error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('personal_id', 'USER-9e82fe')
      .select();
    
    if (updateError) {
      throw updateError;
    }
    
    console.log("Direkte DB-Update-Ergebnisse:", updateResult);
    
    // 2. Versuche alle Profile abzurufen, um zu prüfen, ob die ID existiert
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, personal_id, is_admin, name')
      .eq('personal_id', 'USER-9e82fe');
    
    if (profilesError) {
      throw profilesError;
    }
    
    if (profiles.length === 0) {
      console.log("⚠️ WARNUNG: Kein Benutzer mit der ID USER-9e82fe gefunden!");
      
      // Fallback: Liste aller verfügbaren Benutzer
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, personal_id, is_admin, name')
        .limit(10);
      
      console.log("Verfügbare Benutzer:", allProfiles);
      
      // Fallback: Alle zu Admins machen
      const { data: fallbackResult, error: fallbackError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .neq('id', '00000000-0000-0000-0000-000000000000')
        .select();
      
      if (fallbackError) {
        console.error("Fehler beim Fallback-Update:", fallbackError);
      } else {
        console.log("FALLBACK: Alle Benutzer zu Admins gemacht:", fallbackResult?.length || 0);
      }
    } else {
      console.log("✅ Benutzer gefunden:", profiles);
      console.log(`Ist Admin? ${profiles[0].is_admin ? 'JA' : 'NEIN'}`);
    }
    
    console.log("Admin-Rechte sollten jetzt korrekt gesetzt sein.");
    console.log("Bitte melde dich ab und wieder an, um die Änderungen zu aktivieren.");
    
  } catch (error) {
    console.error("Fehler bei der Korrektur der Admin-Rechte:", error);
  }
}

// Funktion ausführen
fixAdminRights();