<script setup lang="ts">
import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu } from "@tiptap/vue-3";
import AutoJoiner from "tiptap-extension-auto-joiner";
import { Markdown } from "tiptap-markdown";

// import GlobalDragHandle from "../editor/dragger";
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
    // GlobalDragHandle.configure({
    //   dragHandleWidth: 20,
    //   scrollTreshold: 100,
    //   dragHandleSelector: ".custom-drag-handle",
    //   excludedTags: [],
    //   customNodes: [],
    // }),
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
  transition: opacity 0.2s ease-in;
  border-radius: 0.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(0, 0, 0, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z");
  background-size: calc(0.5em + 0.375rem) calc(0.5em + 0.375rem);
  background-repeat: no-repeat;
  background-position: center;
  width: 1.2rem;
  height: 1.5rem;
  z-index: 50;
  cursor: grab;
  &:hover {
    background-color: var(--novel-stone-100);
  }
  &:active {
    background-color: var(--novel-stone-200);
    cursor: grabbing;
  }
  &.hide {
    opacity: 0;
    pointer-events: none;
  }
  @media screen and (max-width: 600px) {
    display: none;
    pointer-events: none;
  }
}
</style>
