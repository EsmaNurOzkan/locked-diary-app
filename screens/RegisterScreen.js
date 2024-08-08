import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback , Animated, Keyboard } from 'react-native';
import { registerUser } from '../utils/authFunctions';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);


  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blinkAnim]);

  const handleRegister = async () => {
    setMessage('');
    setIsSuccess(false);
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }
    try {
      await registerUser(email, password);
      setIsSuccess(true);
      setMessage('Registration Successful');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        setMessage('');
        navigation.navigate('Login');
      }, 3000); 
    } catch (error) {
      setMessage('Registration failed: ' + error.message);
    }
  };

  const handleSubmit = () => {
    Keyboard.dismiss(); 
    handleRegister(); 
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
        <Animated.Text style={[styles.warningMessage, { opacity: blinkAnim }]}>
            WARNING: Once you set this password, you cannot change it. Please make a note of it somewhere. Your diary entries and access will be secured with this password.
        </Animated.Text>
          <TouchableWithoutFeedback>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#bbb"
                onSubmitEditing={handleSubmit}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                placeholderTextColor="#bbb"
                onSubmitEditing={handleSubmit}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          {message ? (
            <Text style={[styles.message, isSuccess && styles.successMessage]}>{message}</Text>
          ) : null}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  warningMessage: {
    marginBottom: 30,
    fontSize: 12,
    color: 'maroon',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontWeight: '700',
  },
  input: {
    height: 40,
    fontSize: 10,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    borderColor: '#555',
    borderWidth: 1,
    paddingVertical: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    marginTop: 12,
    color: 'red',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
  },
  linkText: {
    marginTop: 12,
    color: 'navy',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default RegisterScreen;
