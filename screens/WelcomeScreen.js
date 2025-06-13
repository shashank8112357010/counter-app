import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { UserService } from "../services/UserService";

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    // Initialize mock users when app starts
    UserService.initializeUsers();
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&h=800&fit=crop",
      }}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[
          "rgba(255,68,88,0.8)",
          "rgba(255,68,88,0.6)",
          "rgba(0,0,0,0.4)",
        ]}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="heart" size={60} color="#FFFFFF" />
            <Text style={styles.title}>LoveConnect</Text>
            <Text style={styles.subtitle}>Find your perfect match</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 50,
  },
  header: {
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
    opacity: 0.9,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: "#FF4458",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 16,
  },
});
