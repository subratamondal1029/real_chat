const projectEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECTID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION;
const messagesCollectionId = import.meta.env.VITE_APPWRITE_MESSAGE_COLLECTION;
const profileBucket = import.meta.env.VITE_APPWRITE_PROFILE_BACKET_ID;

export {
    projectEndpoint,
    projectId,
    databaseId,
    usersCollectionId,
    messagesCollectionId,
    profileBucket
};
