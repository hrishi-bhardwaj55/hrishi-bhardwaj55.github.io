'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const events = [
  {
    event: 'ENTERING_BLOCK',
    label: 'Enter',
    status: 'Available',
    place: 'Block A',
    detail:
      'The entering event registers the full driver record. The driver is now a candidate for requests in this block.',
    available: true,
  },
  {
    event: 'DRIVER_LOCATION',
    label: 'Move',
    status: 'Available',
    place: 'Block A',
    detail:
      'A location update changes coordinates for a driver already in the store. It does not register an unknown driver.',
    available: true,
  },
  {
    event: 'RIDE_REQUEST',
    label: 'Match',
    status: 'Assigned',
    place: 'Leaving Block A',
    detail:
      'After scoring eligible drivers, the task emits the match and removes the winner from the available set.',
    available: false,
  },
  {
    event: 'RIDE_COMPLETE',
    label: 'Complete',
    status: 'Available',
    place: 'Block B',
    detail:
      'The completion event updates the rating and registers the driver in the destination block.',
    available: true,
  },
] as const;

export function RideLifecycle() {
  const [step, setStep] = useState(0);
  const current = events[step];
  return (
    <div className="ride-lifecycle">
      <p className="diagram-instruction">Step through one illustrative ride.</p>
      <div
        className="ride-event-buttons"
        role="group"
        aria-label="Driver lifecycle events"
      >
        {events.map((event, index) => (
          <Button
            key={event.event}
            variant="outline"
            aria-pressed={step === index}
            onClick={() => setStep(index)}
          >
            <span aria-hidden="true">{index + 1}</span> {event.label}
          </Button>
        ))}
      </div>
      <div
        className="ride-state"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="ride-state-top">
          <span>{current.event}</span>
          <span>{current.place}</span>
        </div>
        <div className="ride-state-path" aria-hidden="true">
          <span className={step < 2 ? 'active' : ''}>Block A</span>
          <span className="ride-path-line" />
          <span className={step === 2 ? 'active' : ''}>Ride</span>
          <span className="ride-path-line" />
          <span className={step === 3 ? 'active' : ''}>Block B</span>
        </div>
        <div className="ride-state-result">
          <strong>{current.status}</strong>
          <span>
            {current.available
              ? 'In the candidate set'
              : 'Removed from the candidate set'}
          </span>
        </div>
        <p>{current.detail}</p>
      </div>
    </div>
  );
}
