<script setup lang="ts">
import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu } from "@tiptap/vue-3";
import AutoJoiner from "tiptap-extension-auto-joiner";
import { Markdown } from "tiptap-markdown";

import GlobalDragHandle from "../editor/dragger";
import { getExtensions } from "../editor/Extension";

const extensions = await getExtensions();

const props = defineProps({
  body: { type: String, required: true, default: "" },
});

const emit = defineEmits<{ (e: "update", value: string): void }>();

const editor = useEditor({
  content: props.body,
  extensions: [
    TiptapStarterKit,
    BubbleMenu,
    GlobalDragHandle.configure({
      dragHandleWidth: 40,
      scrollTreshold: 600,
      excludedTags: [],
      customNodes: [],
    }),
    ...extensions,
    Markdown,
    Placeholder.configure({ placeholder: "چیزی بنویسید ..." }),
    AutoJoiner,
  ],
  onUpdate({ editor }) {
    emit("update", editor.storage.markdown.getMarkdown());
  },
});

onBeforeUnmount(() => {
  unref(editor)?.destroy();
});
</script>

<template>
  <div v-if="editor" class="relative">
    <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }">
      <UButtonGroup
        class="flex justify-center bg-yellow-200 rounded-md p-1"
        size="md"
      >
        <UButton
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          icon="i-heroicons-bold"
          variant="link"
          @click="editor.chain().focus().toggleBold().run()"
        />
        <UButton
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          icon="i-heroicons-italic"
          variant="link"
          @click="editor.chain().focus().toggleItalic().run()"
        />
        <UButton
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          icon="i-heroicons-h1"
          variant="link"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        />
        <UButton
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          icon="i-heroicons-h2"
          variant="link"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        />
        <UButton
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          icon="i-heroicons-h3"
          variant="link"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        />
      </UButtonGroup>
    </bubble-menu>
    <UButtonGroup
      class="flex justify-center border-gray-50 border-y rounded-none dark:border-cyan-800 dark:text-white"
      size="md"
    >
      <UButton
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        icon="i-heroicons-bold"
        variant="link"
        @click="editor.chain().focus().toggleBold().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        icon="i-heroicons-italic"
        variant="link"
        @click="editor.chain().focus().toggleItalic().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strikethrough') }"
        icon="i-heroicons-minus"
        variant="link"
        @click="editor.chain().focus().toggleStrike().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
        icon="i-heroicons-code-bracket"
        variant="link"
        @click="editor.chain().focus().toggleCode().run()"
      />
      <UButton
        icon="i-heroicons-x-mark"
        variant="link"
        @click="editor.chain().focus().unsetAllMarks().run()"
      />
      <UButton
        icon="i-heroicons-x-circle"
        variant="link"
        @click="editor.chain().focus().clearNodes().run()"
      />
      <UButton
        :class="{ 'is-active': editor.isActive('paragraph') }"
        icon="i-heroicons-document-text"
        variant="link"
        @click="editor.chain().focus().setParagraph().run()"
      />
      <UButton
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        icon="i-heroicons-h1"
        variant="link"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      />
      <UButton
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        icon="i-heroicons-h2"
        variant="link"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      />
      <UButton
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        icon="i-heroicons-h3"
        variant="link"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      />
      <UButton
        :class="{ 'is-active': editor.isActive('bulletList') }"
        icon="i-heroicons-list-bullet"
        variant="link"
        @click="editor.chain().focus().toggleBulletList().run()"
      />
      <UButton
        :class="{ 'is-active': editor.isActive('orderedList') }"
        icon="i-heroicons-numbered-list"
        variant="link"
        @click="editor.chain().focus().toggleOrderedList().run()"
      />
      <UButton
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        icon="i-heroicons-code-bracket"
        variant="link"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      />
      <UButton
        :class="{ 'is-active': editor.isActive('blockquote') }"
        icon="i-heroicons-chat-bubble-bottom-center-text"
        variant="link"
        @click="editor.chain().focus().toggleBlockquote().run()"
      />
      <UButton
        icon="i-heroicons-minus"
        variant="link"
        @click="editor.chain().focus().setHorizontalRule().run()"
      />
      <UButton
        icon="i-heroicons-arrow-right"
        variant="link"
        @click="editor.chain().focus().setHardBreak().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().undo().run()"
        icon="i-heroicons-arrow-uturn-left"
        variant="link"
        @click="editor.chain().focus().undo().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().redo().run()"
        icon="i-heroicons-arrow-uturn-right"
        variant="link"
        @click="editor.chain().focus().redo().run()"
      />
    </UButtonGroup>
    <TiptapEditorContent :editor="editor" class="min-h-[30rem] mt-10" />
  </div>
</template>

<style lang="scss">
.tiptap:focus {
  outline: none;
}
.tiptap :first-child {
  margin-top: 0;
}
p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  height: 0;
  pointer-events: none;
  float: right;
  font-weight: 100;
}
.bubble-menu {
  background-color: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 0.7rem;
  box-shadow: var(--shadow);
  display: flex;
  padding: 0.2rem;
  button {
    background-color: unset;
    &:hover {
      background-color: var(--gray-3);
    }
    &.is-active {
      background-color: var(--purple);
      &:hover {
        background-color: var(--purple-contrast);
      }
    }
  }
}
.drag-handle {
  position: fixed;
  opacity: 1;
  transition:
    opacity 0.2s ease-in,
    background-color 0.2s ease-in;
  border-radius: 0.25rem;
  background-color: #ddd;
  width: 1.2rem;
  height: 1.5rem;
  z-index: 50;
  cursor: grab;
}
html.light .drag-handle {
  background-color: #bbb;
}

.drag-handle:hover {
  background-color: #ccc;
}
html.light .drag-handle:hover {
  background-color: #999;
}

.drag-handle:active {
  background-color: var(--novel-stone-200, #aaa);
  cursor: grabbing;
}

.drag-handle.hide {
  opacity: 0;
  pointer-events: none;
}

@media screen and (max-width: 600px) {
  .drag-handle {
    display: none;
    pointer-events: none;
  }
}
</style>
