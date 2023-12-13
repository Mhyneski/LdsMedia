// messenger.tsx
import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import Chat from './Chat';
import { getCurrentUser1 } from '@/lib/appwrite/api';

const Messenger: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const currentUser = await getCurrentUser1();
        setCurrentUserId(currentUser?.id || null);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }

    fetchCurrentUser();
  }, []);

  const handleUserClick = (userId: string) => {
    setSelectedUser(userId);
  };

  return (
    <div className="p-4 dark:bg-gray-900 w-full mx-auto">
    <div className="p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8"></h1>
      <div className="flex">
        <div className="flex">
          <UserList onUserClick={handleUserClick} />
        </div>
        <div className="flex-2 flex-grow ml-8">
          {currentUserId && selectedUser && (
            <Chat currentUserId={currentUserId} selectedUserId={selectedUser} />
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Messenger;

