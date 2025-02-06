import Link from 'next/link';

export default function VerticalMenu() {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed top-0 left-0 p-4">
      <ul className="space-y-3">
        <li>
          <Link href="/ticket">
            <span className="block p-2 rounded hover:bg-gray-700 cursor-pointer">Tickets</span>
          </Link>
        </li>
        <li>
          <Link href="/logout">
            <span className="block p-2 rounded hover:bg-gray-700 cursor-pointer">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
