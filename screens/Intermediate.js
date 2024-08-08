import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import quotes from '../utils/quotes.json';

const Intermediate = () => {
  const navigation = useNavigation();
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      setQuote(randomQuote.quote);
      setAuthor(randomQuote.author || 'anonymus'); 
    } else {
      setQuote('No quotes available.');
      setAuthor('anonymus');
    }
  }, []);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 0.8,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [quote]);

  const interpolatedValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const animatedStyle = {
    opacity: interpolatedValue,
    transform: [
      {
        scale: interpolatedValue,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.quoteContainer, animatedStyle]}>
        <Text style={styles.quoteText}>"{quote}"</Text>
        <Text style={styles.authorText}>- {author}</Text>
      </Animated.View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NewDiaryEntry')}>
          <Text style={styles.buttonText}>New Diary Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PersonalDiary')}>
          <Text style={styles.buttonText}>My Diary</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  quoteContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  authorText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Intermediate;
