// app/actions/auth/getUser.ts
"use server";

import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
import { SafeAffiliateData } from "@/lib/types/authAffiliate";
import { revalidatePath } from "next/cache";
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization";
import { updateAffiliatePasswordAction } from "@/lib/server/updateAffiliatePassword";
import { validateAffiliatePasswordAction } from "@/lib/server/validateAffiliatePassword";
import { updateAffiliateProfileAction } from "@/lib/server/updateAffiliateProfile";
import { getAffiliateDataAction } from "@/lib/server/getAffiliateData";

export const getAffiliateData = async (): Promise<
  ResponseData<SafeAffiliateData>
> => {
  try {
    const decoded = await getAffiliateOrganization();
    const affiliateData = await getAffiliateDataAction(decoded);
    return { ok: true, data: affiliateData };
  } catch (err) {
    console.error("getUserData error:", err);
    return returnError(err) as ResponseData<SafeAffiliateData>;
  }
};

export async function updateAffiliateProfile(
  orgId: string,
  {
    name,
    email,
  }: {
    name: string;
    email: string;
  },
) {
  try {
    const decoded = await getAffiliateOrganization();
    await updateAffiliateProfileAction(decoded, { name, email });
    revalidatePath(`/affiliate/${orgId}/dashboard/profile`);
    return { ok: true };
  } catch (err) {
    console.error("updateAffiliateProfile error:", err);
    return returnError(err);
  }
}

export async function validateCurrentPassword(currentPassword: string) {
  try {
    const decoded = await getAffiliateOrganization();
    await validateAffiliatePasswordAction(decoded, currentPassword);
    return { ok: true };
  } catch (err) {
    console.error("validateCurrentPassword error:", err);
    return returnError(err);
  }
}
export async function updateAffiliatePassword(newPassword: string) {
  try {
    const decoded = await getAffiliateOrganization();

    await updateAffiliatePasswordAction(decoded, newPassword);

    return { ok: true };
  } catch (err) {
    console.error("updateAffiliatePassword error:", err);
    return returnError(err);
  }
}
