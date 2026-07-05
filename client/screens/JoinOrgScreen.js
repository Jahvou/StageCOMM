import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export default function JoinOrgScreen({ route, navigation }) {
  const { user } = useAuth();
  const [token, setToken] = useState(route?.params?.token || '');
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoin = async () => {
    if (!token.trim()) {
      Alert.alert('Error', 'Please enter your invite token');
      return;
    }
    if (!user) {
  navigation.navigate('Login', { pendingToken: token.trim() });
  return;
}

    try {
      setJoining(true);
      await api.post('/api/orgs/join', { token: token.trim(), role: 'team_member' });
      setJoined(true);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to join organisation');
    } finally {
      setJoining(false);
    }
  };

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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.title}>Join Organisation</Text>
            <Text style={styles.subtitle}>
              Enter the invite token from your invitation email.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Paste your invite token here"
              placeholderTextColor="#888"
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleJoin}
              disabled={joining}
            >
              <Text style={styles.buttonText}>Join Organisation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonOutline}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonOutlineText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  flex: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  emoji: { fontSize: 64, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  input: {
    backgroundColor: '#1e1e2e',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#4f46e5',
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonOutline: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonOutlineText: { color: '#888', fontSize: 16 },
});