import { RichTextEditor } from "@/components/ui-custom/RichTextEditor";
import { updateAuthCustomization } from "@/customization/Auth/AuthCustomizationChanges";
import { useNotesCustomizationOption } from "@/hooks/useAuthCustomization";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { IsRichTextEmpty } from "@/util/IsRichTextEmpty";

type NotesKey = "customNotesLogin" | "customNotesSignup";

function isRichTextEmpty(html?: string) {
  if (!html) return true;
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();
  return text.length === 0;
}

const DefaultAuthHeader = ({ name }: { name: NotesKey }) => {
  if (name === "customNotesLogin") {
    return (
      <>
        <h2 className="text-2xl font-bold text-center">Welcome back</h2>
        <p className="text-center text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </>
    );
  }
  return (
    <>
      <h2 className="text-2xl font-bold text-center">Create An Account</h2>
      <p className="text-center text-muted-foreground">
        Enter Your Information to Sign Up
      </p>
    </>
  );
};

export const InlineNotesEditor = ({ name }: { name: NotesKey }) => {
  const { customNotesLogin, customNotesSignup } = useNotesCustomizationOption();

  const currentContent =
    name === "customNotesLogin" ? customNotesLogin : customNotesSignup;

  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState<string>(currentContent || "");

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
                tempContent,
              );
              setIsEditing(false);
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
    );
  }

  const showDefault = IsRichTextEmpty(currentContent);

  return (
    <div className="space-y-2">
      {showDefault ? (
        <DefaultAuthHeader name={name} />
      ) : (
        <div
          className="rich-text-preview"
          dangerouslySetInnerHTML={{ __html: currentContent }}
        />
      )}

      {/* Edit button below content */}
      <button
        className="text-primary hover:text-primary/80 flex items-center gap-1"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="w-4 h-4" /> Edit
      </button>
    </div>
  );
};
