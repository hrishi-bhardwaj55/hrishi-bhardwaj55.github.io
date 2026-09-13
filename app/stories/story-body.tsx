import { Fragment } from 'react';
import { sitePath } from '@/lib/site-path';
import { headingId, storyImageSizes, storyDiagrams } from './data';
import { StoryDiagram } from './story-diagram';

// A deliberately small, text-only Markdown format. Raw HTML is never executed.
export function Inline({ text }: { text: string }) {
  return text
    .split(/(\[[^\]]+\]\(https:\/\/[^\s)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
      if (link)
        return (
          <a key={i} href={link[2]}>
            {link[1]}
          </a>
        );
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
    const diagramId = block.match(/^:::diagram ([a-z0-9-]+)$/)?.[1];
    if (diagramId) {
      const diagram = storyDiagrams.find((item) => item.id === diagramId);
      if (!diagram) throw new Error(`Missing story diagram: ${diagramId}`);
      return <StoryDiagram key={i} diagram={diagram} />;
    }
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
      const dimensions = storyImageSizes[image[2]];
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
              width={dimensions?.width}
              height={dimensions?.height}
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
