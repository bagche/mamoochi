import type { EditorView } from "@tiptap/pm/view";
import type { Slice } from "prosemirror-model";
import { DOMSerializer } from "prosemirror-model";

export function serializeForClipboard(view: EditorView, slice: Slice) {
  view.someProp("transformCopied", (f) => {
    slice = f(slice!, view);
  });

  const context: any[] = [];
  let { content, openStart, openEnd } = slice;
  while (
    openStart > 1 &&
    openEnd > 1 &&
    content.childCount === 1 &&
    content.firstChild!.childCount === 1
  ) {
    openStart--;
    openEnd--;
    const node = content.firstChild!;
    context.push(
      node.type.name,
      node.attrs != node.type.defaultAttrs ? node.attrs : null
    );
    content = node.content;
  }

  const serializer =
    view.someProp("clipboardSerializer") ||
    DOMSerializer.fromSchema(view.state.schema);
  const doc = detachedDoc();
  const wrap = doc.createElement("div");
  wrap.appendChild(serializer.serializeFragment(content, { document: doc }));

  let firstChild = wrap.firstChild,
    wrappers = 0,
    needsWrap;
  while (
    firstChild &&
    firstChild.nodeType === 1 &&
    (needsWrap = wrapMap[firstChild.nodeName.toLowerCase()])
  ) {
    for (let i = needsWrap.length - 1; i >= 0; i--) {
      const wrapper = doc.createElement(needsWrap[i]);
      while (wrap.firstChild) {
        wrapper.appendChild(wrap.firstChild);
      }
      wrap.appendChild(wrapper);
      wrappers++;
    }
    firstChild = wrap.firstChild;
  }

  if (firstChild && firstChild.nodeType === 1) {
    (firstChild as HTMLElement).setAttribute(
      "data-pm-slice",
      `${openStart} ${openEnd}${wrappers ? ` -${wrappers}` : ""} ${JSON.stringify(context)}`
    );
  }

  const text =
    view.someProp("clipboardTextSerializer", (f) => f(slice, view)) ||
    slice.content.textBetween(0, slice.content.size, "\n\n");

  return { dom: wrap, text, slice };
}

const wrapMap: { [node: string]: string[] } = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"],
};

let _detachedDoc: Document | null = null;
function detachedDoc() {
  return (
    _detachedDoc ||
    (_detachedDoc = document.implementation.createHTMLDocument("title"))
  );
}
