export default function SproutLogo({ className = 'w-8 h-8' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* stem */}
      <path
        d="M32 56V32"
        stroke="#16a34a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* left leaf */}
      <path
        d="M32 36C32 36 22 34 18 24C14 14 24 8 32 20C32 20 26 18 22 24C18 30 26 34 32 36Z"
        fill="#22c55e"
      />
      {/* right leaf */}
      <path
        d="M32 28C32 28 42 24 46 14C50 4 40 2 32 16C32 16 38 14 42 20C46 26 38 28 32 28Z"
        fill="#4ade80"
      />
      {/* ground */}
      <path
        d="M24 56C24 56 28 52 32 52C36 52 40 56 40 56"
        stroke="#86efac"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
