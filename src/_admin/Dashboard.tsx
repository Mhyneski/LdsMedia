import React, { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/appwrite/api";
import { getAllEvents } from "@/lib/appwrite/api";

const Dashboard: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [eventCount, setEventCount] = useState<number>(0);
  const [userCountLoading, setUserCountLoading] = useState(true);
  const [eventCountLoading, setEventCountLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setUserCountLoading(true);
        const response = await getAllUsers();
        const users = response?.documents || [];
        
        // Filter out users with the 'admin' role
        const filteredUsers = users.filter((user) => user.role !== 'admin');

        setUserCount(filteredUsers.length);
      } catch (error) {
        console.error('Error fetching user count:', error);
      } finally {
        setUserCountLoading(false);
      }
    };

    const fetchEventCount = async () => {
      try {
        setEventCountLoading(true);
        const response = await getAllEvents();
        const events = response || [];
        setEventCount(events.length);
      } catch (error) {
        console.error('Error fetching event count:', error);
      } finally {
        setEventCountLoading(false);
      }
    };

    fetchUserCount();
    fetchEventCount();
  }, []);

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-3xl font-semibold mb-4 text-white">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User Count Card */}
        <div className="bg-gray-700 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">User Count</h3>
          {userCountLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="text-2xl font-bold text-indigo-600">{userCount}</p>
          )}
        </div>

         {/* Event Count Card */}
         <div className="bg-gray-700 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Event Count</h3>
          {eventCountLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="text-2xl font-bold text-indigo-600">{eventCount}</p>
          )}
        </div>
        {/* Add more cards as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
