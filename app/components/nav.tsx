import Link from 'next/link';

const Nav: React.FC = () => {
  return (
    <ul className="mt-3">
      <li className="my-1"><Link className="hover:bg-gray-500" href="/">Home</Link></li>
      <li className="my-1"><Link className="hover:bg-gray-500" href="/products">Candidates</Link></li>
      <li className="my-1"><Link className="hover:bg-gray-500" href="/products/create">Create candidate</Link></li>
    </ul>
  );
}

export default Nav;
