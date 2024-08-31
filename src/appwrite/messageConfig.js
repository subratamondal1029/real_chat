import { Client, Databases, ID, Query } from "appwrite";
import {
  databaseId,
  messagesCollectionId,
  projectEndpoint,
  projectId,
} from "../config";

class messageConfig {
  client = new Client();
  database;
  constructor() {
    this.client.setEndpoint(projectEndpoint).setProject(projectId);
    this.database = new Databases(this.client);
  }

  async getAllConversations(userId) {
    try {
      const conversations = await this.database.listDocuments(
        databaseId,
        messagesCollectionId,
        [Query.or(
          [
            Query.equal("contact1", userId),
            Query.equal("contact2", userId),
          ]
        )]
      );
      return conversations.documents;
    } catch (error) {
      console.error("Get all conversations error:", error.message);
      throw error.message;
    }
  }

  async sendMessage({message, messageId}, type = "update", contact1, contact2) {
    message = message.map((msg) => JSON.stringify(msg));

    try {
      let document;

      if (type === "create") {
        document = await this.database.createDocument(
          databaseId,
          messagesCollectionId,
          ID.unique(),
          {message, contact1, contact2}
        );
      } else {
        document = await this.database.updateDocument(
          databaseId,
          messagesCollectionId,
          messageId,
          {message}
        );
      }

      return document;
    } catch (error) {
      console.log("create convertation error:", error.message);
      throw error.message;
    }
  }

  // Subscribe to real-time events
  async subscribeToRealtimeEvents(callBack, userId) {
    this.client.subscribe(
      `databases.${databaseId}.collections.${messagesCollectionId}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          ) || response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          if (response.payload.contact1 === userId || response.payload.contact2 === userId){
            callBack(response.payload);
          }
        }
      }
    );
  }
}

const messageService = new messageConfig();
export default messageService;
