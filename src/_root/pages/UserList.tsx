import React, { useEffect, useState } from 'react';
import { getAllUsers, IUser } from '@/lib/appwrite/api';

const UserList: React.FC<{ onSelectUser: (userId: string) => void }> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getAllUsers();

        if (userList) {
          const transformedUsers = userList.documents
            .filter((user) => user.role !== 'admin')
            .map((document) => ({
              id: document.$id,
              name: document.name,
              username: document.username,
              email: document.email,
              imageUrl: document.imageUrl,
              bio: document.bio,
            })) as IUser[];

          setUsers(transformedUsers);
        } else {
          console.error('User list is undefined.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-md mt-8 p-4 bg-black shadow-md rounded-md overflow-y-auto max-h-150">
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between p-2 mb-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 text-black"
            onClick={() => onSelectUser(user.id)}
          >
            <div className="flex items-center">
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;