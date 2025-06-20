import { Account, Client, Databases } from "react-native-appwrite";

const endPoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const project_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const platform = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!;

export const client = new Client()
  .setEndpoint(endPoint)
  .setProject(project_ID)
  .setPlatform(platform);

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
export const HABIT_COLLECTION_ID = process.env.EXPO_PUBLIC_HABIT_COLLECTION_ID!;
export const HABIT_COMPLETION_COLLECTION_ID =
  process.env.EXPO_PUBLIC_HABIT_COMPLETION_COLLECTION_ID!;

export interface RealTimeResponse {
  events: string[];
  payload: any;
}
