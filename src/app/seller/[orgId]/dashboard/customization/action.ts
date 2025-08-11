"use server";

export async function saveCustomizationsAction(data: any) {
  console.log("🔹 Received customization data:", data);
  return { success: true };
}
