import { Extension } from "@tiptap/core";

export const ParagraphSpacing = Extension.create({
  name: "paragraphSpacing",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          dataSpacing: {
            default: null,
            parseHTML: (el) => el.getAttribute("data-spacing"),
            renderHTML: (attrs) =>
              attrs.dataSpacing ? { "data-spacing": attrs.dataSpacing } : {},
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setSpacing:
        (spacing: "medium" | "large" | null) =>
        ({ commands }) => {
          return commands.updateAttributes("paragraph", {
            dataSpacing: spacing,
          });
        },
    };
  },
});
