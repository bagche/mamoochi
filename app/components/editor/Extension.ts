import { mergeAttributes, Node } from "@tiptap/core";
import {
  nodeViewProps,
  NodeViewWrapper,
  VueNodeViewRenderer,
} from "@tiptap/vue-3";
import { defineComponent, h } from "vue";

// 1. Eagerly import all Vue components inside /mdc
const modules = import.meta.glob("../mdc/**/*.vue", { eager: true });

// 2. Extract components using PascalCase names
const components: Record<string, any> = {};
for (const [path, mod] of Object.entries(modules)) {
  const name = path.split("/").pop()?.replace(".vue", "");
  if (name && mod && "default" in mod) {
    components[name] = (mod as any).default;
  }
}

// 3. Create one TipTap Node extension per component
export const getExtensions = () => {
  return Object.entries(components).map(([name, component]) =>
    Node.create({
      name, // PascalCase is OK
      group: "block",
      atom: true,
      draggable: true,
      parseHTML: () => [{ tag: name }], // e.g. <HomeIntro />
      renderHTML: ({ HTMLAttributes }) => [
        name,
        mergeAttributes(HTMLAttributes),
      ],
      addNodeView: () => {
        return VueNodeViewRenderer(
          defineComponent({
            props: nodeViewProps,
            setup(props) {
              return () =>
                h(NodeViewWrapper, null, {
                  default: () => h(component, { ...props }),
                });
            },
          })
        );
      },
    })
  );
};
