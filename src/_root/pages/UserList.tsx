// UserList.tsx
import React, { useState, useEffect } from 'react';
import { IUser, getAllUsers1 } from '@/lib/appwrite/api';

interface UserListProps {
  onUserClick: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = React.memo(({ onUserClick }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const userList = await getAllUsers1();

        console.log('User list response:', userList);

        if (userList && 'documents' in userList) {
          const transformedUsers = (userList.documents as any[])
            .filter((user) => user.role !== 'admin')
            .map((document) => ({
              id: document.$id,
              name: document.name,
              username: document.username,
              email: document.email,
              imageUrl: document.imageUrl,
            })) as IUser[];

          setUsers(transformedUsers);
        } else {
          console.error('User list is undefined.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally{
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    onUserClick(userId);
  };

  return (
    <div className="p-4 bg-gray-900 text-white overflow-y-auto" style={{ maxHeight: '700px' }}>
  <ul>
    {loading && <p>Loading users...</p>}
    {!loading &&
      users.map((user) => (
        <li
          key={user.id}
          onClick={() => handleUserClick(user.id)}
          className={`flex items-center cursor-pointer ${user.id === selectedUserId ? 'bg-gray-700' : 'bg-gray-800'} p-2 rounded mb-2`}
        >
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <span className="flex-shrink-0">{user.name}</span>
        </li>
      ))}
  </ul>
</div>

    );
  });


export default UserList;
