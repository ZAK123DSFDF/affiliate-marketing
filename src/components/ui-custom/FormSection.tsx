import React from "react"

export const FormSection = ({
  title,
  description,
  children,
  borderTop = false,
  borderBottom = false,
}: {
  title: string
  description?: string
  children: React.ReactNode
  borderTop?: boolean
  borderBottom?: boolean
}) => {
  return (
    <div className="space-y-3">
      {/* Optional top border */}
      {borderTop && <div className="h-px bg-border mb-3" />}

      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>

      <div className="space-y-4">{children}</div>

      {/* Optional bottom border */}
      {borderBottom && <div className="h-px bg-border mt-3" />}
    </div>
  )
}
