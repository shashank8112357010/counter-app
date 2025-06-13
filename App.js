import React, { useState } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Count: {count}</Text>
      <Button title="Increase" onPress={() => setCount(count + 1)} />
      <Button title="Decrease" onPress={() => setCount(count - 1)} />
      <Button title="Reset" onPress={() => setCount(0)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontSize: 32,
    marginBottom: 20,
  },
});
