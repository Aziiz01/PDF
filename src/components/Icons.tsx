import { LucideProps, User } from 'lucide-react'

export const Icons = {
  user: User,
  logo: ({ className, ...props }: LucideProps) => (
    <svg
      viewBox='0 0 256 168'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      {...props}>
      <polygon
        fill='#111111'
        points='181.394935 42.749283 256 74.2039835 256 96.0617321 181.394935 127.078518 175.477838 105.581524 230.646979 84.8771384 175.477838 64.0931689'
      />
      <polygon
        fill='#111111'
        points='74.6050654 42.7484751 0 74.2039835 0 96.0617321 74.6050654 127.078518 80.5221623 105.581524 25.3530206 84.8771384 80.5221623 64.0931689'
      />
      <polygon
        fill='#4065C5'
        points='144.339858 0 170.003907 0 112.990192 167.110525 85.996093 167.110525'
      />
    </svg>
  ),
}
