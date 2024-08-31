import { Account, Client, ID, Databases } from "appwrite";
import {
  databaseId,
  messagesCollectionId,
  projectEndpoint,
  projectId,
  usersCollectionId,
} from "../config";

class authConfig {
  client = new Client();
  account;
  database;
  constructor() {
    this.client.setEndpoint(projectEndpoint).setProject(projectId);
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
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

  async getUserData(userId){
    try {
      const userData = await this.database.getDocument(databaseId, usersCollectionId, userId);
      return userData;
    } catch (error) {
      console.log("Get user data error:", error);
      throw error
    }
  }
}

const authService = new authConfig();
export default authService;
