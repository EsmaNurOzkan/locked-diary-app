import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Animated } from 'react-native';
import { loginUser } from '../utils/authFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = async () => {
    setMessage('');
    try {
      await loginUser(email, password);
      await AsyncStorage.setItem('userPassword', password);
      setMessage('Login Successful');
      navigation.navigate('Intermediate');
    } catch (error) {
      console.log('Login error:', error);
      setMessage('Invalid email or password');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.welcomeMessage}>
        Welcome to Diary App!{'\n'}Your diaries are secured with end-to-end encryption,{'\n'}ensuring that no third parties can access your personal data.
      </Text>
      <TouchableWithoutFeedback>
        <View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={handleLogin}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleLogin}
      />
      </View>
   </TouchableWithoutFeedback>
       <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {message ? <Text style={[styles.message, message === 'Login Successful' ? styles.successMessage : null]}>{message}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>Register</Text>
      </TouchableOpacity>
    </Animated.View>
    </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  welcomeMessage: {
    marginBottom: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    marginTop: 30,
    paddingHorizontal: 16, 
  },
  input: {
    height: 40,
    fontSize: 12,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  message: {
    marginTop: 12,
    color: 'red',
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'green',
  },
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerLink: {
    marginTop: 12,
    color: 'blue',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
