"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { RichTextEditor } from "@/components/ui-custom/RichTextEditor";
import { useNotesCustomizationOption } from "@/hooks/useAuthCustomization";
import { updateAuthCustomization } from "@/customization/Auth/AuthCustomizationChanges";

type NotesKey = "customNotesLogin" | "customNotesSignup";

export const InlineNotesEditor = ({ name }: { name: NotesKey }) => {
  const { customNotesLogin, customNotesSignup } = useNotesCustomizationOption();

  const currentContent =
    name === "customNotesLogin" ? customNotesLogin : customNotesSignup;

  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState<string>(currentContent || "");
  const hasContent = currentContent?.trim();

  return (
    <div className="relative">
      {isEditing ? (
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
      ) : hasContent ? (
        <div
          className="rich-text-preview"
          dangerouslySetInnerHTML={{ __html: currentContent }}
        />
      ) : (
        <>
          {/* Fallback default header */}
          <div className="space-y-1">
            {name === "customNotesLogin" ? (
              <>
                <h2 className="text-2xl font-bold text-center">Welcome back</h2>
                <p className="text-center text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center">
                  Create An Account
                </h2>
                <p className="text-center text-muted-foreground">
                  Enter Your Information to Sign Up
                </p>
              </>
            )}
          </div>
        </>
      )}
      {!isEditing && (
        <button
          className="absolute top-2 right-2 text-primary hover:text-primary/80"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
