import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { UserService } from "../services/UserService";
import { StorageService } from "../services/StorageService";

export default function ChatListScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadMatches();
    });

    return unsubscribe;
  }, [navigation]);

  const loadMatches = async () => {
    try {
      const userMatches = await UserService.getUserMatches();

      // Add last message info for each match
      const matchesWithMessages = await Promise.all(
        userMatches.map(async (match) => {
          const messages = await StorageService.getMessages(match.id);
          const lastMessage =
            messages.length > 0 ? messages[messages.length - 1] : null;

          return {
            ...match,
            lastMessage,
            unreadCount: messages.filter(
              (msg) => !msg.read && msg.senderId !== match.user.id,
            ).length,
          };
        }),
      );

      // Sort by last message time
      matchesWithMessages.sort((a, b) => {
        const timeA = a.lastMessage
          ? new Date(a.lastMessage.timestamp)
          : new Date(a.timestamp);
        const timeB = b.lastMessage
          ? new Date(b.lastMessage.timestamp)
          : new Date(b.timestamp);
        return timeB - timeA;
      });

      setMatches(matchesWithMessages);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d`;
    }
  };

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage) return "Say hello! 👋";

    switch (lastMessage.type) {
      case "text":
        return lastMessage.content;
      case "image":
        return "📷 Photo";
      case "audio":
        return "🎵 Audio message";
      case "video":
        return "🎥 Video";
      default:
        return "New message";
    }
  };

  const renderMatchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() =>
        navigation.navigate("Chat", {
          user: item.user,
          chatId: item.id,
        })
      }
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              item.user.photos && item.user.photos[0]
                ? item.user.photos[0]
                : "https://via.placeholder.com/60x60",
          }}
          style={styles.avatar}
        />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.messageInfo}>
        <View style={styles.messageHeader}>
          <Text style={styles.userName}>{item.user.firstName}</Text>
          <Text style={styles.messageTime}>
            {formatTime(item.lastMessage?.timestamp || item.timestamp)}
          </Text>
        </View>

        <View style={styles.messagePreview}>
          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {getLastMessagePreview(item.lastMessage)}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 9 ? "9+" : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={80} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>No matches yet</Text>
      <Text style={styles.emptySubtitle}>
        Start swiping to find your perfect match!
      </Text>
      <TouchableOpacity
        style={styles.discoverButton}
        onPress={() => navigation.navigate("Discover")}
      >
        <Text style={styles.discoverButtonText}>Start Discovering</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="search-outline" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={matches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={matches.length === 0 ? styles.emptyList : null}
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  headerButton: {
    padding: 8,
  },
  matchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  messageInfo: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  messageTime: {
    fontSize: 14,
    color: "#666666",
  },
  messagePreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 16,
    color: "#666666",
    flex: 1,
  },
  unreadMessage: {
    color: "#333333",
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: "#FF4458",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  unreadCount: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyList: {
    flex: 1,
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
    marginBottom: 30,
  },
  discoverButton: {
    backgroundColor: "#FF4458",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  discoverButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
