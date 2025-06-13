import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActionSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import { StorageService } from "../services/StorageService";
import { generateMockMessage } from "../utils/MockData";

const { width } = Dimensions.get("window");

export default function ChatScreen({ route, navigation }) {
  const { user, chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    loadMessages();
    getCurrentUser();

    // Add some mock messages for demo
    setTimeout(() => {
      addMockMessages();
    }, 1000);
  }, []);

  const getCurrentUser = async () => {
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);
  };

  const loadMessages = async () => {
    try {
      const chatMessages = await StorageService.getMessages(chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const addMockMessages = async () => {
    // Add some demo messages
    const mockMessages = [
      generateMockMessage(user.id, currentUser?.id, "text"),
      generateMockMessage(currentUser?.id, user.id, "text"),
      generateMockMessage(user.id, currentUser?.id, "image"),
    ];

    for (const msg of mockMessages) {
      await StorageService.saveMessage(chatId, msg);
    }

    loadMessages();
  };

  const sendMessage = async (content, type = "text") => {
    if (!content.trim() && type === "text") return;
    if (!currentUser) return;

    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: user.id,
      type,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    try {
      await StorageService.saveMessage(chatId, message);
      setMessages((prev) => [...prev, message]);
      setInputText("");

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd();
      }, 100);

      // Simulate response after a delay
      setTimeout(() => {
        sendAutoReply();
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendAutoReply = async () => {
    const replyMessage = generateMockMessage(user.id, currentUser.id, "text");
    try {
      await StorageService.saveMessage(chatId, replyMessage);
      setMessages((prev) => [...prev, replyMessage]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd();
      }, 100);
    } catch (error) {
      console.error("Error sending auto reply:", error);
    }
  };

  const showMediaOptions = () => {
    const options = ["Camera", "Photo Library", "Cancel"];
    const cancelButtonIndex = 2;

    Alert.alert("Send Media", "Choose an option", [
      { text: "Camera", onPress: () => openCamera() },
      { text: "Photo Library", onPress: () => openImagePicker() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant camera permissions.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const type = result.assets[0].type?.startsWith("video")
          ? "video"
          : "image";
        sendMessage(result.assets[0].uri, type);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access camera");
    }
  };

  const openImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant media library permissions.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const type = result.assets[0].type?.startsWith("video")
          ? "video"
          : "image";
        sendMessage(result.assets[0].uri, type);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick media");
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant microphone permissions.",
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        sendMessage(uri, "audio");
      }

      setRecording(null);
    } catch (error) {
      Alert.alert("Error", "Failed to stop recording");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUser?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.sentBubble : styles.receivedBubble,
          ]}
        >
          {item.type === "text" && (
            <Text
              style={[
                styles.messageText,
                isCurrentUser ? styles.sentText : styles.receivedText,
              ]}
            >
              {item.content}
            </Text>
          )}

          {item.type === "image" && (
            <View>
              <Image
                source={{ uri: item.content }}
                style={styles.messageImage}
              />
              {item.caption && (
                <Text
                  style={[
                    styles.messageText,
                    isCurrentUser ? styles.sentText : styles.receivedText,
                  ]}
                >
                  {item.caption}
                </Text>
              )}
            </View>
          )}

          {item.type === "audio" && (
            <View style={styles.audioMessage}>
              <Ionicons
                name="play-circle"
                size={30}
                color={isCurrentUser ? "#FFFFFF" : "#FF4458"}
              />
              <Text
                style={[
                  styles.audioText,
                  isCurrentUser ? styles.sentText : styles.receivedText,
                ]}
              >
                Audio message ({item.duration || 30}s)
              </Text>
            </View>
          )}

          {item.type === "video" && (
            <View>
              <View style={styles.videoMessage}>
                <Image
                  source={{ uri: item.thumbnail || item.content }}
                  style={styles.messageImage}
                />
                <View style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#FFFFFF" />
                </View>
              </View>
              <Text
                style={[
                  styles.videoText,
                  isCurrentUser ? styles.sentText : styles.receivedText,
                ]}
              >
                Video ({item.duration || 15}s)
              </Text>
            </View>
          )}

          <Text
            style={[
              styles.messageTime,
              isCurrentUser ? styles.sentTime : styles.receivedTime,
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image
            source={{
              uri:
                user.photos && user.photos[0]
                  ? user.photos[0]
                  : "https://via.placeholder.com/40x40",
            }}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>{user.firstName}</Text>
            <Text style={styles.headerStatus}>
              {user.isOnline
                ? "Online"
                : `Last seen ${formatTime(user.lastSeen)}`}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="call-outline" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={showMediaOptions}
            >
              <Ionicons name="add" size={24} color="#666666" />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              multiline
              maxLength={1000}
            />

            {inputText.trim() ? (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => sendMessage(inputText)}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  isRecording && styles.recordingButton,
                ]}
                onPressIn={startRecording}
                onPressOut={stopRecording}
              >
                <Ionicons
                  name={isRecording ? "stop" : "mic"}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  headerStatus: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  headerButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: width * 0.8,
  },
  sentMessage: {
    alignSelf: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sentBubble: {
    backgroundColor: "#FF4458",
    borderBottomRightRadius: 6,
  },
  receivedBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: "#FFFFFF",
  },
  receivedText: {
    color: "#333333",
  },
  messageTime: {
    fontSize: 12,
    marginTop: 5,
  },
  sentTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  receivedTime: {
    color: "#999999",
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 5,
  },
  audioMessage: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  audioText: {
    marginLeft: 10,
    fontSize: 14,
  },
  videoMessage: {
    position: "relative",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoText: {
    fontSize: 12,
    marginTop: 5,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  mediaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: "#F8F8F8",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF4458",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  recordingButton: {
    backgroundColor: "#F44336",
  },
});
