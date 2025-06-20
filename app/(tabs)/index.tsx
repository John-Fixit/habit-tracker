import {
  client,
  DATABASE_ID,
  databases,
  HABIT_COLLECTION_ID,
  HABIT_COMPLETION_COLLECTION_ID,
  RealTimeResponse,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { HabitType } from "@/types/database.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const { signOut, user } = useAuth();

  const [habits, setHabits] = useState<HabitType[]>([]);

  const swipableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  useEffect(() => {
    if (user) {
      const channel = `databases.${DATABASE_ID}.collections.${HABIT_COLLECTION_ID}.documents`;
      const habitSubscription = client.subscribe(
        channel,
        (response: RealTimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchHabit();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabit();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabit();
          }
        }
      );

      fetchHabit();

      return () => {
        habitSubscription();
      };
    }
  }, [user]);

  const fetchHabit = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABIT_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setHabits(response.documents as HabitType[]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteHabit = async (habitID: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABIT_COLLECTION_ID, habitID);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteHabit = async (habitID: string) => {
    if (!user) return;
    try {
      const currentDate = new Date().toISOString();
      await databases.createDocument(
        DATABASE_ID,
        HABIT_COMPLETION_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user?.$id,
          habit_id: habitID,
          completed_at: currentDate,
        }
      );

      const habit = habits.find((habit) => habit.$id === habitID);

      if (!habit) return;

      await databases.updateDocument(
        DATABASE_ID,
        HABIT_COLLECTION_ID,
        habitID,
        {
          streak_count: habit.streak_count + 1,
          last_completed: currentDate,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const renderLeftActions = () => (
    <View style={styles.swipeLeftAction}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color={"#fff"}
      />
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.swipeRightAction}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color={"#fff"}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Today&apos;s Habit
        </Text>

        <Button mode="text" onPress={signOut} icon={"logout"}>
          Log out
        </Button>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No Habits yet, Add your first Habit
            </Text>
          </View>
        ) : (
          habits.map((habit, index) => {
            return (
              <Swipeable
                key={index}
                ref={(ref) => {
                  swipableRefs.current[habit.$id] = ref;
                }}
                overshootLeft={false}
                overshootRight={false}
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
                onSwipeableOpen={(direction) => {
                  if (direction === "left") {
                    handleDeleteHabit(habit.$id);
                  } else if (direction === "right") {
                    handleCompleteHabit(habit.$id);
                  }

                  swipableRefs.current[habit.$id]?.close();
                }}
              >
                <Surface style={styles.card}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{habit.title}</Text>
                    <Text style={styles.cardDescription}>
                      {habit.description}
                    </Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.streakBadge}>
                        <MaterialCommunityIcons
                          name="fire"
                          size={18}
                          color={"#ff9800"}
                        />
                        <Text style={styles.streakText}>
                          {habit.streak_count} day streak
                        </Text>
                      </View>
                      <View style={styles.frequencyBadge}>
                        <Text style={styles.frequencyText}>
                          {habit.frequency}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Surface>
              </Swipeable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "capitalize",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666666",
  },
  swipeRightAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
    backgroundColor: "#4caf50",
  },
  swipeLeftAction: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#ef3935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
});
