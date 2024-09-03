import { Account, Client, ID, Databases, Storage } from "appwrite";
import {
  databaseId,
  messagesCollectionId,
  profileBucket,
  projectEndpoint,
  projectId,
  usersCollectionId,
} from "../config";

class authConfig {
  client = new Client();
  account;
  database;
  storage;
  constructor() {
    this.client.setEndpoint(projectEndpoint).setProject(projectId);
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async signupWithEmail({ email, password, fullName, username }) {
    try {
      // Create user account
      const userAccount = await this.account.create(
        username,
        email,
        password,
        fullName
      );

      if (userAccount) {
        // Log in user and store in database
        const userData = await this.storeinDataBase({
          fullName,
          username,
          email,
          password, // Pass the password to storeinDataBase
        });

        return userData;
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      throw error.message;
    }
  }

  async storeinDataBase({ fullName, username, email, password }) {
    try {
      // Create session for the newly created user
      await this.account.createEmailPasswordSession(email, password);

      // Create a document in the database
      const userData = await this.database.createDocument(
        databaseId,
        usersCollectionId,
        username,
        {
          fullName,
          username,
          email,
        }
      );

      return userData;
    } catch (error) {
      console.error("Database storage error:", error.message);
      throw error.message;
    }
  }

  async loginWithEmail({ email, password }) {
    try {
      // Create a session for the user
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );

      if (session) {
        // Retrieve user data from the database
        const userData = await this.database.getDocument(
          databaseId,
          usersCollectionId,
          session.userId
        );
        return userData;
      }
    } catch (error) {
      console.error("Login error:", error.message);
      throw error.message;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      if (user) {
        const userData = await this.database.getDocument(databaseId, usersCollectionId, user.$id);
        return userData;
      }
    } catch (error) {
      console.error("Get current user error:", error.message);
      throw error.message;
    }
  }

  async logout() {
    try {
      const response = await this.account.deleteSessions();
      response ? true : false;
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error.message;
    }
  }

  async getUser(contact1, contact2, currentUserId) {
    let userId;
    if (contact1 !== currentUserId) {
      userId = contact1;
    } else if (contact2 !== currentUserId) {
      userId = contact2;
    }

    try {
      const otherUserData = await this.database.getDocument(databaseId, usersCollectionId, userId);
      
      return {
        userId,
        fullName: otherUserData.fullName,
        imageId: otherUserData.imageId,
        username: otherUserData.username
      };
    } catch (error) {
      throw error;
    }
  }

  async updateName(name){
    try {
      const changeName = await this.account.updateName(name)
     const userData = await this.database.updateDocument(databaseId, usersCollectionId, changeName.$id, {fullName: name})
      return userData
    } catch (error) {
      throw error.message
    }
  }

  async updateEmail(email, password){
    try {
      const changeEmail = await this.account.updateEmail(email, password)
      const userData = await this.database.updateDocument(databaseId, usersCollectionId, changeEmail.$id, {email: email})
      return userData
    } catch (error) {
      throw error.message
    }
  }

  getImage(imageId, size={w: 100, h: 100}) {
    return this.storage.getFilePreview(profileBucket, imageId, size.w, size.h).href;
  }

  async updateImage(imageId, userId, file, type="update"){
    try {
      if(type === "update") await this.storage.deleteFile(profileBucket, imageId)
      const fileUpload = await this.storage.createFile(profileBucket, ID.unique(), file)
      if(!fileUpload) throw "File upload error"
      const userData = await this.database.updateDocument(databaseId, usersCollectionId, userId, {imageId: fileUpload.$id})
      return userData
    } catch (error) {
      throw error.message
    }
  }
}

const authService = new authConfig();
export default authService;
