import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper,VueNodeViewRenderer } from "@tiptap/vue-3";
import { defineComponent, h } from "vue";

// Function to dynamically import components
const importComponents = async () => {
  const context = import.meta.glob("../content/**/*.vue", { eager: true });
  const components = {};

  for (const [path, module] of Object.entries(context)) {
    const componentName = path.split("/").pop()?.replace(".vue", "");
    if (componentName) {
      components[componentName] = module.default;
    }
  }
  return components;
};

// Function to create extensions asynchronously
export const getExtensions = async () => {
  const components = await importComponents();

  return Object.entries(components).map(([name, component]) =>
    Node.create({
      name,
      group: "block",
      atom: true,
      parseHTML() {
        return [{ tag: name }];
      },
      renderHTML({ HTMLAttributes }) {
        return [name, mergeAttributes(HTMLAttributes)];
      },
      addNodeView() {
        return VueNodeViewRenderer(
          defineComponent({
            components: { component },
            setup() {
              return () =>
                h(NodeViewWrapper, null, {
                  default: () => h(component),
                });
            },
          })
        );
      },
    })
  );
};
