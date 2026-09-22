interface RenderedConnection {
  id: string
  path: string
  startX: number
  startY: number
  junctionX: number
  junctionY: number
  endX: number
  endY: number
  isSelected: boolean
}

interface TreeConnectionsProps {
  connections: RenderedConnection[]
}

function diamondPath(x: number, y: number, width: number, height: number) {
  return [
    `M ${x} ${y - height}`,
    `L ${x + width} ${y}`,
    `L ${x} ${y + height}`,
    `L ${x - width} ${y}`,
    'Z',
  ].join(' ')
}

function socketPath(x: number, y: number, width: number, height: number) {
  return [
    `M ${x - width} ${y - height * 0.45}`,
    `Q ${x} ${y - height} ${x + width} ${y - height * 0.45}`,
    `L ${x + width} ${y + height * 0.45}`,
    `Q ${x} ${y + height} ${x - width} ${y + height * 0.45}`,
    'Z',
  ].join(' ')
}

export function TreeConnections({ connections }: TreeConnectionsProps) {
  return (
    <svg
      className="tree-connections"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {connections.map((connection) => (
        <g
          key={connection.id}
          className={[
            'tree-connection',
            connection.isSelected ? 'tree-connection--selected' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <path className="tree-connection__aura" d={connection.path} />
          <path className="tree-connection__groove" d={connection.path} />
          <path className="tree-connection__shadow" d={connection.path} />
          <path className="tree-connection__bevel" d={connection.path} />
          <path className="tree-connection__line" d={connection.path} />
          <path className="tree-connection__shine" d={connection.path} />
          <path
            className="tree-connection__socket tree-connection__socket--start"
            d={socketPath(connection.startX, connection.startY, 0.92, 0.74)}
          />
          <path
            className="tree-connection__socket tree-connection__socket--end"
            d={socketPath(connection.endX, connection.endY, 0.92, 0.74)}
          />
          <path
            className="tree-connection__junction"
            d={diamondPath(connection.junctionX, connection.junctionY, 0.55, 0.7)}
          />
          <path
            className="tree-connection__cap tree-connection__cap--start"
            d={diamondPath(connection.startX, connection.startY, 0.36, 0.46)}
          />
          <path
            className="tree-connection__cap tree-connection__cap--end"
            d={diamondPath(connection.endX, connection.endY, 0.36, 0.46)}
          />
        </g>
      ))}
    </svg>
  )
}
