const projectEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECTID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION;
const messagesCollectionId = import.meta.env.VITE_APPWRITE_MESSAGE_COLLECTION;

export {
    projectEndpoint,
    projectId,
    databaseId,
    usersCollectionId,
    messagesCollectionId
};
