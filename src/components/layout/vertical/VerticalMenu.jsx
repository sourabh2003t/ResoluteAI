import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase'; // Ensure correct Firebase import

export default function VerticalMenu() {
  const router = useRouter();

  const handleDropdownClose = async (e, path) => {
    e.preventDefault();

    if (path === '/login') {
      try {
        await signOut(auth); // ✅ Logout from Firebase
        console.log('User logged out');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }

    router.push(path); // ✅ Navigate to the specified path
  };
  
  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed top-0 left-0 p-4">
       <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul className="space-y-3">
        <li>
          <Link href="/ticket">
            <span className="block p-2 rounded hover:bg-gray-700 cursor-pointer">Tickets</span>
          </Link>
        </li>
        <li>
          <Link onClick={e => handleDropdownClose(e, '/login')} >
            <span className="block p-2 rounded hover:bg-gray-700 cursor-pointer">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
