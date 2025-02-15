import type {
    MarkdownOptions,
    MarkdownPlugin,
    MinimalNode,
    MinimalTree,
  } from "@nuxt/content";
  import type { MDCComment, MDCElement, MDCRoot, MDCText } from "@nuxtjs/mdc";
  import { parseMarkdown } from "@nuxtjs/mdc/runtime";
  import type { Element, Properties } from "hast";
  import type { Link } from "mdast";
  import type { State } from "mdast-util-to-hast";
  import { normalizeUri } from "micromark-util-sanitize-uri";
  import slugify from "slugify";
  import { isRelative, withLeadingSlash, withoutTrailingSlash } from "ufo";
  
  // Regular expression to match semantic versioning patterns.
  const SEMVER_REGEX = /^\d+(?:\.\d+)*(?:\.x)?$/;
  
  /**
   * Compresses an MDCRoot tree into a minimal tree structure.
   * @param input - The parsed MDCRoot tree.
   * @returns A MinimalTree with only the essential node data.
   */
  function compressTree(input: MDCRoot): MinimalTree {
    return {
      type: "minimal",
      value: input.children
        .map(compressNode)
        .filter((node): node is MinimalNode => node !== undefined),
    };
  }
  
  /**
   * Recursively compresses a markdown node to its minimal representation.
   * @param node - An MDCElement, MDCText, or MDCComment.
   * @returns A MinimalNode, a string (for text), or undefined if the node should be skipped.
   */
  function compressNode(
    node: MDCElement | MDCText | MDCComment
  ): MinimalNode | string | undefined {
    if (node.type === "comment") return undefined;
    if (node.type === "text") return node.value;
  
    // Remove empty class names for code blocks.
    if (node.tag === "code" && node.props?.className?.length === 0) {
      delete node.props.className;
    }
  
    return [
      node.tag,
      node.props || {},
      ...node.children.map(compressNode).filter((child) => child !== undefined),
    ];
  }
  
  /**
   * Generates a URL-friendly path from a raw path string.
   * @param path - The raw path.
   * @param options - Options to control leading slash and slugify behavior.
   * @returns A normalized path string.
   */
  const generatePath = (
    path: string,
    { forceLeadingSlash = true, slugifyOptions = {} } = {}
  ): string => {
    const parts = path.split("/").map((part) => slugify(refineUrlPart(part), slugifyOptions));
    const joined = parts.join("/");
    return forceLeadingSlash
      ? withLeadingSlash(withoutTrailingSlash(joined))
      : joined;
  };
  
  /**
   * Refines a URL segment by removing unwanted numbering, 'index', and 'draft' keywords.
   * @param name - The URL segment.
   * @returns The refined segment.
   */
  export function refineUrlPart(name: string): string {
    name = name.split(/[/:]/).pop()!;
    if (SEMVER_REGEX.test(name)) return name;
    return name
      .replace(/(\d+\.)?(.*)/, "$2")
      .replace(/^index(\.draft)?$/, "")
      .replace(/\.draft$/, "");
  }
  
  /**
   * Parses a markdown string into structured data.
   * @param markdownText - The raw markdown content.
   * @param options - Optional markdown configuration (plugins, toc, highlight, compress).
   * @returns A promise resolving to the parsed data.
   */
  export async function parseMarkdownText(
    markdownText: string,
    options: Partial<MarkdownOptions> = {}
  ): Promise<any> {
    const config: MarkdownOptions = { ...options };
  
    // Resolve any rehype and remark plugins.
    config.rehypePlugins = await importPlugins(config.rehypePlugins);
    config.remarkPlugins = await importPlugins(config.remarkPlugins);
  
    // Configure highlighting if provided.
    const highlight = options.highlight
      ? {
          ...options.highlight,
          highlighter:
            typeof options.highlight?.highlighter === "function"
              ? options.highlight.highlighter
              : undefined,
        }
      : undefined;
  
    // Parse the markdown text. We provide a default fileOptions object.
    const parsed = await parseMarkdown(
      markdownText,
      {
        ...config,
        highlight,
        toc: config.toc,
        remark: { plugins: config.remarkPlugins },
        rehype: {
          plugins: config.rehypePlugins,
          options: { handlers: { link } },
        },
      },
      { fileOptions: { id: "unknown", body: markdownText } }
    );
  
    // Optionally compress the parsed tree.
    if ((options as { compress?: boolean }).compress) {
      return {
        ...parsed.data,
        excerpt: parsed.excerpt ? compressTree(parsed.excerpt) : undefined,
        body: {
          ...compressTree(parsed.body),
          toc: parsed.toc,
        },
        id: "unknown",
      };
    }
  
    return {
      ...parsed.data,
      excerpt: parsed.excerpt,
      body: {
        ...parsed.body,
        toc: parsed.toc,
      },
      id: "unknown",
    };
  }
  
  /**
   * Dynamically imports markdown plugins.
   * @param plugins - An object mapping plugin names to definitions.
   * @returns A promise resolving to the object with imported plugins.
   */
  async function importPlugins(
    plugins: Record<string, false | MarkdownPlugin> = {}
  ) {
    const resolved: Record<string, false | MarkdownPlugin> = {};
    for (const [name, plugin] of Object.entries(plugins)) {
      resolved[name] = plugin
        ? {
            instance:
              plugin.instance ||
              (await import(/* @vite-ignore */ name).then((m) => m.default || m)),
            options: plugin.options || {},
          }
        : false;
    }
    return resolved;
  }
  
  /**
   * Custom link handler for transforming markdown link nodes.
   * @param state - The transformation state.
   * @param node - The markdown link node.
   * @returns A HAST element representing the link.
   */
  function link(state: State, node: Link & { attributes?: Properties }): Element {
    const properties: Properties = {
      ...(node.attributes || {}),
      href: normalizeUri(normaliseLink(node.url)),
    };
  
    if (node.title != null) {
      properties.title = node.title;
    }
  
    const result: Element = {
      type: "element",
      tagName: "a",
      properties,
      children: state.all(node),
    };
  
    state.patch(node, result);
    return state.applyData(node, result);
  }
  
  /**
   * Normalizes a markdown link URL.
   * Converts relative links ending with ".md" into generated paths.
   * @param link - The raw link URL.
   * @returns The normalized URL.
   */
  function normaliseLink(link: string): string {
    const match = link.match(/#.+$/);
    const hash = match ? match[0] : "";
    if (
      link.replace(/#.+$/, "").endsWith(".md") &&
      (isRelative(link) || (!/^https?/.test(link) && !link.startsWith("/")))
    ) {
      return generatePath(link.replace(".md" + hash, ""), { forceLeadingSlash: false }) + hash;
    }
    return link;
  }
  