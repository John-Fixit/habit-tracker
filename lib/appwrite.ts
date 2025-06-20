import { Account, Client } from "react-native-appwrite";

const endPoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const project_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const platform = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!;

const client = new Client()
  .setEndpoint(endPoint)
  .setProject(project_ID)
  .setPlatform(platform);

export const account = new Account(client);
