import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { StorageService } from "../services/StorageService";
import { UserService } from "../services/UserService";
import { LANGUAGES, getTranslation } from "../constants/Languages";

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    language: "en",
    notifications: true,
    ageRange: { min: 18, max: 35 },
    distance: 50,
  });
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await StorageService.getSettings();
      setSettings(userSettings);
      setCurrentLanguage(userSettings.language);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await StorageService.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const handleLanguageChange = (languageCode) => {
    const newSettings = { ...settings, language: languageCode };
    setCurrentLanguage(languageCode);
    saveSettings(newSettings);
    setShowLanguageModal(false);
  };

  const handleNotificationToggle = (value) => {
    const newSettings = { ...settings, notifications: value };
    saveSettings(newSettings);
  };

  const handleAgeRangeChange = (type, value) => {
    const newAgeRange = { ...settings.ageRange, [type]: Math.round(value) };

    // Ensure min is always less than max
    if (type === "min" && newAgeRange.min >= newAgeRange.max) {
      newAgeRange.max = newAgeRange.min + 1;
    }
    if (type === "max" && newAgeRange.max <= newAgeRange.min) {
      newAgeRange.min = newAgeRange.max - 1;
    }

    const newSettings = { ...settings, ageRange: newAgeRange };
    saveSettings(newSettings);
  };

  const handleDistanceChange = (value) => {
    const newSettings = { ...settings, distance: Math.round(value) };
    saveSettings(newSettings);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await UserService.logout();
          // The App component will handle navigation to auth screens
        },
      },
    ]);
  };

  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your data including matches, messages, and profile. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            await StorageService.clearAllData();
            Alert.alert("Success", "All data cleared. Please restart the app.");
          },
        },
      ],
    );
  };

  const renderLanguageOption = ({ item }) => (
    <TouchableOpacity
      style={styles.languageOption}
      onPress={() => handleLanguageChange(item.code)}
    >
      <Text style={styles.languageName}>{item.name}</Text>
      {currentLanguage === item.code && (
        <Ionicons name="checkmark" size={24} color="#FF4458" />
      )}
    </TouchableOpacity>
  );

  const t = (key) => getTranslation(key, currentLanguage);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("settings")}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={24} color="#666666" />
              <Text style={styles.settingText}>{t("editProfile")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="language-outline" size={24} color="#666666" />
              <View>
                <Text style={styles.settingText}>{t("language")}</Text>
                <Text style={styles.settingSubtext}>
                  {LANGUAGES[currentLanguage].name}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#666666"
              />
              <Text style={styles.settingText}>{t("notifications")}</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: "#E0E0E0", true: "#FF4458" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Discovery Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="people-outline" size={24} color="#666666" />
              <View>
                <Text style={styles.settingText}>{t("ageRange")}</Text>
                <Text style={styles.settingSubtext}>
                  {settings.ageRange.min} - {settings.ageRange.max} years
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Min Age: {settings.ageRange.min}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={60}
              value={settings.ageRange.min}
              onValueChange={(value) => handleAgeRangeChange("min", value)}
              minimumTrackTintColor="#FF4458"
              maximumTrackTintColor="#E0E0E0"
              thumbStyle={{ backgroundColor: "#FF4458" }}
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Max Age: {settings.ageRange.max}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={60}
              value={settings.ageRange.max}
              onValueChange={(value) => handleAgeRangeChange("max", value)}
              minimumTrackTintColor="#FF4458"
              maximumTrackTintColor="#E0E0E0"
              thumbStyle={{ backgroundColor: "#FF4458" }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={24} color="#666666" />
              <View>
                <Text style={styles.settingText}>{t("distance")}</Text>
                <Text style={styles.settingSubtext}>
                  Up to {settings.distance} km away
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Distance: {settings.distance} km
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={100}
              value={settings.distance}
              onValueChange={handleDistanceChange}
              minimumTrackTintColor="#FF4458"
              maximumTrackTintColor="#E0E0E0"
              thumbStyle={{ backgroundColor: "#FF4458" }}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingItem} onPress={clearAllData}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={24} color="#F44336" />
              <Text style={[styles.settingText, { color: "#F44336" }]}>
                Clear All Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={24} color="#F44336" />
              <Text style={[styles.settingText, { color: "#F44336" }]}>
                {t("logout")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.appInfo}>
            LoveConnect v1.0.0{"\n"}
            Made with ❤️ using React Native
          </Text>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Language</Text>
            <View style={{ width: 60 }} />
          </View>

          <FlatList
            data={Object.values(LANGUAGES)}
            renderItem={renderLanguageOption}
            keyExtractor={(item) => item.code}
            style={styles.languageList}
          />
        </SafeAreaView>
      </Modal>
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 15,
    fontWeight: "500",
  },
  settingSubtext: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 15,
    marginTop: 2,
  },
  sliderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sliderLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  appInfo: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  modal: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalCancel: {
    fontSize: 16,
    color: "#FF4458",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  languageList: {
    flex: 1,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  languageName: {
    fontSize: 16,
    color: "#333333",
  },
});
