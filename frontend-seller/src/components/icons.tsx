export function BreadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12,2C9.01,2 6.17,3.59 5.19,5.77C4.29,5.67 3.44,5.81 2.75,6.17C1.78,6.68 1,7.74 1,9C1,10.54 2.39,12 4,12L5,12C5,12.55 5.45,13 6,13H18C18.55,13 19,12.55 19,12H20C21.61,12 23,10.54 23,9C23,7.74 22.22,6.68 21.25,6.17C20.56,5.81 19.71,5.67 18.81,5.77C17.83,3.59 14.99,2 12,2M12,4C14.21,4 16.17,5.15 16.66,6.71C16.13,6.95 15.66,7.29 15.28,7.71C14.92,8.12 14.66,8.61 14.53,9.16C14.33,9.07 14.09,9 13.83,9H10.17C9.91,9 9.67,9.07 9.47,9.16C9.34,8.61 9.08,8.12 8.72,7.71C8.34,7.29 7.87,6.95 7.34,6.71C7.83,5.15 9.79,4 12,4M6,14C5.45,14 5,14.45 5,15V19C5,20.66 6.34,22 8,22H16C17.66,22 19,20.66 19,19V15C19,14.45 18.55,14 18,14H6Z" />
    </svg>
  );
}

export function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.56 5.04 3.96 6.48l-.96 3.6c-.12.36.24.72.6.6l4.08-1.68c.72.12 1.44.12 2.28.12 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
