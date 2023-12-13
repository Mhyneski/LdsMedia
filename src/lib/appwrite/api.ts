import { ID, Query } from "appwrite";

import { appwriteConfig, account, databases, storage, avatars } from "./config";
import { IUpdatePost, INewPost, INewUser, IUpdateUser, IUser, Event, CalendarEvent, IMessage, NewMessage } from "@/types";


// ============================================================
// MESSAGES
// ============================================================
// ============================== SEND MESSAGE
export async function sendMessage(newMessage: NewMessage): Promise<void> {
  const { senderId, receiverId, message } = newMessage;
  const timestamp = new Date().toISOString();

  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        senderId,
        receiverId,
        message,
        timestamp,
      }
    );

    if (!response || !response.$id) {
      throw new Error('Failed to send message.');
    }

    console.log('Message sent successfully:', response.$id);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error; 
  }
}

interface ListDocumentsResponse {
  documents?: any[];
}
// ============================== GET MESSAGE
export async function getMessages(): Promise<IMessage[]> {
  try {
    const response: ListDocumentsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId
    );

    const documents = response?.documents ?? [];

    const messages: IMessage[] = documents.map((document: any) => ({
      $id: document.$id,
      senderId: document.senderId,
      receiverId: document.receiverId,
      message: document.message,
      timestamp: document.timestamp,
    }));

    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to retrieve messages.');
  }
}

// ============================== DELETE MESSAGE
export async function deleteMessage(messageId: string): Promise<void> {
  try {
    const response = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId
    );

    if (!response) {
      throw new Error('Failed to delete message.');
    }

    console.log('Message deleted successfully:', messageId);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

// ============================== GET ALL USERS FOR MESSAGE
export async function getAllUsers1(): Promise<any> {
  const queries: any[] = [Query.orderDesc('$createdAt')];

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET CURRENT USER FOR MESSAGE
export async function getCurrentUser1(): Promise<IUser | null> {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) {
      throw new Error('Current account not found.');
    }

    const currentUserResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUserResponse || !currentUserResponse.documents || currentUserResponse.documents.length === 0) {
      throw new Error('Failed to retrieve current user.');
    }

    const currentUserDocuments: any[] = currentUserResponse.documents;
    const currentUser: IUser = {
      id: currentUserDocuments[0].$id,
      name: currentUserDocuments[0].name,
      username: currentUserDocuments[0].username,
      email: currentUserDocuments[0].email,
      imageUrl: currentUserDocuments[0].imageUrl,
      bio: currentUserDocuments[0].bio,
      role: currentUserDocuments[0].role,
    };

    return currentUser;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}


// ============================================================
// CALENDAR EVETNS
// ============================================================
// ============================== CREATE EVENT 6569536c4a9034546766
export async function createEvent(newEvent: Event): Promise<CalendarEvent> {
  try {
    const response: any = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.calendarEventsCollectionId, // Replace with your actual events collection ID
      ID.unique(), // Provide a unique document ID
      {
        title: newEvent.title,
        start: newEvent.start.toISOString(),
        end: newEvent.end.toISOString(),
      }
    );

    if (!response || !response.$id) {
      throw new Error('Failed to create event.');
    }

    // Return the created event with the new ID
    return {
      id: response.$id,
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

// ============================== GET ALL EVENTS
export async function getAllEvents() {
  try {
    const events = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.calendarEventsCollectionId, // Replace with your actual events collection ID
      [Query.orderDesc('$createdAt')]
    );

    if (!events || !events.documents) {
      throw new Error('Failed to retrieve events.');
    }

    return events.documents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

// ============================== UPDATE EVENTS
export async function updateEventInDatabase(updatedEvent: CalendarEvent): Promise<void> {
  try {
    // Omit the 'id' field from the updatedEvent object
    const { id, ...updatedEventData } = updatedEvent;

    // Convert the updated data to a JSON string
    const updatedEventDataString = JSON.stringify(updatedEventData);

    // Use the event ID as the unique identifier to update the document
    await databases.updateDocument(
      appwriteConfig.databaseId,
      '6569536c4a9034546766', // Replace with your actual events collection ID
      id, // Use the ID or unique identifier of the event to update
      updatedEventDataString // Use the updated data as a JSON string
    );
  } catch (error) {
    console.error('Error updating event in database:', error);
    throw error;
  }
}

// ============================== DELETE EVENT
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    console.log('Deleting event with ID:', eventId);

    const response: any = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.calendarEventsCollectionId, // Replace with your actual events collection ID
      eventId
    );

    console.log('Delete response:', response);

    if (!response || !response.deleted) {
      console.warn('Event not found or already deleted.');
      return; // Consider the operation successful; no need to throw an error
    }

    console.log('Event deleted successfully');
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};



// ============================================================
// ADMIN
// ============================================================
// ============================== DISPLAY USERS
export async function getAllUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER DETAILS
export async function updateUserDetails(user: IUpdateUser) {
  try {
    const hasFileToUpdate = user.file.length > 0;
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Update user details
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        email: user.email,
        role: user.role,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE USER
export async function deleteUserById(userId: string) {
  try {
    // Ensure userId is not empty
    if (!userId) {
      throw new Error("Invalid userId");
    }

    // Get user's saved posts
    const savedPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("user", userId)]
    );

    // Delete user's saved posts
    for (const savedPost of savedPosts.documents) {
      await deleteSavedPost(savedPost.$id);
    }

    // Get user's posts
    const userPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId)]
    );

    // Delete user's posts
    for (const userPost of userPosts.documents) {
      await deletePost(userPost.$id, userPost.imageId);
    }

    // Delete user
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!statusCode) {
      throw new Error("Failed to delete user");
    }

    return { status: "Ok" };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw { error: 'Delete user failed', details: error }; // Return a consistent error response
  }
}



// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
      role: user.role,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
  role: string,
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) {
      // Handle the case where users is undefined
      throw new Error("Failed to fetch user data");
    }

    return users;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching users:", error);

    // Return a default value or an empty array to prevent undefined
    return [];
  }
}


// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export type { IUser };
export type { Event };
export type { CalendarEvent };
export type { NewMessage, IMessage };