import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AlertButton({ label, action, active, onPress }) {
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        setVisible((prev) => !prev);
      }, 350);
    } else {
      clearInterval(intervalRef.current);
      setVisible(true);
    }

    return () => clearInterval(intervalRef.current);
  }, [active]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        active && (visible ? styles.buttonActive : styles.buttonInactive),
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, active && visible && styles.labelActive]}>
        {label}
      </Text>
      {active && <Text style={styles.action}>{action}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '47%',
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#3b0000',
    borderColor: '#ef4444',
  },
  buttonInactive: {
    backgroundColor: '#1e1e2e',
    borderColor: '#333',
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelActive: {
    color: '#ef4444',
  },
  action: {
    color: '#ef4444',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});