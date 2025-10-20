"use client"

import Link from "next/link"
import { useOrg } from "@/hooks/useOrg"
import { LogoUpload } from "@/components/ui-custom/LogoUpload"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { useAtomValue } from "jotai"
import { themeCustomizationAtom } from "@/store/AuthCustomizationAtom"
import { useOrgLogo } from "@/hooks/useOrgLogo"
import { kpiCardCustomizationAtom } from "@/store/DashboardCustomizationAtom"

interface OrgHeaderProps {
  orgId?: string
  affiliate: boolean
  isPreview: boolean
  sidebar?: boolean
}

export function OrgHeader({
  orgId,
  affiliate,
  isPreview,
  sidebar,
}: OrgHeaderProps) {
  const { org, isLoading: orgLoading } = useOrg(orgId, affiliate)
  const { logoUrl, setLogoUrl } = useOrgLogo(org?.logoUrl)
  const { headerColor } = useAtomValue(themeCustomizationAtom)
  const kpiCard = useAtomValue(kpiCardCustomizationAtom)
  if (affiliate && !orgId) {
    console.warn("Affiliate mode requires a valid orgId.")
    return null
  }

  if (affiliate || isPreview) {
    if (orgLoading) {
      return (
        <div className="flex items-center justify-center space-x-3">
          <div
            className="h-10 w-10 rounded-full animate-pulse"
            style={{
              backgroundColor:
                (affiliate && kpiCard.kpiLoadingColor) || "rgb(243 244 246)",
            }}
          />
          <div
            className="h-5 w-28 rounded-md animate-pulse"
            style={{
              backgroundColor:
                (affiliate && kpiCard.kpiLoadingColor) || "rgb(243 244 246)",
            }}
          />
        </div>
      )
    }

    // Adjust sizes automatically when isPreview = true
    const textSize = sidebar ? "text-lg" : "text-4xl"
    const gap = sidebar ? "space-x-2" : "space-x-3"

    return (
      <div className={`flex items-center justify-center ${gap} cursor-pointer`}>
        <LogoUpload
          value={logoUrl}
          onChange={setLogoUrl}
          affiliate={affiliate}
          orgId={orgId}
          orgName={org?.name}
          mode="avatar"
        />

        <h1
          className={`${textSize} font-bold`}
          style={{ color: (affiliate && headerColor) || undefined }}
        >
          {org?.name || "AffiliateX"}
        </h1>

        {isPreview && (
          <ThemeCustomizationOptions
            name="headerColor"
            showLabel={false}
            buttonSize="w-4 h-4"
          />
        )}
      </div>
    )
  }

  // Default (non-affiliate)
  return (
    <Link href="/" className="inline-block">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold">
          A
        </div>
        <h1 className="text-2xl font-bold">AffiliateX</h1>
      </div>
    </Link>
  )
}
