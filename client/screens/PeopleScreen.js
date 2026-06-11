import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
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
};

const ROLE_LABELS = {
  director: 'Director',
  admin: 'Admin',
  stage_manager: 'Stage Manager',
  technician: 'Technician',
  performer: 'Performer',
};

export default function PeopleScreen() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await api.get('/api/orgs/me');
        setMembers(res.data.members);
      } catch (err) {
        console.log('Failed to load members:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
  }, []);

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
        <View style={[styles.roleBadge, { backgroundColor: color + '22' }]}>
          <Text style={[styles.roleText, { color }]}>{ROLE_LABELS[role] || role}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>People</Text>
        <Text style={styles.memberCount}>{members.length} members</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#4f46e5" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item._id}
          renderItem={renderMember}
          contentContainerStyle={styles.list}
        />
      )}
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
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { fontSize: 12, fontWeight: '600' },
});