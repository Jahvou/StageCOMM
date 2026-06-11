import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export default function ScheduleScreen() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [activeSchedule, setActiveSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create schedule modal
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [scheduleName, setScheduleName] = useState('');

  // Add item modal
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemTime, setItemTime] = useState('');
  const [itemNotes, setItemNotes] = useState('');

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const res = await api.get('/api/schedule');
      setSchedules(res.data);
      if (res.data.length > 0) setActiveSchedule(res.data[0]);
    } catch (err) {
      console.log('Failed to load schedules:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async () => {
    if (!scheduleName.trim()) return;
    try {
      const res = await api.post('/api/schedule', { name: scheduleName, items: [] });
      setSchedules((prev) => [res.data, ...prev]);
      setActiveSchedule(res.data);
      setScheduleName('');
      setCreateModalVisible(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const deleteSchedule = async (id) => {
    Alert.alert('Delete Schedule', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/schedule/${id}`);
            const updated = schedules.filter((s) => s._id !== id);
            setSchedules(updated);
            setActiveSchedule(updated.length > 0 ? updated[0] : null);
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const openAddItem = () => {
    setEditingItem(null);
    setItemTitle('');
    setItemTime('');
    setItemNotes('');
    setItemModalVisible(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setItemTitle(item.title);
    setItemTime(item.time);
    setItemNotes(item.notes);
    setItemModalVisible(true);
  };

  const saveItem = async () => {
    if (!itemTitle.trim() || !itemTime.trim()) return;
    try {
      let updatedItems;
      if (editingItem) {
        updatedItems = activeSchedule.items.map((i) =>
          i._id === editingItem._id
            ? { ...i, title: itemTitle, time: itemTime, notes: itemNotes }
            : i
        );
      } else {
        updatedItems = [
          ...activeSchedule.items,
          { title: itemTitle, time: itemTime, notes: itemNotes },
        ];
      }
      const res = await api.put(`/api/schedule/${activeSchedule._id}`, {
        items: updatedItems,
      });
      setActiveSchedule(res.data);
      setSchedules((prev) =>
        prev.map((s) => (s._id === res.data._id ? res.data : s))
      );
      setItemModalVisible(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const updatedItems = activeSchedule.items.filter((i) => i._id !== itemId);
      const res = await api.put(`/api/schedule/${activeSchedule._id}`, {
        items: updatedItems,
      });
      setActiveSchedule(res.data);
      setSchedules((prev) =>
        prev.map((s) => (s._id === res.data._id ? res.data : s))
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <View style={styles.headerRight}>
          {activeSchedule && (
            <TouchableOpacity onPress={openAddItem}>
              <Ionicons name="add-circle-outline" size={28} color="#4f46e5" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
            <Ionicons name="calendar-outline" size={26} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Schedule tabs */}
      {schedules.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}
        >
          {schedules.map((s) => (
            <TouchableOpacity
              key={s._id}
              style={[styles.tab, activeSchedule?._id === s._id && styles.tabActive]}
              onPress={() => setActiveSchedule(s)}
              onLongPress={() => deleteSchedule(s._id)}
            >
              <Text style={[styles.tabText, activeSchedule?._id === s._id && styles.tabTextActive]}>
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Schedule items */}
      {loading ? (
        <ActivityIndicator color="#4f46e5" style={{ marginTop: 40 }} />
      ) : !activeSchedule ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={48} color="#333" />
          <Text style={styles.emptyText}>No schedules yet</Text>
          <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.emptyLink}>Create one</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {activeSchedule.items.length === 0 ? (
            <Text style={styles.emptyText}>No items yet — tap + to add</Text>
          ) : (
            activeSchedule.items.map((item, index) => (
              <View key={item._id} style={styles.row}>
                <View style={styles.timeCol}>
                  <Text style={styles.time}>{item.time}</Text>
                  {index < activeSchedule.items.length - 1 && <View style={styles.line} />}
                </View>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => openEditItem(item)}
                  onLongPress={() => deleteItem(item._id)}
                >
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.notes ? <Text style={styles.cardNotes}>{item.notes}</Text> : null}
                  <Text style={styles.editHint}>Tap to edit · Hold to delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Create Schedule Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>New Schedule</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Schedule name (e.g. Show Night)"
                  placeholderTextColor="#888"
                  value={scheduleName}
                  onChangeText={setScheduleName}
                />
                <TouchableOpacity style={styles.addButton} onPress={createSchedule}>
                  <Text style={styles.addButtonText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add/Edit Item Modal */}
      <Modal visible={itemModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>
                  {editingItem ? 'Edit Item' : 'Add Item'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title (e.g. Sound Check)"
                  placeholderTextColor="#888"
                  value={itemTitle}
                  onChangeText={setItemTitle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Time (e.g. 4:00 PM)"
                  placeholderTextColor="#888"
                  value={itemTime}
                  onChangeText={setItemTime}
                />
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Notes (optional)"
                  placeholderTextColor="#888"
                  value={itemNotes}
                  onChangeText={setItemNotes}
                  multiline
                />
                <TouchableOpacity style={styles.addButton} onPress={saveItem}>
                  <Text style={styles.addButtonText}>
                    {editingItem ? 'Save Changes' : 'Add'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setItemModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tabBar: { maxHeight: 48, borderBottomWidth: 1, borderBottomColor: '#333' },
  tabBarContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e1e2e',
  },
  tabActive: { backgroundColor: '#4f46e5' },
  tabText: { color: '#888', fontSize: 14 },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  scroll: { padding: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { color: '#888', fontSize: 15, textAlign: 'center', marginTop: 20 },
  emptyLink: { color: '#4f46e5', fontSize: 15 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 0 },
  timeCol: { width: 70, alignItems: 'center' },
  time: { color: '#4f46e5', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  line: { width: 2, flex: 1, backgroundColor: '#333', marginTop: 8 },
  card: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cardNotes: { color: '#888', fontSize: 13, marginTop: 4 },
  editHint: { color: '#444', fontSize: 11, marginTop: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#1e1e2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0f0f1a',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  addButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelText: { color: '#888', textAlign: 'center', fontSize: 15 },
});