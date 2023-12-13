import { Routes, Route } from 'react-router-dom';


import './globals.css';
import SigninForm from '@/_auth/forms/SigninForm';
import Dashboard from '@/_admin/Dashboard';
import Sidebar from '@/_admin/Sidebar';
import Users from '@/_admin/Users';
import Calendar from '@/_admin/Calendar';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile, EventPage, Messenger} from './_root/pages';
import SignupForm from '@/_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster"


const App = () => {
  return (
    <main className="flex h-screen">
    <Routes>
      {/* public routes */}
      <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
      </Route>
     
     {/* private routes */}
     <Route element={<RootLayout />}>
     <Route index element={<Home />}/>
     <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/Messenger" element={<Messenger/>} />
          <Route path="/eventpage" element={<EventPage/>} />
          
     </Route>
     <Route
          path="/admin/*"
          element={
            <>
              <Sidebar />
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="/dashboard/allusers" element={<Users />} />
                <Route path="/dashboard/events" element={<Calendar/>} />
              </Routes>
            </>
          }
        />
    </Routes>
    <Toaster/>
    </main>
  );
};

export default App;