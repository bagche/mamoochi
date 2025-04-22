<script setup lang="ts">
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/vue-3";
import AutoJoiner from "tiptap-extension-auto-joiner";
import { Markdown } from "tiptap-markdown";
import { onBeforeUnmount, unref } from "vue";

// import GlobalDragHandle from "../editor/dragger";
import { getExtensions } from "../editor/Extension";

// Retrieve any custom extensions.
const customExtensions = await getExtensions();

const props = defineProps({
  body: { type: String, required: true, default: "" },
});
const { t } = useI18n();
const emit = defineEmits<{ (e: "update", value: string): void }>();

// Create the editor instance directly.
const editor = useEditor({
  content: props.body,
  extensions: [
    StarterKit,
    FloatingMenu,
    BubbleMenu,
    // GlobalDragHandle.configure({
    //   dragHandleWidth: 20,
    //   scrollTreshold: 100,
    // }),
    ...customExtensions,
    Markdown,
    Placeholder.configure({ placeholder: t("Type Something...") }),
    AutoJoiner,
  ],
  onUpdate({ editor }) {
    emit("update", editor.storage.markdown.getMarkdown());
  },
});

// Cleanup: destroy the editor when the component unmounts.
onBeforeUnmount(() => {
  unref(editor)?.destroy();
});
</script>

<template>
  <div v-if="editor" class="relative">
    <USeparator class="mt-5" />

    <!-- Floating Menu -->
    <FloatingMenu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      class="bg-gray-200"
    >
      <UButtonGroup class="flex justify-center rounded-none p-1" size="md">
        <UTooltip :text="$t('Horizontal Line')">
          <UButton
            icon="i-lucide-minus"
            variant="link"
            @click="editor.chain().focus().setHorizontalRule().run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Blockquote')">
          <UButton
            icon="i-lucide-quote"
            variant="link"
            @click="editor.chain().focus().toggleBlockquote().run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Paragraph')">
          <UButton
            :class="{ 'is-active': editor.isActive('paragraph') }"
            icon="i-lucide-pilcrow"
            variant="link"
            @click="editor.chain().focus().setParagraph().run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Heading 1')">
          <UButton
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            icon="i-lucide-heading-1"
            variant="link"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Heading 2')">
          <UButton
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            icon="i-lucide-heading-2"
            variant="link"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Heading 3')">
          <UButton
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            icon="i-lucide-heading-3"
            variant="link"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Bullet List')">
          <UButton
            :class="{ 'is-active': editor.isActive('bulletList') }"
            icon="i-lucide-list"
            variant="link"
            @click="editor.chain().focus().toggleBulletList().run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Ordered List')">
          <UButton
            :class="{ 'is-active': editor.isActive('orderedList') }"
            icon="i-lucide-list-ordered"
            variant="link"
            @click="editor.chain().focus().toggleOrderedList().run()"
          />
        </UTooltip>
      </UButtonGroup>
    </FloatingMenu>

    <!-- Bubble Menu -->
    <BubbleMenu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      class="bg-gray-200"
    >
      <UButtonGroup class="flex justify-center rounded-none p-1" size="md">
        <UTooltip :text="$t('Blockquote')">
          <UButton
            icon="i-lucide-quote"
            variant="link"
            @click="editor.chain().focus().toggleBlockquote().run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Bold')">
          <UButton
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
            icon="i-lucide-bold"
            variant="link"
            @click="editor.chain().focus().toggleBold().run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Italic')">
          <UButton
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
            icon="i-lucide-italic"
            variant="link"
            @click="editor.chain().focus().toggleItalic().run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Strikethrough')">
          <UButton
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
            icon="i-lucide-strikethrough"
            variant="link"
            @click="editor.chain().focus().toggleStrike().run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Paragraph')">
          <UButton
            :class="{ 'is-active': editor.isActive('paragraph') }"
            icon="i-lucide-pilcrow"
            variant="link"
            @click="editor.chain().focus().setParagraph().run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Heading 1')">
          <UButton
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            icon="i-lucide-heading-1"
            variant="link"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Heading 2')">
          <UButton
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            icon="i-lucide-heading-2"
            variant="link"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          />
        </UTooltip>
        <UTooltip :text="$t('Heading 3')">
          <UButton
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            icon="i-lucide-heading-3"
            variant="link"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          />
        </UTooltip>
      </UButtonGroup>
    </BubbleMenu>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="min-h-[30rem] mt-5" />
  </div>
</template>

<style lang="scss">
/* General Styles */
.tiptap:focus {
  outline: none;
}
p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  height: 0;
  pointer-events: none;
  float: right;
  font-weight: 100;
}

/* Floating Menu */
.floating-menu {
  display: flex;
  background-color: var(--gray-300);
  padding: 0.2rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);

  button {
    background-color: unset;
    padding: 0.3rem 0.5rem;
    border-radius: 0.3rem;
    font-size: 0.875rem;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--gray-2);
    }

    &.is-active {
      background-color: var(--white);
      color: var(--purple);
      font-weight: bold;
    }
  }
}

/* Bubble Menu */
.bubble-menu {
  background-color: #ddd;
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

/* Custom Drag Handle (do not change) */
.drag-handle {
  position: fixed;
  opacity: 1;
}
.drag-handle .grab {
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
html.light .drag-handle .grab {
  background-color: #bbb;
}

.drag-handle .grab:hover {
  background-color: #ccc;
}
html.light .drag-handle .grab:hover {
  background-color: #999;
}

.drag-handle .grab:active {
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

.draggable-item {
  display: flex;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  background: white;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0px 10px 20px rgba(0, 0, 0, 0.1);

  .drag-handle {
    flex: 0 0 auto;
    position: relative;
    width: 1rem;
    height: 1rem;
    top: 0.3rem;
    margin-right: 0.5rem;
    cursor: grab;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16"><path fill-opacity="0.2" d="M4 14c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM2 6C.9 6 0 6.9 0 8s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C.9 0 0 .9 0 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  .content {
    flex: 1 1 auto;
  }
}
</style>
