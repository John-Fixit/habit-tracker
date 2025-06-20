import { useAuth } from "@/lib/auth-context";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  const { signOut } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.innerView}>
        <Text style={{ padding: 20, lineHeight: 20 }}>
          Mobile App development with React Native Expo kick started Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odit, vero omnis ab
          commodi laudantium consequuntur dignissimos sint, dolor, maiores
          tempore ad sunt nostrum repellendus velit enim? Libero blanditiis quo
          cupiditate?
        </Text>
      </View>
      <Button mode="text" onPress={signOut} icon={"logout"}>
        Log out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  innerView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flexDirection: "column",
  },
  loginLink: {
    width: 100,
    height: 40,
    textAlign: "center",
    fontSize: 20,
    color: "white",
    borderWidth: 1,
    borderColor: "blue",
    backgroundColor: "blue",
    borderRadius: 8,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderStyle: "solid",
    cursor: "pointer",
  },
});
