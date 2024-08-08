import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, ScrollView, Animated, TouchableOpacity, Modal } from 'react-native';
import { doc, getDocs, collection, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '../utils/firebaseConfig';
import { decryptData, encryptData } from '../utils/encryption';
import { useFonts } from "expo-font";


const PersonalDiaryScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (selectedEntry) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [selectedEntry]);

  const handleFetchEntries = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const entriesSnapshot = await getDocs(collection(firestore, 'users', userId, 'entries'));
      const fetchedEntries = [];

      let hasDecryptionError = false;

      entriesSnapshot.forEach((doc) => {
        const data = doc.data();
        try {
          const decryptedEntry = decryptData(data['diary-entry'], password);
          fetchedEntries.push({ id: doc.id, ...data, 'diary-entry': decryptedEntry });
        } catch (err) {
          hasDecryptionError = true;
        }
      });

      if (hasDecryptionError) {
        setError('Incorrect password. Please try again.');
      } else {
        setEntries(fetchedEntries);
        setError(null);  
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch diary entries: ' + error.message);
    }
  };

  const handleEditEntry = async (entryId) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!editedText) {
      Alert.alert('Error', 'Please enter the new text');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const encryptedEntry = encryptData(editedText, password);

      await updateDoc(doc(firestore, 'users', userId, 'entries', entryId), {
        'diary-entry': encryptedEntry,
      });

      setEditingEntry(null);
      setEditedText('');
      handleFetchEntries();
      Alert.alert('Success', 'Diary entry updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update diary entry: ' + error.message);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(firestore, 'users', userId, 'entries', entryId));
      handleFetchEntries();
      Alert.alert('Success', 'Diary entry deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete diary entry: ' + error.message);
    }
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
  };

  const handlePreviousEntry = () => {
    const currentIndex = entries.findIndex(entry => entry.id === selectedEntry.id);
    if (currentIndex > 0) {
      setSelectedEntry(entries[currentIndex - 1]);
    }
  };

  const handleNextEntry = () => {
    const currentIndex = entries.findIndex(entry => entry.id === selectedEntry.id);
    if (currentIndex < entries.length - 1) {
      setSelectedEntry(entries[currentIndex + 1]);
    }
  };

  const [fontsLoaded] = useFonts({
    "Merienda-Black": require("../assets/fonts/Merienda-Black.ttf")
  }) 
  
  if(!fontsLoaded){
    return undefined;
  }
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleFetchEntries}
      />
      <TouchableOpacity style={styles.fetchButton} onPress={handleFetchEntries}>
        <Text style={styles.fetchButtonText}>ACCESS THE DIARY</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {entries.length > 0 ? (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entry}>
              <Text>Date: {entry.date}</Text>
              <Text numberOfLines={3} ellipsizeMode='tail'>Entry: {entry['diary-entry']}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingEntry(entry.id);
                    setEditedText(entry['diary-entry']);
                  }}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEntry(entry.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => setSelectedEntry(entry)}
                >
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
              {editingEntry === entry.id && (
                <View style={styles.editContainer}>
                  <ScrollView>
                  <TextInput style={styles.editInput}
                    placeholder="Edit your entry"
                    value={editedText}
                    onChangeText={setEditedText}
                    multiline

                  />
                  <View style = {styles.buttonContainer}>
                  <TouchableOpacity style={styles.saveButton} onPress={() => handleEditEntry(entry.id)}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingEntry(null)}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                  </ScrollView>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text>No entries available</Text>
        )}
      </ScrollView>
      
      <Modal
        visible={!!selectedEntry}
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedEntry?.date}</Text> 
              <Text style={styles.modalText}>{selectedEntry?.['diary-entry']}</Text>
            </ScrollView>
            <View style={styles.navigationButtonsContainer}>
              <TouchableOpacity style={styles.navigationButtonPrev} onPress={handlePreviousEntry}>
                <Text style={styles.navigationButtonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navigationButtonNext} onPress={handleNextEntry}>
                <Text style={styles.navigationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  fetchButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  fetchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 16,
  },
  entry: {
    marginBottom: 16,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 8,
    justifyContent: "center",
    height:30
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 8,
    justifyContent: "center",
    height:30
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10

  },
  viewButton: {
    backgroundColor: '#2196F3',
    padding: 5,
    borderRadius: 8,
    justifyContent: "center",
    height:30
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10
  },
  editContainer: {
    marginTop: 10,
    marginBottom:100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    minHeight: 200,
    padding: 10,
    alignSelf: 'center', 
    width: '90%',
    maxWidth: 600,
  },
  
  editInput: {
    height: '50%', 
    textAlignVertical: 'top', 
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  saveButton: {
    width:"40%",
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:"10"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'antiquewhite',
    borderRadius: 30,
    alignItems: 'center',
    position: 'relative',
    maxHeight: '80%', 
  },
  closeButton: {
    marginLeft:250,
    top: 10,
    padding: 10,
    margin:10
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Merienda-Black',

  },
  modalText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
    textAlign: 'left',
    marginBottom: 10,
    fontFamily: 'Merienda-Black',
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  navigationButtonPrev: {
    padding: 5,
    marginRight:80,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  navigationButtonNext: {
    padding: 5,
    marginLeft:80,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  navigationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: "10"
  },
  cancelButton: {
    marginLeft:10,
    width:"40%",
    backgroundColor: '#6c757d',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight:"bold"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
});

export default PersonalDiaryScreen;
