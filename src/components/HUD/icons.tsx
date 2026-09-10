/* Small line icons drawn to the same weight, so the HUD never needs emoji. */

export function FlowerIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round">
        <path d="M8 9.4V14" />
        <path d="M8 12c-1.6 0-2.7-.8-3.1-2.1 1.5-.4 2.6.1 3.1 1.2" />
      </g>
      <g fill="currentColor">
        <ellipse cx="8" cy="3.5" rx="1.5" ry="2.1" />
        <ellipse cx="11.1" cy="5.8" rx="1.5" ry="2.1" transform="rotate(72 11.1 5.8)" />
        <ellipse cx="9.9" cy="9.2" rx="1.5" ry="2.1" transform="rotate(144 9.9 9.2)" />
        <ellipse cx="6.1" cy="9.2" rx="1.5" ry="2.1" transform="rotate(216 6.1 9.2)" />
        <ellipse cx="4.9" cy="5.8" rx="1.5" ry="2.1" transform="rotate(288 4.9 5.8)" />
      </g>
      <circle cx="8" cy="6.6" r="1.25" fill="var(--warm-ivory)" />
    </svg>
  );
}

export function ButterflyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M7.4 8c0 1.9-1.4 4.1-3.4 4.1S.8 10.7.8 8.9 2.3 4 4.6 3.5C6.3 3.1 7.4 5.4 7.4 8z" />
        <path d="M8.6 8c0 1.9 1.4 4.1 3.4 4.1s3.2-1.4 3.2-3.2S13.7 4 11.4 3.5C9.7 3.1 8.6 5.4 8.6 8z" />
      </g>
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none">
        <path d="M8 4.6v6.6" />
        <path d="M8 4.4 6.7 2.6M8 4.4 9.3 2.6" />
      </g>
    </svg>
  );
}

export function SoundOnIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.6 3.4v6.9" />
        <path d="M10.4 2.2v6.9" />
        <path d="M5.6 3.4 10.4 2.2" />
        <ellipse cx="4.1" cy="11.1" rx="1.6" ry="1.3" />
        <ellipse cx="8.9" cy="9.9" rx="1.6" ry="1.3" />
      </g>
    </svg>
  );
}

export function SoundOffIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.6 3.4v6.9" />
        <path d="M10.4 2.2v4.2" />
        <path d="M5.6 3.4 10.4 2.2" />
        <ellipse cx="4.1" cy="11.1" rx="1.6" ry="1.3" />
        <path d="M2.6 2.4 13.4 13.2" opacity="0.75" />
      </g>
    </svg>
  );
}

export function SparkIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
      <path
        d="M8 1.6 9.2 6l4.4 1.2L9.2 8.4 8 12.8 6.8 8.4 2.4 7.2 6.8 6z"
        fill="currentColor"
      />
    </svg>
  );
}
