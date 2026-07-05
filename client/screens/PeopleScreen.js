import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const ROLE_COLORS = {
  director: '#f59e0b',
  admin: '#ef4444',
  stage_manager: '#8b5cf6',
  technician: '#3b82f6',
  performer: '#22c55e',
  team_member: '#64748b',
};

const ROLE_LABELS = {
  director: 'Director',
  admin: 'Admin',
  stage_manager: 'Stage Manager',
  technician: 'Technician',
  performer: 'Performer',
  team_member: 'Team Member',
};

export default function PeopleScreen() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const isAdmin = ['director', 'admin', 'stage_manager'].includes(user?.role);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const res = await api.get('/api/orgs/me');
      setMembers(res.data.members || []);
    } catch (err) {
      console.log('Failed to load members:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      setInviting(true);
      await api.post('/api/orgs/invite', { email: inviteEmail.trim() });
      Alert.alert('Invite Sent', `An invitation has been sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteModalVisible(false);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setInviting(false);
    }
  };

  const removeMember = (memberId, memberName) => {
    Alert.alert('Remove Member', `Remove ${memberName} from the organisation?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/orgs/members/${memberId}`);
            setMembers((prev) => prev.filter((m) => m._id !== memberId));
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || err.message);
          }
        },
      },
    ]);
  };

  const renderMember = ({ item }) => {
    const role = item.role;
    const color = ROLE_COLORS[role] || '#888';
    const isMe = item.user?._id === user._id;

    return (
      <View style={styles.memberCard}>
        <View style={[styles.avatar, { backgroundColor: color + '22' }]}>
          <Ionicons name="person" size={22} color={color} />
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.user?.name || 'Unknown'} {isMe && '(You)'}
          </Text>
          <Text style={styles.memberEmail}>{item.user?.email}</Text>
        </View>
        <View style={styles.memberRight}>
          <View style={[styles.roleBadge, { backgroundColor: color + '22' }]}>
            <Text style={[styles.roleText, { color }]}>{ROLE_LABELS[role] || role}</Text>
          </View>
          {isAdmin && !isMe && (
            <TouchableOpacity onPress={() => removeMember(item._id, item.user?.name)}>
              <Ionicons name="remove-circle-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>People</Text>
        <View style={styles.headerRight}>
          <Text style={styles.memberCount}>{members.length} members</Text>
          {isAdmin && (
            <TouchableOpacity onPress={() => setInviteModalVisible(true)}>
              <Ionicons name="person-add-outline" size={24} color="#4f46e5" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#4f46e5" style={{ marginTop: 40 }} />
      ) : members.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={48} color="#333" />
          <Text style={styles.emptyText}>No members yet</Text>
          {isAdmin && (
            <TouchableOpacity onPress={() => setInviteModalVisible(true)}>
              <Text style={styles.emptyLink}>Invite someone</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item._id}
          renderItem={renderMember}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Invite Modal */}
      <Modal visible={inviteModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Invite to Organisation</Text>
                <Text style={styles.modalSubtitle}>
                  They'll receive an email with a link to join your organisation.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#888"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity
                  style={styles.inviteBtn}
                  onPress={sendInvite}
                  disabled={inviting}
                >
                  {inviting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.inviteBtnText}>Send Invite</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setInviteModalVisible(false)}>
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
  memberCount: { fontSize: 14, color: '#888' },
  list: { padding: 16 },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: { flex: 1 },
  memberName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  memberEmail: { color: '#888', fontSize: 12, marginTop: 2 },
  memberRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { fontSize: 12, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { color: '#888', fontSize: 15 },
  emptyLink: { color: '#4f46e5', fontSize: 15 },
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
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
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
  inviteBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  inviteBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelText: { color: '#888', textAlign: 'center', fontSize: 15 },
});
