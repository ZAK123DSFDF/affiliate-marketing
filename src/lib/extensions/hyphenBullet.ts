import { Extension } from "@tiptap/core";

export const HyphenBullet = Extension.create({
  name: "hyphenBullet",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          dataHyphen: {
            default: null,
            parseHTML: (el) => el.getAttribute("data-hyphen"),
            renderHTML: (attrs) =>
              attrs.dataHyphen === "true" ? { "data-hyphen": "true" } : {},
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      toggleHyphen:
        () =>
        ({ chain, editor }) => {
          const isActive =
            editor.getAttributes("paragraph")?.dataHyphen === "true";

          return chain()
            .updateAttributes("paragraph", {
              dataHyphen: isActive ? null : "true",
            })
            .run();
        },
    };
  },
});
