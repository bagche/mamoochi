import { Extension } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import {
  NodeSelection,
  Plugin,
  PluginKey,
  TextSelection,
} from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";

export interface GlobalDragHandleOptions {
  dragHandleWidth: number;
  scrollTreshold: number;
  dragHandleSelector?: string;
  excludedTags: string[];
  customNodes: string[];
}

function absoluteRect(node: Element) {
  const rect = node.getBoundingClientRect();
  const modal = node.closest('[role="dialog"]');
  if (modal && window.getComputedStyle(modal).transform !== "none") {
    const modalRect = modal.getBoundingClientRect();
    return {
      top: rect.top - modalRect.top,
      left: rect.left - modalRect.left,
      right: rect.right - modalRect.left,
      width: rect.width,
    };
  }
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    width: rect.width,
  };
}

function nodeDOMAtCoords(
  coords: { x: number; y: number },
  options: GlobalDragHandleOptions
) {
  const selectors = [
    "li",
    "p:not(:first-child)",
    "pre",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    ...options.customNodes.map((n) => `[data-type=${n}]`),
  ].join(", ");
  return document
    .elementsFromPoint(coords.x, coords.y)
    .find(
      (elem: Element) =>
        elem.parentElement?.matches?.(".ProseMirror") || elem.matches(selectors)
    );
}

function nodePosAtDOM(
  node: Element,
  view: EditorView,
  options: GlobalDragHandleOptions
) {
  const rect = node.getBoundingClientRect();
  return view.posAtCoords({
    left: rect.left + 50 + options.dragHandleWidth,
    top: rect.top + 1,
  })?.inside;
}

function calcNodePos(pos: number, view: EditorView) {
  const $pos = view.state.doc.resolve(pos);
  return $pos.depth > 1 ? $pos.before($pos.depth) : pos;
}

export function DragHandlePlugin(
  options: GlobalDragHandleOptions & { pluginKey: string }
) {
  let listType = "";
  let dragHandleElement: HTMLElement | null = null;

  function handleDragStart(event: DragEvent, view: EditorView) {
    view.focus();
    if (!event.dataTransfer) return;
    const isRTL = document.documentElement.dir === "rtl";
    const xCoord = isRTL
      ? event.clientX - 50 - options.dragHandleWidth
      : event.clientX + 50 + options.dragHandleWidth;
    const node = nodeDOMAtCoords({ x: xCoord, y: event.clientY }, options);
    if (!(node instanceof Element)) return;
    let draggedNodePos = nodePosAtDOM(node, view, options);
    if (draggedNodePos == null || draggedNodePos < 0) return;
    draggedNodePos = calcNodePos(draggedNodePos, view);

    const { from, to } = view.state.selection;
    const diff = from - to;
    const fromSelectionPos = calcNodePos(from, view);
    let differentNodeSelected = false;
    const nodePos = view.state.doc.resolve(fromSelectionPos);
    if (nodePos.node().type.name === "doc") differentNodeSelected = true;
    else {
      const nodeSelection = NodeSelection.create(
        view.state.doc,
        nodePos.before()
      );
      differentNodeSelected = !(
        draggedNodePos + 1 >= nodeSelection.$from.pos &&
        draggedNodePos <= nodeSelection.$to.pos
      );
    }
    let selection = view.state.selection;
    if (
      !differentNodeSelected &&
      diff !== 0 &&
      !(view.state.selection instanceof NodeSelection)
    ) {
      const endSelection = NodeSelection.create(view.state.doc, to - 1);
      selection = TextSelection.create(
        view.state.doc,
        draggedNodePos,
        endSelection.$to.pos
      );
    } else {
      selection = NodeSelection.create(view.state.doc, draggedNodePos);
      if (
        (selection as NodeSelection).node.type.isInline ||
        (selection as NodeSelection).node.type.name === "tableRow"
      ) {
        const $pos = view.state.doc.resolve(selection.from);
        selection = NodeSelection.create(view.state.doc, $pos.before());
      }
    }
    view.dispatch(view.state.tr.setSelection(selection));
    if (
      view.state.selection instanceof NodeSelection &&
      view.state.selection.node.type.name === "listItem"
    ) {
      listType = node.parentElement!.tagName;
    }
    const slice = view.state.selection.content();
    const { dom, text } = serializeForClipboard(view, slice);
    event.dataTransfer.clearData();
    event.dataTransfer.setData("text/html", dom.innerHTML);
    event.dataTransfer.setData("text/plain", text);
    event.dataTransfer.effectAllowed = "copyMove";
    event.dataTransfer.setDragImage(node, 0, 0);
    view.dragging = { slice, move: event.ctrlKey };
  }

  const hideDragHandle = () => dragHandleElement?.classList.add("hide");
  const showDragHandle = () => dragHandleElement?.classList.remove("hide");

  function hideHandleOnEditorOut(event: MouseEvent) {
    if (event.target instanceof Element) {
      const related = event.relatedTarget as HTMLElement;
      if (
        related?.classList.contains("tiptap") ||
        related?.classList.contains("drag-handle")
      )
        return;
    }
    hideDragHandle();
  }

  return new Plugin({
    key: new PluginKey(options.pluginKey),
    view: (view) => {
      const handleBySelector = options.dragHandleSelector
        ? document.querySelector<HTMLElement>(options.dragHandleSelector)
        : null;
      dragHandleElement = handleBySelector || document.createElement("div");
      dragHandleElement.draggable = true;
      dragHandleElement.dataset.dragHandle = "";
      dragHandleElement.classList.add("drag-handle");

      const onDragStart = (e: DragEvent) => handleDragStart(e, view);
      const onDrag = (e: DragEvent) => {
        hideDragHandle();
        const scrollY = window.scrollY;
        if (e.clientY < options.scrollTreshold)
          window.scrollTo({ top: scrollY - 30, behavior: "smooth" });
        else if (window.innerHeight - e.clientY < options.scrollTreshold)
          window.scrollTo({ top: scrollY + 30, behavior: "smooth" });
      };

      dragHandleElement.addEventListener("dragstart", onDragStart);
      dragHandleElement.addEventListener("drag", onDrag);
      hideDragHandle();
      if (!handleBySelector)
        view.dom.parentElement?.appendChild(dragHandleElement);
      view.dom.parentElement?.addEventListener(
        "mouseout",
        hideHandleOnEditorOut
      );

      return {
        destroy: () => {
          if (!handleBySelector) dragHandleElement?.remove();
          dragHandleElement?.removeEventListener("drag", onDrag);
          dragHandleElement?.removeEventListener("dragstart", onDragStart);
          dragHandleElement = null;
          view.dom.parentElement?.removeEventListener(
            "mouseout",
            hideHandleOnEditorOut
          );
        },
      };
    },
    props: {
      handleDOMEvents: {
        mousemove: (view, event) => {
          if (!view.editable) return;
          const isRTL = document.documentElement.dir === "rtl";
          const xCoord = isRTL
            ? event.clientX - 50 - options.dragHandleWidth
            : event.clientX + 50 + options.dragHandleWidth;
          const node = nodeDOMAtCoords(
            { x: xCoord, y: event.clientY },
            options
          );
          const notDragging = node?.closest(".not-draggable");
          const excluded = options.excludedTags.concat(["ol", "ul"]).join(", ");
          if (
            !(node instanceof Element) ||
            node.matches(excluded) ||
            notDragging
          ) {
            hideDragHandle();
            return;
          }
          const compStyle = window.getComputedStyle(node);
          const parsedLineHeight = parseInt(compStyle.lineHeight, 10);
          const lineHeight = isNaN(parsedLineHeight)
            ? parseInt(compStyle.fontSize) * 1.2
            : parsedLineHeight;
          const paddingTop = parseInt(compStyle.paddingTop, 10);
          const rect = absoluteRect(node);
          rect.top += (lineHeight - 24) / 2 + paddingTop;
          if (node.matches("ul:not([data-type=taskList]) li, ol li"))
            rect.left -= options.dragHandleWidth;
          rect.width = options.dragHandleWidth;
          if (!dragHandleElement) return;
          if (isRTL) {
            dragHandleElement.style.right = `${window.innerWidth - rect.right - options.dragHandleWidth}px`;
            dragHandleElement.style.left = "";
          } else {
            dragHandleElement.style.left = `${rect.left - options.dragHandleWidth}px`;
            dragHandleElement.style.right = "";
          }
          dragHandleElement.style.top = `${rect.top}px`;
          showDragHandle();
        },
        keydown: () => hideDragHandle(),
        mousewheel: () => hideDragHandle(),
        dragstart: (view) => view.dom.classList.add("dragging"),
        drop: (view, event) => {
          view.dom.classList.remove("dragging");
          hideDragHandle();
          const dropPos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (!dropPos) return;
          const droppedNode =
            view.state.selection instanceof NodeSelection
              ? view.state.selection.node
              : null;
          if (!droppedNode) return;
          const resolvedPos = view.state.doc.resolve(dropPos.pos);
          const isDroppedInsideList =
            resolvedPos.parent.type.name === "listItem";
          if (
            view.state.selection instanceof NodeSelection &&
            view.state.selection.node.type.name === "listItem" &&
            !isDroppedInsideList &&
            listType === "OL"
          ) {
            const newList = view.state.schema.nodes.orderedList?.createAndFill(
              null,
              droppedNode
            );
            const slice = new Slice(Fragment.from(newList), 0, 0);
            view.dragging = { slice, move: event.ctrlKey };
          }
        },
        dragend: (view) => view.dom.classList.remove("dragging"),
      },
    },
  });
}

const GlobalDragHandle = Extension.create({
  name: "globalDragHandle",
  addOptions() {
    return {
      dragHandleWidth: 20,
      scrollTreshold: 100,
      excludedTags: [],
      customNodes: [],
    };
  },
  addProseMirrorPlugins() {
    return [
      DragHandlePlugin({
        pluginKey: "globalDragHandle",
        dragHandleWidth: this.options.dragHandleWidth,
        scrollTreshold: this.options.scrollTreshold,
        dragHandleSelector: this.options.dragHandleSelector,
        excludedTags: this.options.excludedTags,
        customNodes: this.options.customNodes,
      }),
    ];
  },
});

export default GlobalDragHandle;
