import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export default function AccountScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrg = async () => {
      try {
        const res = await api.get('/api/orgs/me');
        setOrg(res.data);
      } catch (err) {
        console.log('Failed to load org:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrg();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#4f46e5" />
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.role}>{user?.role}</Text>
        </View>

        {/* Info cards */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="mail-outline" size={20} color="#888" />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>Email</Text>
              <Text style={styles.cardValue}>{user?.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>Password</Text>
              <Text style={styles.cardValue}>••••••••</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="business-outline" size={20} color="#888" />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>Organisation</Text>
              {loading ? (
                <ActivityIndicator color="#4f46e5" size="small" />
              ) : (
                <Text style={styles.cardValue}>
                  {org?.name || 'Not part of an organisation'}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  content: { padding: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e1e2e',
    borderWidth: 2,
    borderColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  role: { fontSize: 14, color: '#888', textTransform: 'capitalize' },
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  cardValue: { fontSize: 15, color: '#fff' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
});
