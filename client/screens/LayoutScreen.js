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

const ADMIN_ROLES = ['director', 'admin', 'stage_manager', 'technician', 'performer'];

const DEFAULT_LAYOUT_OPTION = {
  _id: 'default',
  name: 'Default',
  isActive: false,
  sections: [
    {
      name: 'Mics',
      buttons: [
        { label: 'Mic 1', actions: [{ label: 'Feedback' }, { label: 'Volume Up' }, { label: 'Volume Down' }] },
        { label: 'Mic 2', actions: [{ label: 'Feedback' }, { label: 'Volume Up' }, { label: 'Volume Down' }] },
        { label: 'Mic 3', actions: [{ label: 'Feedback' }, { label: 'Volume Up' }, { label: 'Volume Down' }] },
        { label: 'Mic 4', actions: [{ label: 'Feedback' }, { label: 'Volume Up' }, { label: 'Volume Down' }] },
      ],
    },
    {
      name: 'IEMs',
      buttons: [
        { label: 'IEM 1', actions: [{ label: 'Too Loud' }, { label: 'Too Quiet' }, { label: 'No Signal' }] },
        { label: 'IEM 2', actions: [{ label: 'Too Loud' }, { label: 'Too Quiet' }, { label: 'No Signal' }] },
        { label: 'IEM 3', actions: [{ label: 'Too Loud' }, { label: 'Too Quiet' }, { label: 'No Signal' }] },
      ],
    },
    {
      name: 'Monitors',
      buttons: [
        { label: 'Mon 1', actions: [{ label: 'Too Loud' }, { label: 'Too Quiet' }, { label: 'No Signal' }] },
        { label: 'Mon 2', actions: [{ label: 'Too Loud' }, { label: 'Too Quiet' }, { label: 'No Signal' }] },
      ],
    },
  ],
};

export default function LayoutScreen({ navigation }) {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.includes(user?.role);

  const [layouts, setLayouts] = useState([]);
  const [activeLayout, setActiveLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [layoutName, setLayoutName] = useState('');

  const [sectionModalVisible, setSectionModalVisible] = useState(false);
  const [sectionName, setSectionName] = useState('');

  const [buttonModalVisible, setButtonModalVisible] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);
  const [editingButtonIndex, setEditingButtonIndex] = useState(null);
  const [buttonLabel, setButtonLabel] = useState('');
  const [buttonActions, setButtonActions] = useState(['', '', '']);

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
  try {
    const res = await api.get('/api/layouts');
    const allLayouts = [DEFAULT_LAYOUT_OPTION, ...res.data];
    setLayouts(allLayouts);
    const active = allLayouts.find((l) => l.isActive) || DEFAULT_LAYOUT_OPTION;
    setActiveLayout(active);
  } catch (err) {
    console.log('Failed to load layouts:', err.message);
    setLayouts([DEFAULT_LAYOUT_OPTION]);
    setActiveLayout(DEFAULT_LAYOUT_OPTION);
  } finally {
    setLoading(false);
  }
};

  const createLayout = async () => {
    if (!layoutName.trim()) return;
    console.log('create layout error:', err.message, err.response?.status, err.response?.data, err.config?.url, err.config?.headers);
    try {
      const res = await api.post('/api/layouts', { name: layoutName, sections: [] });
      setLayouts((prev) => [DEFAULT_LAYOUT_OPTION, res.data, ...prev.filter((l) => l._id !== 'default')]);
      setActiveLayout(res.data);
      setLayoutName('');
      setCreateModalVisible(false);
    } catch (err) {
      console.log('create layout error:', err.message, err.response?.data);
      Alert.alert('Error', err.message);
    }
  };

  const deleteLayout = (id) => {
    if (id === 'default') return;
    Alert.alert('Delete Layout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/layouts/${id}`);
            const updated = layouts.filter((l) => l._id !== id);
            setLayouts(updated);
            setActiveLayout(updated.length > 0 ? updated[0] : DEFAULT_LAYOUT_OPTION);
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const launchLayout = async (layoutId) => {
    try {
      for (const l of layouts) {
        if (l._id !== 'default' && l.isActive) {
          await api.put(`/api/layouts/${l._id}`, { isActive: false });
        }
      }
      if (layoutId !== 'default') {
        await api.put(`/api/layouts/${layoutId}`, { isActive: true });
      }
      setLayouts((prev) =>
        prev.map((l) => ({ ...l, isActive: l._id === layoutId }))
      );
      navigation.navigate('Production');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const setAsActive = async (layoutId) => {
    if (layoutId === 'default') return;
    try {
      for (const layout of layouts) {
        if (layout._id !== 'default' && layout.isActive) {
          await api.put(`/api/layouts/${layout._id}`, { isActive: false });
        }
      }
      await api.put(`/api/layouts/${layoutId}`, { isActive: true });
      setLayouts((prev) =>
        prev.map((l) => ({ ...l, isActive: l._id === layoutId }))
      );
      setActiveLayout({ ...activeLayout, isActive: true });
      Alert.alert('Success', 'Layout set as active');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const addSection = async () => {
    if (!sectionName.trim() || !activeLayout) return;
    if (activeLayout._id === 'default') return;
    try {
      const updatedSections = [
        ...activeLayout.sections,
        { name: sectionName, useWheel: false, buttons: [] },
      ];
      const res = await api.put(`/api/layouts/${activeLayout._id}`, {
        sections: updatedSections,
      });
      setActiveLayout(res.data);
      setLayouts((prev) => prev.map((l) => (l._id === res.data._id ? res.data : l)));
      setSectionName('');
      setSectionModalVisible(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const deleteSection = (sectionIndex) => {
    if (activeLayout._id === 'default') return;
    Alert.alert('Delete Section', 'This will remove the section and all its buttons.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedSections = activeLayout.sections.filter((_, i) => i !== sectionIndex);
            const res = await api.put(`/api/layouts/${activeLayout._id}`, {
              sections: updatedSections,
            });
            setActiveLayout(res.data);
            setLayouts((prev) => prev.map((l) => (l._id === res.data._id ? res.data : l)));
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const openAddButton = (sectionIndex) => {
    setActiveSectionIndex(sectionIndex);
    setEditingButtonIndex(null);
    setButtonLabel('');
    setButtonActions(['', '', '']);
    setButtonModalVisible(true);
  };

  const openEditButton = (sectionIndex, buttonIndex, button) => {
    setActiveSectionIndex(sectionIndex);
    setEditingButtonIndex(buttonIndex);
    setButtonLabel(button.label);
    const actions = button.actions.map((a) => a.label);
    while (actions.length < 3) actions.push('');
    setButtonActions(actions);
    setButtonModalVisible(true);
  };

  const saveButton = async () => {
    if (!buttonLabel.trim() || activeLayout._id === 'default') return;
    try {
      const actions = buttonActions
        .filter((a) => a.trim())
        .map((a) => ({ label: a.trim() }));

      const updatedSections = activeLayout.sections.map((section, si) => {
        if (si !== activeSectionIndex) return section;
        const updatedButtons = [...section.buttons];
        const newButton = { label: buttonLabel.trim(), actions };
        if (editingButtonIndex !== null) {
          updatedButtons[editingButtonIndex] = newButton;
        } else {
          updatedButtons.push(newButton);
        }
        return { ...section, buttons: updatedButtons };
      });

      const res = await api.put(`/api/layouts/${activeLayout._id}`, {
        sections: updatedSections,
      });
      setActiveLayout(res.data);
      setLayouts((prev) => prev.map((l) => (l._id === res.data._id ? res.data : l)));
      setButtonModalVisible(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const deleteButton = (sectionIndex, buttonIndex) => {
    if (activeLayout._id === 'default') return;
    Alert.alert('Delete Button', 'Remove this button?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedSections = activeLayout.sections.map((section, si) => {
              if (si !== sectionIndex) return section;
              return {
                ...section,
                buttons: section.buttons.filter((_, bi) => bi !== buttonIndex),
              };
            });
            const res = await api.put(`/api/layouts/${activeLayout._id}`, {
              sections: updatedSections,
            });
            setActiveLayout(res.data);
            setLayouts((prev) => prev.map((l) => (l._id === res.data._id ? res.data : l)));
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const isDefault = activeLayout?._id === 'default';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Layouts</Text>
        {isAdmin && (
          <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={28} color="#4f46e5" />
          </TouchableOpacity>
        )}
      </View>

      {layouts.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}
        >
          {layouts.map((l) => (
            <TouchableOpacity
              key={l._id}
              style={[styles.tab, activeLayout?._id === l._id && styles.tabActive]}
              onPress={() => setActiveLayout(l)}
              onLongPress={() => isAdmin && deleteLayout(l._id)}
            >
              <Text style={[styles.tabText, activeLayout?._id === l._id && styles.tabTextActive]}>
                {l.name} {l.isActive && '✓'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {loading ? (
        <ActivityIndicator color="#4f46e5" style={{ marginTop: 40 }} />
      ) : !activeLayout ? (
        <View style={styles.empty}>
          <Ionicons name="grid-outline" size={48} color="#333" />
          <Text style={styles.emptyText}>No layouts yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.launchRow}>
            {activeLayout.isActive ? (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>✓ Active Layout</Text>
              </View>
            ) : (
              !isDefault && (
                <TouchableOpacity
                  style={styles.setActiveBtn}
                  onPress={() => setAsActive(activeLayout._id)}
                >
                  <Text style={styles.setActiveBtnText}>Set as Active</Text>
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity
              style={styles.launchBtn}
              onPress={() => launchLayout(activeLayout._id)}
            >
              <Ionicons name="play-circle" size={20} color="#fff" />
              <Text style={styles.launchBtnText}>Launch</Text>
            </TouchableOpacity>
          </View>

          {activeLayout.sections.map((section, si) => (
            <View key={si} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.name}</Text>
                {isAdmin && !isDefault && (
                  <View style={styles.sectionActions}>
                    <TouchableOpacity onPress={() => openAddButton(si)}>
                      <Ionicons name="add-circle-outline" size={22} color="#4f46e5" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteSection(si)}>
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.buttonGrid}>
                {section.buttons.map((button, bi) => (
                  <TouchableOpacity
                    key={bi}
                    style={styles.buttonCard}
                    onPress={() => isAdmin && !isDefault && openEditButton(si, bi, button)}
                    onLongPress={() => isAdmin && !isDefault && deleteButton(si, bi)}
                  >
                    <Text style={styles.buttonLabel}>{button.label}</Text>
                    <Text style={styles.buttonActions}>
                      {button.actions.map((a) => a.label).join(' · ')}
                    </Text>
                  </TouchableOpacity>
                ))}
                {isAdmin && !isDefault && (
                  <TouchableOpacity
                    style={styles.addButtonCard}
                    onPress={() => openAddButton(si)}
                  >
                    <Ionicons name="add" size={24} color="#4f46e5" />
                    <Text style={styles.addButtonText}>Add Button</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {isAdmin && !isDefault && (
            <TouchableOpacity
              style={styles.addSectionBtn}
              onPress={() => setSectionModalVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#4f46e5" />
              <Text style={styles.addSectionText}>Add Section</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      <Modal visible={createModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>New Layout</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Layout name (e.g. Main Show)"
                  placeholderTextColor="#888"
                  value={layoutName}
                  onChangeText={setLayoutName}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={createLayout}>
                  <Text style={styles.saveBtnText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={sectionModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Add Section</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Section name (e.g. Mics)"
                  placeholderTextColor="#888"
                  value={sectionName}
                  onChangeText={setSectionName}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={addSection}>
                  <Text style={styles.saveBtnText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSectionModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={buttonModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>
                  {editingButtonIndex !== null ? 'Edit Button' : 'Add Button'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Button name (e.g. Mic 1)"
                  placeholderTextColor="#888"
                  value={buttonLabel}
                  onChangeText={setButtonLabel}
                />
                <Text style={styles.actionsLabel}>Alert options (up to 3)</Text>
                {buttonActions.map((action, i) => (
                  <TextInput
                    key={i}
                    style={styles.input}
                    placeholder={`Option ${i + 1} (e.g. Feedback)`}
                    placeholderTextColor="#888"
                    value={action}
                    onChangeText={(text) => {
                      const updated = [...buttonActions];
                      updated[i] = text;
                      setButtonActions(updated);
                    }}
                  />
                ))}
                <TouchableOpacity style={styles.saveBtn} onPress={saveButton}>
                  <Text style={styles.saveBtnText}>
                    {editingButtonIndex !== null ? 'Save Changes' : 'Add Button'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setButtonModalVisible(false)}>
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
  scroll: { padding: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { color: '#888', fontSize: 15, textAlign: 'center', marginTop: 20 },
  emptyLink: { color: '#4f46e5', fontSize: 15 },
  setActiveBtn: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4f46e5',
  },
  setActiveBtnText: { color: '#4f46e5', fontWeight: '600' },
  activeBadge: {
    flex: 1,
    backgroundColor: '#14532d',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  activeBadgeText: { color: '#22c55e', fontWeight: '600' },
  launchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  launchBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionActions: { flexDirection: 'row', gap: 12 },
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  buttonCard: {
    width: '47%',
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonLabel: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  buttonActions: { color: '#888', fontSize: 11 },
  addButtonCard: {
    width: '47%',
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addButtonText: { color: '#4f46e5', fontSize: 13 },
  addSectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4f46e5',
    marginTop: 8,
  },
  addSectionText: { color: '#4f46e5', fontSize: 15 },
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
  actionsLabel: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelText: { color: '#888', textAlign: 'center', fontSize: 15 },
});