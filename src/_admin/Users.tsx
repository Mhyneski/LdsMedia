import React, { useEffect, useState } from "react";
import { deleteUserById, getAllUsers, IUser, updateUserDetails } from "@/lib/appwrite/api"; 

const Users: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await getAllUsers();
          const mappedUsers = response?.documents.map((document) => ({
            id: document.$id,
            name: document.name,
            username: document.username,
            email: document.email,
            imageUrl: document.imageUrl,
            bio: document.bio,
            role: document.role,
          })) || [];
          setUsers(mappedUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, []);
    
    const handleEditUser = (userId: string) => {
        const userToEdit = users.find((user) => user.id === userId);
        if (userToEdit) {
          setSelectedUser(userToEdit);
          setIsEditModalOpen(true);
        }
      };
    
    const handleSaveEdit = async (editedUser: IUser) => {
        try {
          // Call the API to update user details
          const updatedUser = await updateUserDetails({
            userId: editedUser.id,
            name: editedUser.name,
            bio: editedUser.bio,
            imageId: editedUser.imageUrl,
            imageUrl: editedUser.imageUrl,
            file: [],
            email: editedUser.email,
            role: editedUser.role,
          });
    
          console.log('User details updated:', updatedUser);
          setIsEditModalOpen(false);
    
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === editedUser.id ? { ...user, ...editedUser } : user
            )
          );
        } catch (error) {
          console.error('Error updating user details:', error);
        }
      };

    const handleDeleteUser = async (userId: string) => {
        try {
          const deleteStatus = await deleteUserById(userId);
    
          console.log(`User with ID ${userId} deleted. Status:`, deleteStatus);
    
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      };
      
    return (
    <div className="container mx-auto my-8 overflow-x-auto">
      {loading ? (
        <div className='text-3xl text-center justify-center'>Loading...</div>
      ) : (
      <table className="min-w-full bg-white border border-gray-800 shadow-md">
        <thead>
          <tr className="bg-gray-400">
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">ID</th>
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Email</th>
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Role</th>
            <th className="py-3 px-7 border-b text-left text-sm font-medium text-black">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-300">
              <td className="py-3 px-4 border-b text-sm font-normal text-black">{user.id}</td>
              <td className="py-3 px-4 border-b text-sm font-normal text-black">{user.email}</td>
              <td className="py-3 px-4 border-b text-sm font-normal text-black">{user.role}</td>
              <td className="py-3 px-4 border-b text-sm font-normal text-black space-x-2">
                    <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded"
                    onClick={() => handleEditUser(user.id)}
                    >
                    Edit
                    </button>
                    <button
                    className="bg-red hover:bg-pink-500 text-white font-bold py-2 px-2 rounded"
                    onClick={() => handleDeleteUser(user.id)}
                    >
                    Delete
                    </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      {isEditModalOpen && selectedUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4 text-black">Edit User</h3>
            <form>
              {['name', 'email', 'role'].map((field) => (
                <div key={field} className="mb-4">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    id={field}
                    value={(selectedUser as any)[field]} // Type assertion here
                    onChange={(e) => {
                      const updatedUser = { ...selectedUser, [field]: e.target.value };
                      setSelectedUser(updatedUser);
                    }}
                    className="mt-1 p-2 border rounded w-full text-black"
                  />
                </div>
              ))}
            </form>
            <div className="flex mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => handleSaveEdit(selectedUser)}
              >
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };

export default Users;
