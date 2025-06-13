import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StorageService } from "../services/StorageService";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUserProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserProfile = async () => {
    try {
      const currentUser = await StorageService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons name="create-outline" size={24} color="#FF4458" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.photoSection}>
          <View style={styles.mainPhotoContainer}>
            <Image
              source={{
                uri:
                  user.photos && user.photos[0]
                    ? user.photos[0]
                    : "https://via.placeholder.com/300x400",
              }}
              style={styles.mainPhoto}
            />
            <TouchableOpacity style={styles.addPhotoButton}>
              <Ionicons name="camera" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {user.photos && user.photos.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoGallery}
            >
              {user.photos.slice(1).map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={styles.galleryPhoto}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userAge}>{user.age} years old</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="briefcase-outline" size={20} color="#666666" />
            <Text style={styles.infoText}>
              {user.occupation || "Not specified"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={20} color="#666666" />
            <Text style={styles.infoText}>
              {user.location || "Not specified"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color="#666666" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
        </View>

        {user.bio && (
          <View style={styles.bioSection}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        {user.interests && user.interests.length > 0 && (
          <View style={styles.interestsSection}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Profile Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Profile Views</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="create-outline" size={24} color="#FF4458" />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-outline" size={24} color="#FF4458" />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  editButton: {
    padding: 8,
  },
  photoSection: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },
  mainPhotoContainer: {
    position: "relative",
    alignItems: "center",
    paddingTop: 20,
  },
  mainPhoto: {
    width: width * 0.6,
    height: width * 0.8,
    borderRadius: 20,
  },
  addPhotoButton: {
    position: "absolute",
    bottom: 10,
    right: width * 0.2 - 20,
    backgroundColor: "#FF4458",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  photoGallery: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  galleryPhoto: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoHeader: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  userAge: {
    fontSize: 18,
    color: "#666666",
    marginTop: 5,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 15,
  },
  bioSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
  },
  bioText: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
  },
  interestsSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  interestTag: {
    backgroundColor: "#FF4458",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  interestText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  statsSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4458",
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E0",
  },
  actionsSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  actionButtonText: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 15,
    fontWeight: "500",
  },
});
