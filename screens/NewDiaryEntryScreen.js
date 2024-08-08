import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, setDoc, collection } from 'firebase/firestore';
import { firestore, auth } from '../utils/firebaseConfig'; 
import { encryptData } from '../utils/encryption';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewDiaryEntryScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [entryText, setEntryText] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const fetchPassword = async () => {
      try {
        const storedPassword = await AsyncStorage.getItem('userPassword');
        if (storedPassword) {
          setPassword(storedPassword);
        } else {
          Alert.alert('Error', 'Password not found. Please login again.');
          navigation.navigate('Login');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch password: ' + error.message);
      }
    };

    fetchPassword();
  }, [fadeAnim]);

  const handleSave = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!entryText || !password) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const entryId = new Date().toISOString();
      const encryptedEntry = encryptData(entryText, password);

      await setDoc(doc(collection(firestore, 'users', userId, 'entries'), entryId), {
        date: date.toISOString().split('T')[0],
        'diary-entry': encryptedEntry,
        userID: userId
      });

      setSuccessMessage('Diary entry added successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        navigation.goBack();
      }, 2000); 
    } catch (error) {
      Alert.alert('Error', 'Failed to add diary entry: ' + error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>Select Date: {date.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setShowDatePicker(false);
          }}
        />
      )}

  <TouchableWithoutFeedback>
      <View>
      <TextInput
        style={styles.input}
        placeholder="Diary Entry"
        value={entryText}
        onChangeText={setEntryText}
        multiline={true}
        textAlignVertical="top"
      />
      </View>
  </TouchableWithoutFeedback>


      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Entry</Text>
      </TouchableOpacity>

      {successMessage ? (
        <Animated.View style={[styles.successMessageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.successMessage}>{successMessage}</Text>
        </Animated.View>
      ) : null}
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
  input: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    fontWeight: "600",
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#ddd',
    marginBottom: 12,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successMessageContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  successMessage: {
    color: 'green',
    fontSize: 12,
  },
});

export default NewDiaryEntryScreen;
