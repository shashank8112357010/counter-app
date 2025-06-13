import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageService {
  static KEYS = {
    CURRENT_USER: "currentUser",
    USERS: "users",
    MATCHES: "matches",
    CHATS: "chats",
    MESSAGES: "messages",
    SETTINGS: "settings",
    SWIPED_USERS: "swipedUsers",
  };

  // User Management
  static async getCurrentUser() {
    try {
      const user = await AsyncStorage.getItem(this.KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static async setCurrentUser(user) {
    try {
      await AsyncStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting current user:", error);
    }
  }

  static async logout() {
    try {
      await AsyncStorage.removeItem(this.KEYS.CURRENT_USER);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  // Users Database
  static async getAllUsers() {
    try {
      const users = await AsyncStorage.getItem(this.KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }

  static async saveUser(user) {
    try {
      const users = await this.getAllUsers();
      const existingIndex = users.findIndex((u) => u.id === user.id);

      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }

      await AsyncStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }

  // Matches Management
  static async getMatches() {
    try {
      const matches = await AsyncStorage.getItem(this.KEYS.MATCHES);
      return matches ? JSON.parse(matches) : [];
    } catch (error) {
      console.error("Error getting matches:", error);
      return [];
    }
  }

  static async addMatch(userId1, userId2) {
    try {
      const matches = await this.getMatches();
      const match = {
        id: Date.now().toString(),
        users: [userId1, userId2],
        timestamp: new Date().toISOString(),
      };
      matches.push(match);
      await AsyncStorage.setItem(this.KEYS.MATCHES, JSON.stringify(matches));
      return match;
    } catch (error) {
      console.error("Error adding match:", error);
    }
  }

  // Chat Management
  static async getChats() {
    try {
      const chats = await AsyncStorage.getItem(this.KEYS.CHATS);
      return chats ? JSON.parse(chats) : [];
    } catch (error) {
      console.error("Error getting chats:", error);
      return [];
    }
  }

  static async saveChat(chat) {
    try {
      const chats = await this.getChats();
      const existingIndex = chats.findIndex((c) => c.id === chat.id);

      if (existingIndex >= 0) {
        chats[existingIndex] = chat;
      } else {
        chats.push(chat);
      }

      await AsyncStorage.setItem(this.KEYS.CHATS, JSON.stringify(chats));
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  }

  // Messages Management
  static async getMessages(chatId) {
    try {
      const allMessages = await AsyncStorage.getItem(this.KEYS.MESSAGES);
      const messages = allMessages ? JSON.parse(allMessages) : {};
      return messages[chatId] || [];
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  }

  static async saveMessage(chatId, message) {
    try {
      const allMessages = await AsyncStorage.getItem(this.KEYS.MESSAGES);
      const messages = allMessages ? JSON.parse(allMessages) : {};

      if (!messages[chatId]) {
        messages[chatId] = [];
      }

      messages[chatId].push(message);
      await AsyncStorage.setItem(this.KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }

  // Swiped Users Management
  static async getSwipedUsers() {
    try {
      const swiped = await AsyncStorage.getItem(this.KEYS.SWIPED_USERS);
      return swiped ? JSON.parse(swiped) : { liked: [], passed: [] };
    } catch (error) {
      console.error("Error getting swiped users:", error);
      return { liked: [], passed: [] };
    }
  }

  static async addSwipedUser(userId, action) {
    try {
      const swiped = await this.getSwipedUsers();
      if (action === "like") {
        swiped.liked.push(userId);
      } else {
        swiped.passed.push(userId);
      }
      await AsyncStorage.setItem(
        this.KEYS.SWIPED_USERS,
        JSON.stringify(swiped),
      );
    } catch (error) {
      console.error("Error adding swiped user:", error);
    }
  }

  // Settings Management
  static async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(this.KEYS.SETTINGS);
      return settings
        ? JSON.parse(settings)
        : {
            language: "en",
            notifications: true,
            ageRange: { min: 18, max: 35 },
            distance: 50,
          };
    } catch (error) {
      console.error("Error getting settings:", error);
      return {
        language: "en",
        notifications: true,
        ageRange: { min: 18, max: 35 },
        distance: 50,
      };
    }
  }

  static async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }

  // Clear all data (for testing)
  static async clearAllData() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }
}
