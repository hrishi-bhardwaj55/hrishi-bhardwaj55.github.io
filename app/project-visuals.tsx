import { github } from './projects';
export function PortfolioFooter() {
  return (
    <footer className="v-footer">
      <div>
        <span className="v-kicker">
          OPEN TO SOFTWARE ENGINEERING OPPORTUNITIES
        </span>
        <h2>Let’s build something useful.</h2>
      </div>
      <a href={github}>Explore my GitHub ↗</a>
    </footer>
  );
}
export function ProjectGlyph({ id }: { id: string }) {
  return (
    <svg
      className={`project-glyph glyph-${id}`}
      viewBox="0 0 400 300"
      fill="none"
      aria-hidden="true"
    >
      {id === 'skeptic' ? (
        <>
          <path
            d="M70 100h110m40 0h110M70 200h110m40 0h110"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle
            cx="200"
            cy="150"
            r="86"
            stroke="currentColor"
            strokeOpacity=".3"
          />
          <path d="M170 190l60-90" stroke="currentColor" strokeWidth="8" />
          <text
            x="32"
            y="48"
            fill="currentColor"
            fontSize="12"
            fontFamily="monospace"
          >
            VERIFY BEFORE MEASURING
          </text>
        </>
      ) : id === 'servicerswitch' ? (
        <>
          <path
            d="M80 90h240v120H80zM120 55h160v190H120z"
            stroke="currentColor"
            strokeOpacity=".35"
          />
          <path
            d="M148 116h104m-104 24h104m-104 24h58"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle
            cx="280"
            cy="210"
            r="34"
            fill="#151b20"
            stroke="currentColor"
          />
          <path
            d="m265 210 10 10 20-23"
            stroke="currentColor"
            strokeWidth="3"
          />
        </>
      ) : (
        <>
          {Array.from({ length: 9 }, (_, i) => (
            <rect
              key={i}
              x={90 + (i % 3) * 76}
              y={40 + Math.floor(i / 3) * 76}
              width="64"
              height="64"
              rx="4"
              stroke="currentColor"
              fill={i === 4 ? 'currentColor' : 'none'}
              fillOpacity=".25"
              strokeOpacity={i === 4 ? 1 : 0.4}
            />
          ))}
          <path
            d="m184 152 12 12 21-25"
            stroke="currentColor"
            strokeWidth="3"
          />
        </>
      )}
    </svg>
  );
}
