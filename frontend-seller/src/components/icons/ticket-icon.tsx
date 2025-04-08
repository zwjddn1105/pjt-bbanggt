export function TicketIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M4 4C2.89543 4 2 4.89543 2 6V9C3.10457 9 4 9.89543 4 11C4 12.1046 3.10457 13 2 13V16C2 17.1046 2.89543 18 4 18H20C21.1046 18 22 17.1046 22 16V13C20.8954 13 20 12.1046 20 11C20 9.89543 20.8954 9 22 9V6C22 4.89543 21.1046 4 20 4H4ZM4 6H20V9.1C18.5 9.5 17.5 10.5 17.1 12C17.5 13.5 18.5 14.5 20 14.9V16H4V14.9C5.5 14.5 6.5 13.5 6.9 12C6.5 10.5 5.5 9.5 4 9.1V6ZM11 8V10H13V8H11ZM11 12V14H13V12H11Z" />
    </svg>
  );
}
