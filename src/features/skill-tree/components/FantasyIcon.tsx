import type { FantasyIconId } from '../types/skillTree'

interface FantasyIconProps {
  icon: FantasyIconId
  className?: string
  variant?: 'default' | 'node'
}

export function FantasyIcon({
  icon,
  className,
  variant = 'default',
}: FantasyIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      {variant === 'node' ? (
        <>
          <g className="node-icon__outline">{getNodeIconPaths(icon)}</g>
          <g className="node-icon__glyph">{getNodeIconPaths(icon)}</g>
        </>
      ) : (
        getIconPaths(icon)
      )}
    </svg>
  )
}

function getNodeIconPaths(icon: FantasyIconId) {
  switch (icon) {
    case 'arcane-star':
      return (
        <>
          <path d="M32 5 39 24 59 32 39 40 32 59 25 40 5 32 25 24Z" />
          <path d="M32 18v28M18 32h28" />
          <path d="M21 21c6-5 16-7 22 0M43 43c-6 5-16 7-22 0" />
        </>
      )
    case 'claw':
      return (
        <>
          <path d="M18 52c9-17 10-29 4-42" />
          <path d="M32 56c6-19 5-33-2-48" />
          <path d="M46 52c2-18-3-31-14-42" />
          <path d="M14 55c12 5 25 5 38 0" />
        </>
      )
    case 'crown':
      return (
        <>
          <path d="M9 48h46l-5-27-11 11-7-21-7 21-11-11Z" />
          <path d="M14 54h36M19 41h26" />
          <path d="M25 32h14" />
        </>
      )
    case 'crossed-swords':
      return (
        <>
          <path d="M13 52 27 38M36 29 53 12l-3 13-13 3" />
          <path d="M51 52 37 38M28 29 11 12l3 13 13 3" />
          <path d="M22 42 16 36M42 42l6-6" />
        </>
      )
    case 'flame':
      return (
        <>
          <path d="M33 58c12-5 18-14 17-24-1-8-6-15-11-25-2 10-8 17-15 21 1-8-1-13-7-18 1 12-7 18-7 29 0 10 9 16 23 17Z" />
          <path d="M31 52c7-4 10-10 9-16-1-5-5-8-8-14-1 6-5 10-10 14 0 8 3 13 9 16Z" />
        </>
      )
    case 'gear':
      return (
        <>
          <path d="M28 7h8l2 8 7 3 7-4 5 7-5 6 1 8 7 5-3 8-9-1-6 5-1 8h-8l-3-8-7-3-7 4-5-7 5-7-1-7-7-5 3-8 9 1 6-5Z" />
          <circle cx="32" cy="32" r="10" />
        </>
      )
    case 'lock':
      return (
        <>
          <path d="M16 29h32v25H16Z" />
          <path d="M23 29v-8c0-8 4-14 9-14s9 6 9 14v8" />
          <path d="M32 37v10" />
          <circle cx="32" cy="37" r="2" />
        </>
      )
    case 'mana-drop':
      return (
        <>
          <path d="M32 6c13 16 21 28 21 39 0 9-8 15-21 15s-21-6-21-15c0-11 8-23 21-39Z" />
          <path d="M22 41 32 19l11 22-11 12Z" />
        </>
      )
    case 'mirror':
      return (
        <>
          <path d="M17 10h30l7 7v30l-7 7H17l-7-7V17Z" />
          <path d="M25 25 32 18l7 7-7 7Z" />
          <path d="M24 42h16M28 54l-5 7M36 54l5 7" />
        </>
      )
    case 'open-book':
      return (
        <>
          <path d="M8 13c10-4 17-2 24 4v40c-7-6-14-8-24-4Z" />
          <path d="M56 13c-10-4-17-2-24 4v40c7-6 14-8 24-4Z" />
          <path d="M18 27h8M18 38h8M38 27h8M38 38h8" />
          <path d="M32 17v40" />
        </>
      )
    case 'shield':
      return (
        <>
          <path d="M32 6 53 15v16c0 14-8 24-21 29C19 55 11 45 11 31V15Z" />
          <path d="M32 15v35M21 28h22" />
        </>
      )
    case 'staff':
      return (
        <>
          <path d="M17 57 42 20" />
          <path d="M45 7 56 18 45 29 34 18Z" />
          <path d="M45 7v22M34 18h22" />
          <path d="M14 49 26 57" />
        </>
      )
    case 'ward':
      return (
        <>
          <path d="M32 7 51 16v15c0 13-7 22-19 27-12-5-19-14-19-27V16Z" />
          <path d="M22 35 30 43 44 22" />
          <circle cx="32" cy="32" r="13" />
        </>
      )
  }
}

function getIconPaths(icon: FantasyIconId) {
  switch (icon) {
    case 'arcane-star':
      return (
        <>
          <path d="M32 6 37 25 56 32 37 39 32 58 27 39 8 32 27 25Z" />
          <path d="M32 18v28M18 32h28" />
          <path d="M18 19c8-6 20-6 28 0M46 45c-8 6-20 6-28 0" />
          <path d="m20 13 3 7-7-2M44 51l-3-7 7 2" />
        </>
      )
    case 'claw':
      return (
        <>
          <path d="M16 47c7-15 8-27 4-37 11 9 13 22 6 40" />
          <path d="M31 51c4-17 3-30-2-42 12 10 16 25 9 45" />
          <path d="M46 47c1-16-3-27-10-36 14 6 22 20 18 39" />
          <path d="M12 53c13 5 27 6 41 0" />
        </>
      )
    case 'crown':
      return (
        <>
          <path d="M10 48h44l-5-28-11 12-6-18-7 18-10-12Z" />
          <path d="M14 54h36M18 42h28" />
          <path d="M21 47c5-5 17-5 22 0M24 32l8 5 8-5" />
          <circle cx="15" cy="20" r="3" />
          <circle cx="32" cy="14" r="3" />
          <circle cx="49" cy="20" r="3" />
        </>
      )
    case 'crossed-swords':
      return (
        <>
          <path d="m13 51 16-16M35 29 52 12l-2 11L39 25" />
          <path d="m51 51-16-16M29 29 12 12l2 11 11 2" />
          <path d="M22 42 15 35M42 42l7-7" />
        </>
      )
    case 'flame':
      return (
        <>
          <path d="M33 58c12-5 18-13 17-24-1-9-7-15-11-23-2 9-8 14-15 19 1-7-1-12-6-17 0 11-7 16-7 27 0 10 8 16 22 18Z" />
          <path d="M31 52c6-4 9-9 8-15-1-5-5-9-7-14-1 5-5 9-9 12 0 8 2 13 8 17Z" />
          <path d="m38 10-8 18h9l-11 20" />
        </>
      )
    case 'gear':
      return (
        <>
          <path d="M28 7h8l2 8 7 3 7-4 5 7-5 6 1 8 7 5-3 8-9-1-6 5-1 8h-8l-3-8-7-3-7 4-5-7 5-7-1-7-7-5 3-8 9 1 6-5Z" />
          <circle cx="32" cy="32" r="9" />
        </>
      )
    case 'lock':
      return (
        <>
          <path d="M18 29h28v24H18Z" />
          <path d="M24 29v-8c0-7 4-12 8-12s8 5 8 12v8" />
          <path d="M32 37v8" />
          <circle cx="32" cy="36" r="2" />
        </>
      )
    case 'mana-drop':
      return (
        <>
          <path d="M32 6c12 15 20 27 20 38 0 9-8 15-20 15s-20-6-20-15c0-11 8-23 20-38Z" />
          <path d="M21 41 32 19l12 22-12 12Z" />
          <path d="M21 41h23M32 19v34" />
          <path d="M24 47c6 5 16 4 20-3" />
        </>
      )
    case 'mirror':
      return (
        <>
          <path d="M18 10h19l7 7v24l-7 7H18l-7-7V17Z" />
          <path d="M29 16h17l7 7v24l-7 7H29l-7-7" />
          <path d="M22 26 28 20l6 6-6 6ZM33 38l4 4 6-8" />
          <path d="M24 48 19 59M42 54l5 7" />
        </>
      )
    case 'open-book':
      return (
        <>
          <path d="M8 14c10-4 17-3 24 2v39c-7-5-14-6-24-2Z" />
          <path d="M56 14c-10-4-17-3-24 2v39c7-5 14-6 24-2Z" />
          <path d="M17 24h7M17 33h7M40 24h7M40 33h7" />
          <path d="M20 43c3-3 6-3 9 0M36 43c3-3 6-3 9 0" />
          <path d="M32 16v39" />
        </>
      )
    case 'shield':
      return (
        <>
          <path d="M32 6 53 15v16c0 14-8 23-21 28C19 54 11 45 11 31V15Z" />
          <path d="M32 13v38M20 24h24" />
        </>
      )
    case 'staff':
      return (
        <>
          <path d="M18 56 43 19" />
          <path d="M45 7 55 17 44 28 34 18Z" />
          <path d="M45 7 44 28M34 18h21" />
          <path d="M14 48 26 56" />
        </>
      )
    case 'ward':
      return (
        <>
          <path d="M32 7 51 16v15c0 13-7 21-19 26-12-5-19-13-19-26V16Z" />
          <path d="M22 35 30 43 44 22" />
          <path d="M19 19c8 3 18 3 26 0" />
          <circle cx="32" cy="32" r="13" />
          <path d="M32 20v24M21 32h22" />
        </>
      )
  }
}
