import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export default function JoinOrgScreen({ route, navigation }) {
  const { user } = useAuth();
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  // Get token from deep link params
  const token = route?.params?.token;

  useEffect(() => {
    if (token && user) {
      handleJoin();
    }
  }, [token, user]);

  const handleJoin = async () => {
    if (!token) {
      Alert.alert('Error', 'Invalid invite link');
      return;
    }
    try {
      setJoining(true);
      await api.post('/api/orgs/join', { token, role: 'team_member' });
      setJoined(true);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to join organisation');
      navigation.navigate('Main');
    } finally {
      setJoining(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>You've been invited!</Text>
          <Text style={styles.subtitle}>
            Please log in or create an account to join the organisation.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonOutlineText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (joining) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <ActivityIndicator color="#4f46e5" size="large" />
          <Text style={styles.subtitle}>Joining organisation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (joined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>You're in!</Text>
          <Text style={styles.subtitle}>
            You've successfully joined the organisation.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.buttonText}>Go to App</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Invalid Invite</Text>
        <Text style={styles.subtitle}>
          This invite link is invalid or has expired.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.buttonText}>Go to App</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonOutline: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#4f46e5',
  },
  buttonOutlineText: { color: '#4f46e5', fontSize: 16, fontWeight: 'bold' },
});