import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  const { signIn, signUp } = useAuth();

  const theme = useTheme();

  const router = useRouter();

  const handleSwitchMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleAuth = async () => {
    if ((isSignUp && !email) || !password || !name) {
      setError("Please fill all fields");
      return;
    }
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setError(null);
    if (isSignUp) {
      const error = await signUp(name, email, phone, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
      router.replace("/");
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome back"}
        </Text>
        {isSignUp && (
          <TextInput
            placeholder="Enter your Name"
            keyboardType="default"
            label="Name"
            mode="outlined"
            style={styles.input}
            onChangeText={setName}
          />
        )}
        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
          label="Email"
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
        />
        {/* <TextInput
          placeholder="Enter Phone Number"
          keyboardType="number-pad"
          label="Phone Number"
          mode="outlined"
          style={styles.input}
          onChangeText={setPhone}
        /> */}
        <TextInput
          placeholder="Enter password"
          secureTextEntry
          label="Password"
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          onChangeText={setPassword}
        />
        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
        <Button style={styles.button} mode="contained" onPress={handleAuth}>
          {isSignUp ? "Sign up" : "Sign in"}
        </Button>
        <Button
          mode="text"
          onPress={handleSwitchMode}
          style={styles.switchModeButton}
        >
          {isSignUp
            ? "Already Have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
    cursor: "pointer",
  },
});
