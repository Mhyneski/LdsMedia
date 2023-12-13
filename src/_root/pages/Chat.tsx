// Chat.tsx
import React, { useState, useEffect } from 'react';
import { getMessages, sendMessage, NewMessage, IMessage, getUserById, deleteMessage } from '@/lib/appwrite/api';


interface ChatProps {
  currentUserId: string;
  selectedUserId: string;
}

const Chat: React.FC<ChatProps> = ({ currentUserId, selectedUserId }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getMessages();
      const filteredMessages = response.filter(
        (message) =>
          (message.senderId === currentUserId && message.receiverId === selectedUserId) ||
          (message.senderId === selectedUserId && message.receiverId === currentUserId)
      );
      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedUserName = async () => {
    try {
      const selectedUser = await getUserById(selectedUserId);
      setSelectedUserName(selectedUser?.name || '');
    } catch (error) {
      console.error('Error fetching selected user name:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchSelectedUserName();
  }, [currentUserId, selectedUserId]);

  const getSenderName = (messageSenderId: string): string => {
    return messageSenderId === currentUserId ? 'You' : selectedUserName;
  };

  const handleSendMessage = async () => {
    try {
      const timestamp = new Date();
      const messageData: NewMessage = {
        senderId: currentUserId,
        receiverId: selectedUserId,
        message: newMessage,
        timestamp,
      };

      console.log('Sending message:', messageData);

      await sendMessage(messageData);
      fetchMessages();
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Call the API function to delete the message
      await deleteMessage(messageId);

      // Fetch messages again to update the UI
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white flex flex-col">
  <h2 className="text-2xl font-bold mb-4">
    {selectedUserName || 'User'}
  </h2>
  <div className="flex-grow overflow-y-auto" style={{ maxHeight: '600px' }}>
    {loading && <p>Loading messages...</p>}
    {!loading &&
      messages.map((message) => (
        <div
          key={message.$id}
          className={`mb-2 ${
            message.senderId === currentUserId
              ? 'flex justify-end'
              : 'flex justify-start'
          }`}
        >
          <div
            className={`bg-blue-500 p-3 rounded-lg text-white max-w-md break-words ${
              message.senderId === currentUserId ? 'self-end' : 'self-start'
            }`}
          >
            {message.message}
            <div className="text-xs text-gray-300 mt-1">
              {message.senderId === currentUserId ? 'You' : getSenderName(message.senderId)}
            </div>
            {message.senderId === currentUserId && (
              <button
                className="text-xs text-red-500 mt-1 cursor-pointer"
                onClick={() => handleDeleteMessage(message.$id)}
              >
                <svg
                  className="w-4 h-4 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="pink"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
  </div>
  <div className="mt-4">
    <div className="flex flex-col md:flex-row items-center">
      <input
        className="p-2 border border-gray-700 rounded text-black md:h-50 w-full md:w-96 flex-grow mb-2 md:mb-0"
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        className="md:ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  </div>
</div>

  );
};

export default Chat;
