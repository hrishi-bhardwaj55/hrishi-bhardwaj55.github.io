import { Fragment } from 'react';

// Inline Markdown shared by article text and diagram labels. Raw HTML is never executed.
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
