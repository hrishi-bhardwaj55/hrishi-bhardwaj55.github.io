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
      {id === 'uber-ride-matching' ? (
        <>
          <path
            d="M55 90h105v120h130M160 90h130"
            stroke="currentColor"
            strokeOpacity=".5"
            strokeDasharray="5 6"
          />
          <circle cx="55" cy="90" r="8" fill="currentColor" />
          <circle cx="160" cy="90" r="8" fill="#151b20" stroke="currentColor" />
          <circle cx="290" cy="90" r="8" fill="currentColor" />
          <circle cx="290" cy="210" r="8" fill="currentColor" />
          <g fill="currentColor" fontSize="13" fontFamily="monospace">
            <text x="35" y="65">
              EVENT
            </text>
            <text x="133" y="65">
              STATE
            </text>
            <text x="260" y="65">
              MATCH
            </text>
            <text x="240" y="248">
              AVAILABLE
            </text>
          </g>
          <text
            x="28"
            y="25"
            fill="currentColor"
            fontSize="12"
            fontFamily="monospace"
          >
            AVAILABILITY CHANGES WITH EVENTS
          </text>
        </>
      ) : id === 'twitter-analytics' ? (
        <>
          <path
            d="M75 150h62m65 0h61"
            stroke="currentColor"
            strokeOpacity=".6"
          />
          <rect
            x="20"
            y="115"
            width="60"
            height="70"
            rx="5"
            stroke="currentColor"
          />
          <rect
            x="137"
            y="115"
            width="65"
            height="70"
            rx="5"
            stroke="currentColor"
          />
          <rect
            x="263"
            y="105"
            width="110"
            height="90"
            rx="5"
            stroke="currentColor"
          />
          <g
            fill="currentColor"
            fontSize="14"
            fontFamily="monospace"
            textAnchor="middle"
          >
            <text x="50" y="156">
              NLB
            </text>
            <text x="170" y="156">
              Go
            </text>
            <text x="318" y="156">
              MySQL
            </text>
          </g>
          <text
            x="28"
            y="62"
            fill="currentColor"
            fontSize="12"
            fontFamily="monospace"
          >
            LESS WORK PER REQUEST
          </text>
        </>
      ) : id === 'skeptic' ? (
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
