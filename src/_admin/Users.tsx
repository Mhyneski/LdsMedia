import React, { useEffect, useState } from "react";
import { deleteUserById, getAllUsers, IUser, updateUserDetails } from "@/lib/appwrite/api"; 
import { useUserContext } from "@/context/AuthContext";

const Users: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const { user } = useUserContext();
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await getAllUsers();
          // Map Document objects to IUser format
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
        }
      };
  
      fetchUsers();
    }, []);
    
    const handleEditUser = (userId: string) => {
        // Find the selected user for editing
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
            imageId: editedUser.imageUrl, // Assuming imageUrl is the imageId here
            imageUrl: editedUser.imageUrl,
            file: [], // You can pass the new file for profile picture update if needed
            email: editedUser.email,
            role: editedUser.role,
          });
    
          console.log('User details updated:', updatedUser);
          // Close the edit modal
          setIsEditModalOpen(false);
    
          // Optionally, update the local state with the updated user details
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
          // Call the API to delete the user by ID
          const deleteStatus = await deleteUserById(userId);
    
          console.log(`User with ID ${userId} deleted. Status:`, deleteStatus);
    
          // Optionally, update the local state by removing the deleted user
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } catch (error) {
          console.error('Error deleting user:', error);
          // Handle the error or log it as needed
        }
      };
      
    return (
    <div className="container mx-auto my-8 overflow-x-auto">
      <h2 className="text-3xl font-semibold mb-4 text-white">All Users</h2>
      <table className="min-w-full bg-white border border-gray-800 shadow-md">
        <thead>
          <tr className="bg-gray-400">
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">ID</th>
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Email</th>
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Role</th>
            <th className="py-3 px-7 border-b text-left text-sm font-medium text-black">Action</th>
            {/* Add other table headers for user information */}
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
      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-black mx-w ">Edit User</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="mt-1 p-2 border rounded w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="mt-1 p-2 border rounded w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="mt-1 p-2 border rounded w-full text-black"
                />
              </div>
              {/* You can add more fields as needed, such as uploading a new profile picture */}
            </form>
            <div className="flex mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleSaveEdit(selectedUser)}
              >
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
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
