import { Fragment } from 'react';
import { sitePath } from '@/lib/site-path';
import { headingId } from './data';

// A deliberately small, text-only Markdown format. Raw HTML is never executed.
function Inline({ text }: { text: string }) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function StoryBody({ markdown }: { markdown: string }) {
  const blocks = markdown.trim().split(/\r?\n\s*\r?\n/);
  return blocks.map((block, i) => {
    if (block.startsWith('# ')) return null;
    if (block.startsWith('## ')) {
      const text = block.slice(3).trim();
      return (
        <h2 id={headingId(text)} key={i}>
          {text}
        </h2>
      );
    }
    const image = block.match(
      /^!\[([^\]]*)\]\((\/stories\/[a-z0-9/-]+\.png)\)$/,
    );
    if (image) {
      const caption = blocks[i + 1]?.match(/^\*([^*]+)\*$/)?.[1];
      return (
        <figure key={i}>
          <a
            href={sitePath(image[2])}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open full-size diagram: ${image[1]}`}
          >
            <img
              src={sitePath(image[2])}
              alt={image[1]}
              loading="lazy"
              decoding="async"
              width="1600"
            />
          </a>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    if (i > 0 && blocks[i - 1].startsWith('![') && /^\*[^*]+\*$/.test(block))
      return null;
    return (
      <p key={i}>
        <Inline text={block.replace(/\r?\n/g, ' ')} />
      </p>
    );
  });
}
