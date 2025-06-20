import { DATABASE_ID, databases, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const FREQUENCY = ["daily", "weekly", "monthly"];

type FrequencyType = (typeof FREQUENCY)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<FrequencyType>("daily");
  const [error, setError] = useState<string>("");

  const { user } = useAuth();

  const router = useRouter();

  const theme = useTheme();

  const handleSubmit = async () => {
    try {
      if (!user) return;

      await databases.createDocument(
        DATABASE_ID,
        HABIT_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );
      setDescription("");
      setTitle("");
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while adding habit");
      }
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        label={"Title"}
        mode="outlined"
        style={styles.input}
        onChangeText={setTitle}
      />
      <TextInput
        label={"Description"}
        mode="outlined"
        style={styles.input}
        onChangeText={setDescription}
      />
      <View style={styles.frequency_container}>
        <SegmentedButtons
          value={"daily"}
          onValueChange={(value) => setFrequency(value)}
          buttons={FREQUENCY.map((freq) => ({
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
            value: freq,
          }))}
        />
      </View>

      <Button
        mode="contained"
        disabled={!title || !description}
        onPress={handleSubmit}
      >
        Add Habit
      </Button>
      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
  },
  frequency_container: {
    marginBottom: 24,
  },
});
