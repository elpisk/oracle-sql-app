type Variant = 'basic' | 'intermediate' | 'advanced' | 'done' | 'locked' | 'new'

const STYLES: Record<Variant, string> = {
  basic:        'bg-blue-50 text-apple-blue',
  intermediate: 'bg-orange-50 text-apple-orange',
  advanced:     'bg-red-50 text-apple-red',
  done:         'bg-green-50 text-apple-green',
  locked:       'bg-apple-gray-bg text-apple-tertiary',
  new:          'bg-purple-50 text-apple-purple',
}

const LABELS: Record<Variant, string> = {
  basic:        '하',
  intermediate: '중',
  advanced:     '상',
  done:         '완료',
  locked:       '잠김',
  new:          'NEW',
}

interface Props {
  variant: Variant
  label?: string
  size?: 'sm' | 'md'
}

export default function Badge({ variant, label, size = 'sm' }: Props) {
  const px = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-[13px]'
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${px} ${STYLES[variant]}`}>
      {label ?? LABELS[variant]}
    </span>
  )
}
