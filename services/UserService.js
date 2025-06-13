import { StorageService } from "./StorageService";
import { mockUsers } from "../utils/MockData";

export class UserService {
  static async initializeUsers() {
    try {
      const existingUsers = await StorageService.getAllUsers();
      if (existingUsers.length === 0) {
        // Initialize with mock data
        for (const user of mockUsers) {
          await StorageService.saveUser(user);
        }
      }
    } catch (error) {
      console.error("Error initializing users:", error);
    }
  }

  static async registerUser(userData) {
    try {
      const users = await StorageService.getAllUsers();

      // Check if email already exists
      const existingUser = users.find((user) => user.email === userData.email);
      if (existingUser) {
        throw new Error("Email already registered");
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        isOnline: true,
        lastSeen: new Date().toISOString(),
      };

      await StorageService.saveUser(newUser);
      await StorageService.setCurrentUser(newUser);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  static async loginUser(email, password) {
    try {
      const users = await StorageService.getAllUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Update user status
      user.isOnline = true;
      user.lastSeen = new Date().toISOString();
      await StorageService.saveUser(user);
      await StorageService.setCurrentUser(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userData) {
    try {
      const currentUser = await StorageService.getCurrentUser();
      if (!currentUser) {
        throw new Error("No current user found");
      }

      const updatedUser = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      await StorageService.saveUser(updatedUser);
      await StorageService.setCurrentUser(updatedUser);

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  static async getDiscoverableUsers() {
    try {
      const currentUser = await StorageService.getCurrentUser();
      const allUsers = await StorageService.getAllUsers();
      const swipedUsers = await StorageService.getSwipedUsers();

      if (!currentUser) return [];

      // Filter out current user and already swiped users
      const discoverableUsers = allUsers.filter((user) => {
        return (
          user.id !== currentUser.id &&
          !swipedUsers.liked.includes(user.id) &&
          !swipedUsers.passed.includes(user.id)
        );
      });

      return discoverableUsers;
    } catch (error) {
      console.error("Error getting discoverable users:", error);
      return [];
    }
  }

  static async swipeUser(userId, action) {
    try {
      const currentUser = await StorageService.getCurrentUser();
      if (!currentUser) return false;

      await StorageService.addSwipedUser(userId, action);

      // Check for match if it's a like
      if (action === "like") {
        const swipedUsers = await StorageService.getSwipedUsers();
        const allUsers = await StorageService.getAllUsers();
        const targetUser = allUsers.find((u) => u.id === userId);

        // Simple match logic - for demo purposes, create random matches
        const isMatch = Math.random() > 0.7; // 30% chance of match

        if (isMatch && targetUser) {
          await StorageService.addMatch(currentUser.id, userId);

          // Create initial chat
          const chat = {
            id: `${currentUser.id}_${userId}`,
            participants: [currentUser.id, userId],
            lastMessage: null,
            lastMessageTime: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };

          await StorageService.saveChat(chat);
          return { match: true, user: targetUser };
        }
      }

      return { match: false };
    } catch (error) {
      console.error("Error swiping user:", error);
      return { match: false };
    }
  }

  static async getUserMatches() {
    try {
      const currentUser = await StorageService.getCurrentUser();
      if (!currentUser) return [];

      const matches = await StorageService.getMatches();
      const allUsers = await StorageService.getAllUsers();

      const userMatches = matches
        .filter((match) => match.users.includes(currentUser.id))
        .map((match) => {
          const otherUserId = match.users.find((id) => id !== currentUser.id);
          const otherUser = allUsers.find((u) => u.id === otherUserId);
          return {
            ...match,
            user: otherUser,
          };
        })
        .filter((match) => match.user); // Filter out matches where user wasn't found

      return userMatches;
    } catch (error) {
      console.error("Error getting user matches:", error);
      return [];
    }
  }

  static async logout() {
    try {
      const currentUser = await StorageService.getCurrentUser();
      if (currentUser) {
        // Update user status
        currentUser.isOnline = false;
        currentUser.lastSeen = new Date().toISOString();
        await StorageService.saveUser(currentUser);
      }

      await StorageService.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
}
