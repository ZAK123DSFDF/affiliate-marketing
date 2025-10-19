import { useState, useEffect } from "react"
import { InputField } from "@/components/Auth/FormFields"
import { parse } from "tldts"

export function DomainInputField({
  control,
  form,
  onDomainTypeChange,
}: {
  control: any
  form: any
  onDomainTypeChange?: (
    type: "platform" | "custom-main" | "custom-subdomain" | null
  ) => void
}) {
  const [domainType, setDomainType] = useState<
    "platform" | "custom-main" | "custom-subdomain" | null
  >(null)
  const domainValue = form.watch("defaultDomain")?.trim() || ""
  const normalized = domainValue.replace(/^https?:\/\//, "").toLowerCase()

  useEffect(() => {
    const normalized = domainValue.replace(/^https?:\/\//, "").toLowerCase()
    let newType: typeof domainType = null

    if (!normalized) newType = null
    else if (
      normalized.endsWith(".refearnapp.com") ||
      /^[a-z0-9-]+$/i.test(normalized)
    ) {
      newType = "platform"
    } else {
      const parsed = parse(normalized)
      if (parsed.domain) {
        if (parsed.subdomain) newType = "custom-subdomain"
        else newType = "custom-main"
      }
    }

    setDomainType(newType)
    onDomainTypeChange?.(newType)
  }, [domainValue])
  const displayDomain =
    !domainValue || !normalized
      ? ""
      : domainType === "platform"
        ? normalized.includes(".refearnapp.com")
          ? normalized
          : `${normalized}.refearnapp.com`
        : normalized

  return (
    <div className="flex flex-col">
      <InputField
        control={control}
        name="defaultDomain"
        label="Default Domain"
        placeholder="your-subdomain or customdomain.com"
        type="text"
        affiliate={false}
        leading="https://"
      />

      <p className="text-sm mt-1 text-muted-foreground">
        {!domainValue
          ? "Enter a subdomain or custom domain."
          : domainType === "platform"
            ? `This will be your subdomain: https://${displayDomain}`
            : domainType === "custom-main"
              ? `This will be your custom main domain: https://${displayDomain}`
              : domainType === "custom-subdomain"
                ? `This will be your custom subdomain: https://${displayDomain}`
                : ""}
      </p>
    </div>
  )
}
