interface Props {
  value: number   // 0-100
  color?: string
  height?: number
  showLabel?: boolean
}

export default function ProgressBar({ value, color = '#0071E3', height = 4, showLabel = false }: Props) {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-[12px] text-apple-secondary mb-1">
          <span>진도</span>
          <span className="font-semibold" style={{ color }}>{value}%</span>
        </div>
      )}
      <div className="rounded-full bg-apple-gray-bg overflow-hidden" style={{ height }}>
        <div className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
