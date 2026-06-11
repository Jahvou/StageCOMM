import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useAlerts } from "../hooks/useAlerts";
import { Ionicons } from "@expo/vector-icons";
import AlertButton from "../components/AlertButton";

const DEFAULT_LAYOUT = [
  {
    name: "Mics",
    buttons: [
      { label: "Mic 1", actions: ["Feedback", "Volume Up", "Volume Down"] },
      { label: "Mic 2", actions: ["Feedback", "Volume Up", "Volume Down"] },
      { label: "Mic 3", actions: ["Feedback", "Volume Up", "Volume Down"] },
      { label: "Mic 4", actions: ["Feedback", "Volume Up", "Volume Down"] },
    ],
  },
  {
    name: "IEMs",
    buttons: [
      { label: "IEM 1", actions: ["Too Loud", "Too Quiet", "No Signal"] },
      { label: "IEM 2", actions: ["Too Loud", "Too Quiet", "No Signal"] },
      { label: "IEM 3", actions: ["Too Loud", "Too Quiet", "No Signal"] },
    ],
  },
  {
    name: "Monitors",
    buttons: [
      { label: "Mon 1", actions: ["Too Loud", "Too Quiet", "No Signal"] },
      { label: "Mon 2", actions: ["Too Loud", "Too Quiet", "No Signal"] },
    ],
  },
];

export default function ProductionScreen() {
  const { user, logout } = useAuth();
  const { activeAlerts, connected, sendAlert, clearAlert } = useAlerts(user);
  const [selectedButton, setSelectedButton] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isAlertActive = (section, button) => {
    return activeAlerts.some(
      (a) =>
        a.section === section && a.button === button && a.status === "active",
    );
  };

  const getAlert = (section, button) => {
    return activeAlerts.find(
      (a) =>
        a.section === section && a.button === button && a.status === "active",
    );
  };

  const handleButtonPress = (section, button) => {
    const alert = getAlert(section.name, button.label);
    if (alert) {
      clearAlert(alert._id);
      return;
    }
    setSelectedButton({ section, button });
    setModalVisible(true);
  };

  const handleActionPress = (action) => {
    sendAlert(selectedButton.section.name, selectedButton.button.label, action);
    setModalVisible(false);
    setSelectedButton(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Production</Text>
        <View style={styles.headerRight}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: connected ? "#22c55e" : "#ef4444" },
            ]}
          />
          <TouchableOpacity onPress={logout}>
            <Ionicons name="person-circle-outline" size={28} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {DEFAULT_LAYOUT.map((section) => (
          <View key={section.name} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.name}</Text>
            <View style={styles.buttonGrid}>
              {section.buttons.map((button) => {
                const active = isAlertActive(section.name, button.label);
                return (
                  <AlertButton
                    key={button.label}
                    label={button.label}
                    action={getAlert(section.name, button.label)?.action}
                    active={active}
                    onPress={() => handleButtonPress(section, button)}
                  />
                );
              })}
            </View>
          </View>
        ))}

        {/* Active Alerts List */}
        {activeAlerts.length > 0 && (
          <View style={styles.alertsList}>
            <Text style={styles.sectionTitle}>Active Alerts</Text>
            {activeAlerts.map((alert) => (
              <View key={alert._id} style={styles.alertItem}>
                <Text style={styles.alertItemText}>
                  {alert.section} — {alert.button} — {alert.action}
                </Text>
                <TouchableOpacity onPress={() => clearAlert(alert._id)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {selectedButton?.button.label}
            </Text>
            <Text style={styles.modalSubtitle}>Select an issue</Text>
            {selectedButton?.button.actions.map((action) => (
              <TouchableOpacity
                key={action}
                style={styles.actionButton}
                onPress={() => handleActionPress(action)}
              >
                <Text style={styles.actionButtonText}>{action}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  scroll: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  alertButton: {
    width: "47%",
    backgroundColor: "#1e1e2e",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  alertButtonActive: {
    backgroundColor: "#3b0000",
    borderColor: "#ef4444",
  },
  alertButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  alertButtonTextActive: {
    color: "#ef4444",
  },
  alertAction: {
    color: "#ef4444",
    fontSize: 11,
    marginTop: 4,
  },
  alertsList: { marginTop: 8, marginBottom: 24 },
  alertItem: {
    backgroundColor: "#1e1e2e",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  alertItemText: { color: "#fff", fontSize: 14, flex: 1 },
  clearText: { color: "#22c55e", fontWeight: "bold", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#1e1e2e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },

  actionButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cancelButton: { padding: 16, alignItems: "center" },
  cancelText: { color: "#888", fontSize: 16 },
});
