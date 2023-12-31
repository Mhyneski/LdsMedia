import { Button } from '@/components/ui';
import { INITIAL_USER, useUserContext } from '@/context/AuthContext';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const {setUser, setIsAuthenticated } = useUserContext();

  const { mutate: signOut } = useSignOutAccount();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };
  
  return (
    <div className="bg-gray-800 text-white h-screen w-64 flex flex-col">
      <div className="p-4 text-2xl font-bold">Admin Dashboard</div>
      <div className="flex-grow">
        <nav>
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/admin/">Dashboard</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/admin/dashboard/allusers">Users</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/admin/dashboard/events">Events</Link>
            </li>
            {/* Add more links as needed */}
          </ul>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={(e) => handleSignOut(e)}>
            <p className="small-medium lg:base-medium">Logout</p>
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
