import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import HomeIntro from '../content/HomeIntro.vue'

export default Node.create({
  name: 'HomeIntro',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'HomeIntro',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['HomeIntro', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(HomeIntro)
  },
})