import type { CSSProperties } from 'react';
import { Inline } from './inline';
import { RideLifecycle } from './ride-lifecycle';

type Step = { label: string; detail: string; marker?: string; meta?: string };

export type Diagram = {
  id: string;
  title: string;
  summary: string;
} & (
  | { kind: 'flow'; steps: Step[] }
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
  | { kind: 'table'; columns: string[]; rows: string[][] }
  | {
      kind: 'cards';
      cards: {
        label: string;
        meta?: string;
        tags?: string[];
        detail: string;
      }[];
    }
  | {
      kind: 'timeline';
      events: { date: string; label: string; detail: string; mark?: boolean }[];
    }
  | {
      kind: 'seam';
      lanes: { label: string; steps: Step[]; note?: string }[];
    }
);

const kickers: Partial<Record<Diagram['kind'], string>> = {
  bars: 'MEASUREMENTS',
  timeline: 'HISTORY',
};

function FlowSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="diagram-flow">
      {steps.map((step, index) => (
        <li key={step.label}>
          <span className="diagram-step-index" aria-hidden="true">
            {step.marker ?? String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h4>
              <Inline text={step.label} />
            </h4>
            <p>
              <Inline text={step.detail} />
            </p>
            {step.meta && <p className="diagram-step-meta">{step.meta}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function StoryDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <figure
      className={`story-diagram diagram-${diagram.kind}`}
      aria-labelledby={`${diagram.id}-title`}
    >
      <div className="diagram-heading">
        <span className="v-kicker">
          {kickers[diagram.kind] ?? 'SYSTEM NOTES'}
        </span>
        <h3 id={`${diagram.id}-title`}>{diagram.title}</h3>
      </div>
      {diagram.id === 'uber-driver-lifecycle' ? (
        <RideLifecycle />
      ) : diagram.kind === 'flow' ? (
        <FlowSteps steps={diagram.steps} />
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
      ) : diagram.kind === 'table' ? (
        <div className="diagram-table-scroll">
          <table className="diagram-data-table">
            <thead>
              <tr>
                {diagram.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {diagram.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={index}>
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : diagram.kind === 'cards' ? (
        <div className="diagram-card-grid">
          {diagram.cards.map((card) => (
            <div className="diagram-card" key={card.label}>
              <div className="diagram-card-heading">
                <h4>
                  <Inline text={card.label} />
                </h4>
                {card.meta && <span>{card.meta}</span>}
              </div>
              {card.tags && (
                <ul aria-label={`${card.label} agents`}>
                  {card.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
              <p>
                <Inline text={card.detail} />
              </p>
            </div>
          ))}
        </div>
      ) : diagram.kind === 'timeline' ? (
        <ol className="diagram-timeline-list">
          {diagram.events.map((event) => (
            <li
              className={event.mark ? 'timeline-mark' : undefined}
              key={event.label}
            >
              <span className="diagram-timeline-date">{event.date}</span>
              <div>
                <h4>{event.label}</h4>
                <p>
                  <Inline text={event.detail} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : diagram.kind === 'seam' ? (
        <div className="diagram-seam-lanes">
          {diagram.lanes.map((lane) => (
            <div className="diagram-lane" key={lane.label}>
              <p className="diagram-lane-label">{lane.label}</p>
              <FlowSteps steps={lane.steps} />
              {lane.note && (
                <p className="diagram-lane-note">
                  <Inline text={lane.note} />
                </p>
              )}
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
      <figcaption>
        <Inline text={diagram.summary} />
      </figcaption>
    </figure>
  );
}
