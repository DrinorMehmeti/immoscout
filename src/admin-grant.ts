import { supabase } from './lib/supabase';

/**
 * Script i thjeshtë për të dhënë privilegjet e administratorit përdoruesit me ID personale USER-9e82fe
 */
async function grantAdminPrivileges() {
  console.log("Duke dhënë privilegjet e administratorit për përdoruesin me ID USER-9e82fe...");
  
  try {
    // Thirrja e funksionit nga database që vendos përdoruesin si admin bazuar në ID personale
    const { data, error } = await supabase.rpc(
      'set_user_as_admin', 
      { user_personal_id: 'USER-9e82fe' }
    );
    
    if (error) throw error;
    
    if (data === true) {
      console.log("✅ Sukses! Përdoruesi USER-9e82fe tani është administrator.");
    } else {
      console.error("❌ Përdoruesi nuk u gjet ose nuk u bë administrator.");
      console.log("Këshillë: Verifikoni nëse ID personale USER-9e82fe është e saktë.");
    }
  } catch (error) {
    console.error("Ndodhi një gabim gjatë dhënies së privilegjeve të administratorit:", error);
  }
}

grantAdminPrivileges();