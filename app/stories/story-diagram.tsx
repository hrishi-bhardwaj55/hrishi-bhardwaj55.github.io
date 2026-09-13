import type { CSSProperties } from 'react';
import { RideLifecycle } from './ride-lifecycle';

export type Diagram = {
  id: string;
  title: string;
  summary: string;
} & (
  | { kind: 'flow'; steps: { label: string; detail: string }[] }
  | { kind: 'comparison'; columns: { label: string; items: string[] }[] }
  | {
      kind: 'bars';
      rows: {
        label: string;
        value: number;
        display: string;
        detail: string;
        peak?: boolean;
      }[];
    }
);

export function StoryDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <figure
      className={`story-diagram diagram-${diagram.kind}`}
      aria-labelledby={`${diagram.id}-title`}
    >
      <div className="diagram-heading">
        <span className="v-kicker">
          {diagram.kind === 'bars' ? 'MEASUREMENTS' : 'SYSTEM NOTES'}
        </span>
        <h3 id={`${diagram.id}-title`}>{diagram.title}</h3>
      </div>
      {diagram.id === 'uber-driver-lifecycle' ? (
        <RideLifecycle />
      ) : diagram.kind === 'flow' ? (
        <ol className="diagram-flow">
          {diagram.steps.map((step, index) => (
            <li key={step.label}>
              <span className="diagram-step-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h4>{step.label}</h4>
                <p>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : diagram.kind === 'comparison' ? (
        <div
          className="diagram-columns"
          style={{ '--columns': diagram.columns.length } as CSSProperties}
        >
          {diagram.columns.map((column, index) => (
            <div className="diagram-column" key={column.label}>
              <span className="diagram-column-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4>{column.label}</h4>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="diagram-bars">
          {diagram.rows.map((row) => (
            <div
              className={row.peak ? 'diagram-bar peak-bar' : 'diagram-bar'}
              key={row.label}
            >
              <div className="diagram-bar-label">
                <h4>{row.label}</h4>
                <strong>{row.display}</strong>
              </div>
              <div className="diagram-bar-track" aria-hidden="true">
                <span
                  style={{
                    width: `${(row.value / Math.max(...diagram.rows.map((item) => item.value))) * 100}%`,
                  }}
                />
              </div>
              <p>{row.detail}</p>
            </div>
          ))}
        </div>
      )}
      <figcaption>{diagram.summary}</figcaption>
    </figure>
  );
}
