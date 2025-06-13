import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { UserService } from "../services/UserService";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-15deg", "0deg", "15deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const discoverableUsers = await UserService.getDiscoverableUsers();
      setUsers(discoverableUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= users.length) return;

    const currentUser = users[currentIndex];
    const action = direction === "right" ? "like" : "pass";

    try {
      const result = await UserService.swipeUser(currentUser.id, action);

      if (result.match) {
        // Show match popup
        Alert.alert(
          "It's a Match! 💕",
          `You and ${result.user.firstName} liked each other!`,
          [
            { text: "Keep Swiping", style: "cancel" },
            {
              text: "Send Message",
              onPress: () =>
                navigation.navigate("Chat", {
                  user: result.user,
                  chatId: `${result.user.id}_match`,
                }),
            },
          ],
        );
      }

      nextCard();
    } catch (error) {
      console.error("Error swiping user:", error);
      nextCard();
    }
  };

  const nextCard = () => {
    setCurrentIndex(currentIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      position.setOffset({
        x: position.x._value,
        y: position.y._value,
      });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: position.x, dy: position.y }],
      { useNativeDriver: false },
    ),
    onPanResponderRelease: (evt, gestureState) => {
      position.flattenOffset();

      if (gestureState.dx > SWIPE_THRESHOLD) {
        // Swipe right (like)
        Animated.spring(position, {
          toValue: { x: width + 100, y: gestureState.dy },
          useNativeDriver: false,
        }).start(() => handleSwipe("right"));
      } else if (gestureState.dx < -SWIPE_THRESHOLD) {
        // Swipe left (pass)
        Animated.spring(position, {
          toValue: { x: -width - 100, y: gestureState.dy },
          useNativeDriver: false,
        }).start(() => handleSwipe("left"));
      } else {
        // Return to center
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const forceSwipe = (direction) => {
    const x = direction === "right" ? width + 100 : -width - 100;
    Animated.spring(position, {
      toValue: { x, y: 0 },
      useNativeDriver: false,
    }).start(() => handleSwipe(direction));
  };

  const renderCard = (user, index) => {
    if (index < currentIndex) return null;

    if (index === currentIndex) {
      return (
        <Animated.View
          key={user.id}
          style={[
            styles.card,
            {
              transform: [...position.getTranslateTransform(), { rotate }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image
            source={{
              uri: user.photos[0] || "https://via.placeholder.com/400x600",
            }}
            style={styles.cardImage}
          />

          <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
            <Text style={styles.labelText}>LIKE</Text>
          </Animated.View>

          <Animated.View style={[styles.passLabel, { opacity: passOpacity }]}>
            <Text style={styles.labelText}>PASS</Text>
          </Animated.View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>
              {user.firstName}, {user.age}
            </Text>
            {user.occupation && (
              <Text style={styles.cardOccupation}>{user.occupation}</Text>
            )}
            {user.bio && (
              <Text style={styles.cardBio} numberOfLines={2}>
                {user.bio}
              </Text>
            )}
            {user.interests && user.interests.length > 0 && (
              <View style={styles.interests}>
                {user.interests.slice(0, 3).map((interest, idx) => (
                  <View key={idx} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      );
    }

    return (
      <View key={user.id} style={[styles.card, { zIndex: -index }]}>
        <Image
          source={{
            uri: user.photos[0] || "https://via.placeholder.com/400x600",
          }}
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>
            {user.firstName}, {user.age}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Finding potential matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No more profiles</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new people to discover
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadUsers}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Discover</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="options-outline" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        {users.map((user, index) => renderCard(user, index)).reverse()}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => forceSwipe("left")}
        >
          <Ionicons name="close" size={30} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={() => {
            Alert.alert("Super Like!", "Feature coming soon!");
          }}
        >
          <Ionicons name="star" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => forceSwipe("right")}
        >
          <Ionicons name="heart" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
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
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 10,
  },
  refreshButton: {
    backgroundColor: "#FF4458",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 30,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  card: {
    width: width - 40,
    height: height * 0.65,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardInfo: {
    padding: 20,
    flex: 1,
  },
  cardName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  cardOccupation: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 8,
  },
  cardBio: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 10,
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  interestTag: {
    backgroundColor: "#FF4458",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  interestText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  likeLabel: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: "15deg" }],
    zIndex: 1000,
  },
  passLabel: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#F44336",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: "-15deg" }],
    zIndex: 1000,
  },
  labelText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
  },
  actionButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  passButton: {
    backgroundColor: "#E0E0E0",
  },
  superLikeButton: {
    backgroundColor: "#4A90E2",
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  likeButton: {
    backgroundColor: "#FF4458",
  },
});
