export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
  email: string;
  role: string;
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  role: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
};

//Create New Event
export interface Event {
  title: string;
  start: Date;
  end: Date;
};

//View Calendar Event
export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  // Other properties specific to your calendar events
};

//get message
export type IMessage = {
  $id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date; 
}

//sendmessage
export type NewMessage = {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}