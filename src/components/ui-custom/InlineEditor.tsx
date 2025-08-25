import { RichTextEditor } from "@/components/ui-custom/RichTextEditor"
import { updateAuthCustomization } from "@/customization/Auth/AuthCustomizationChanges"
import { useNotesCustomizationOption } from "@/hooks/useAuthCustomization"
import { useState } from "react"
import { Pencil } from "lucide-react"
import { IsRichTextEmpty } from "@/util/IsRichTextEmpty"

type NotesKey = "customNotesLogin" | "customNotesSignup"

const DefaultAuthHeader = ({ name }: { name: NotesKey }) => {
  if (name === "customNotesLogin") {
    return (
      <>
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl font-bold text-center">Welcome back</h2>
        </div>
        <p className="text-center text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </>
    )
  }
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl font-bold text-center">Create An Account</h2>
      </div>
      <p className="text-center text-muted-foreground">
        Enter Your Information to Sign Up
      </p>
    </>
  )
}

export const InlineNotesEditor = ({ name }: { name: NotesKey }) => {
  const { customNotesLogin, customNotesSignup } = useNotesCustomizationOption()

  const currentContent =
    name === "customNotesLogin" ? customNotesLogin : customNotesSignup

  const [isEditing, setIsEditing] = useState(false)
  const [tempContent, setTempContent] = useState<string>(currentContent || "")

  if (isEditing) {
    return (
      <div className="border rounded p-4">
        <RichTextEditor content={tempContent} onChange={setTempContent} />
        <div className="mt-2 flex gap-2">
          <button
            className="bg-primary text-white px-4 py-1 rounded"
            onClick={() => {
              updateAuthCustomization(
                "useNotesCustomization",
                name,
                tempContent
              )
              setIsEditing(false)
            }}
          >
            Save
          </button>
          <button
            className="px-4 py-1 border rounded"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const showDefault = IsRichTextEmpty(currentContent)

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-center gap-2 relative">
        <div className="flex-1">
          {showDefault ? (
            <DefaultAuthHeader name={name} />
          ) : (
            <div
              className="rich-text-preview"
              dangerouslySetInnerHTML={{ __html: currentContent }}
            />
          )}
        </div>
        <button
          className="text-primary hover:text-primary/80 mt-1"
          onClick={() => setIsEditing(true)}
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
