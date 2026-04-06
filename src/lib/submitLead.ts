import { supabase } from "@/integrations/supabase/client";
import type { ProjectDetails, Package } from "@/data/packages";
import { getMetroMultiplier } from "@/data/packages";

export async function submitLead(details: ProjectDetails, selectedPackage?: Package) {
  const totalCost = selectedPackage
    ? Math.round(selectedPackage.pricePerSqft * details.bua * getMetroMultiplier(details.isMetro))
    : 0;

  try {
    const { data, error } = await supabase.functions.invoke("submit-lead", {
      body: {
        name: details.name,
        mobile: details.mobile,
        email: details.email,
        city: details.city,
        isMetro: details.isMetro,
        bua: details.bua,
        bedrooms: details.bedrooms,
        bathrooms: details.bathrooms,
        selectedPackage: selectedPackage?.name || "",
        totalCost,
        otherRequirements: details.otherRequirements,
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("Lead submission error:", err);
    return { success: false, error: err };
  }
}
