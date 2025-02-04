import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper,VueNodeViewRenderer } from "@tiptap/vue-3";
import { defineComponent, h } from "vue";

// Dynamically import all Vue components in the `content` folder
const importComponents = async () => {
  const context = import.meta.glob("../content/**.vue", { eager: true });
  const components = {};

  // Loop through all imported components and add them to the components object
  for (const [path, module] of Object.entries(context)) {
    const componentName = path.split("/").pop()?.replace(".vue", "");
    if (componentName) {
      components[componentName] = module.default;
    }
  }
  return components;
};

const components = await importComponents();

// Generate a Tiptap extension for each component
const extensions = Object.entries(components).map(([name, component]) => {
  console.log(name,)
  return Node.create({
    name,
    group: "block",
    atom: true,
    parseHTML() {
      return [
        {
          tag: name,
        },
      ];
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
  });
});

export default extensions;
