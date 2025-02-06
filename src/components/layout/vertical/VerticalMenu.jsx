import Link from 'next/link';

export default function VerticalMenu() {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed top-0 left-0 p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul className="space-y-3">
        <li>
          <Link href="/">
            <span className="block p-2 rounded hover:bg-gray-700 cursor-pointer">Home</span>
          </Link>
        </li>
        <li>
          <Link href="/ticket">
            <span className="block p-2 rounded hover:bg-gray-700 cursor-pointer">Tickets</span>
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <span className="block p-2 rounded hover:bg-gray-700 cursor-pointer">Settings</span>
          </Link>
        </li>
        <li>
          <button className="w-full text-left p-2 rounded hover:bg-gray-700">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
