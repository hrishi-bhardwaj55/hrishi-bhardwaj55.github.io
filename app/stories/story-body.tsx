import { sitePath } from '@/lib/site-path';
import { headingId, storyBlocks, storyImageSizes, storyDiagrams } from './data';
import { Inline } from './inline';
import { StoryDiagram } from './story-diagram';

export { Inline };

// A deliberately small, text-only Markdown format. Raw HTML is never executed.
export function StoryBody({ markdown }: { markdown: string }) {
  const blocks = storyBlocks(markdown);
  return blocks.map((block, i) => {
    const code = block.match(/^```([^\n]*)\n([\s\S]*)\n```$/);
    if (code) {
      const [label, tag] = code[1].split(' | ').map((part) => part.trim());
      return (
        <figure className="story-code" key={i}>
          {label && (
            <figcaption>
              <span>{label}</span>
              {tag && <span>{tag}</span>}
            </figcaption>
          )}
          <pre>
            <code>{code[2]}</code>
          </pre>
        </figure>
      );
    }
    const diagramId = block.match(/^:::diagram ([a-z0-9-]+)$/)?.[1];
    if (diagramId) {
      const diagram = storyDiagrams.find((item) => item.id === diagramId);
      if (!diagram) throw new Error(`Missing story diagram: ${diagramId}`);
      return <StoryDiagram key={i} diagram={diagram} />;
    }
    if (block.startsWith('# ')) return null;
    if (block.startsWith('## ')) {
      // A second line under a section heading is its kicker.
      const [text, kicker] = block.slice(3).split('\n');
      return [
        <h2 id={headingId(text.trim())} key={i}>
          {text.trim()}
        </h2>,
        kicker && (
          <p className="story-section-kicker" key={`${i}-kicker`}>
            {kicker.trim()}
          </p>
        ),
      ];
    }
    if (block.startsWith('### ')) {
      const text = block.slice(4).trim();
      return (
        <h3 id={headingId(text)} key={i}>
          {text}
        </h3>
      );
    }
    if (block.split('\n').every((line) => line.startsWith('>')))
      return (
        <blockquote key={i}>
          <p>
            <Inline text={block.replace(/^>\s?/gm, '').replace(/\n/g, ' ')} />
          </p>
        </blockquote>
      );
    if (block.startsWith('- '))
      return (
        <ul key={i}>
          {block.split(/\n(?=- )/).map((item, index) => (
            <li key={index}>
              <Inline text={item.slice(2).replace(/\n\s*/g, ' ')} />
            </li>
          ))}
        </ul>
      );
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
        <Inline text={block.replace(/\n/g, ' ')} />
      </p>
    );
  });
}
