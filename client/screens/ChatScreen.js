import { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import socket from '../services/socket';

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    const roomId = user?.org || user?._id; // Use org ID if available, otherwise use user ID
    if (!roomId) return;

    // Load existing messages
    socket.emit('get_messages', { orgId: roomId });

    socket.on('messages_loaded', (msgs) => {
      setMessages(msgs);
    });

    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('messages_loaded');
      socket.off('new_message');
    };
  }, [user]);

  const sendMessage = () => {
    if (!text.trim() || !user?._id) return;
    socket.emit('send_message', {
      orgId: user.org || user._id, // Use org ID if available, otherwise use user ID
      sentBy: user._id,
      text: text.trim(),
    });
    setText('');
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sentBy?._id === user._id || item.sentBy === user._id;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
        {!isMe && (
          <Text style={styles.senderName}>{item.sentBy?.name || 'Unknown'}</Text>
        )}
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  messageList: { padding: 16, paddingBottom: 8 },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  myBubble: {
    backgroundColor: '#4f46e5',
    alignSelf: 'flex-end',
  },
  theirBubble: {
    backgroundColor: '#1e1e2e',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#333',
  },
  senderName: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4,
  },
  messageText: { color: '#fff', fontSize: 15 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});