import React, { useState, useEffect, useCallback } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from 'axios'; 
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
  Alert,
  FlatList
} from "react-native";

const EditScreen = ({itemId}) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [manufactors, setManufactors] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [createdAt, setCreatedAt] = useState(new Date().toISOString());
  const [date, setDate] = useState(new Date());
  const navigation = useNavigation();
  const update = useCallback(() => {
  // Check if required fields are empty
  if (!itemName || !quantity || !manufactors) {
    Alert.alert('Missing Information', 'Please fill in all required fields.');
    return;
  }
  const inventoryData = {
    id: itemId,
    itemName,
    quantity,
    manufactors,
    expiredDate, 
    createdAt
  };
console.log(itemId);
  // Log inventory data for debugging
  console.log('Inventory data:', inventoryData);

  // Send PUT request to update item
  axios.put(`http://192.168.1.3:3000/update/${itemId}`, inventoryData)
    .then((response) => {
      console.log('Item updated successfully:', response.data.updatedItem);
      Alert.alert(
        'Information updated',
        'Item information has been updated successfully.',
        [{
          text: 'OK',
          onPress: () => {
            navigation.navigate('index');
          },
        }]
      );
    })
    .catch((error) => {
      // Handle errors
      if (error.response) {
        console.error('Server responded with status code:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received from server:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
      Alert.alert('Error updating information', 'An error occurred while updating information.');
    });
}, [itemName, quantity, manufactors, createdAt, navigation]);

  
  
  
  

  

  
  // Date Picker
  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  }

  const onChange = ({type}, selectedDate) => {
    if(type === 'set'){
        const currentDate = selectedDate;
        setDate(currentDate)

        if(Platform.OS === 'android'){
            toggleDatePicker();
            setExpiredDate(currentDate.toDateString());
        }
    }else{
        toggleDatePicker();
    }
  }

 


  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
        Clinic Inventory
      </Text>

      {/* Item Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Item Name:</Text>
        <TextInput
          style={styles.inputText}
          value={itemName}
          onChangeText={(text) => setItemName(text)}
        />
      </View>

      {/* Quantity */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Quantity:</Text>
        <TextInput
          style={styles.inputText}
          value={quantity}
          onChangeText={(number) => setQuantity(number)}
          keyboardType="numeric"
        />
      </View>

      {/* Expiration Date */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Expired Date:</Text>
        {!showPicker && (
          <Pressable onPress = {toggleDatePicker}>
            <TextInput
              style={{
                borderRadius: 5,
                paddingHorizontal: 10,
                flex: 1,
                marginRight: 10,
                color: 'black',
                borderColor: 'white'
              }}
              value={expiredDate}
              onChangeText={(text) => setExpiredDate(text)}
              keyboardType="default"
              onFocus={() => setDatePickerVisibility(true)}
              editable={false}
            />
          </Pressable>
        )}
        {showPicker && (
          <DateTimePicker
            value={date} 
            mode="date"
            display="calendar"
            onChange = {onChange}
            minimumDate={new Date()}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Manufacturer:</Text>
        <TextInput
          style={styles.inputText}
          value={manufactors}
          onChangeText={(text) => setManufactors(text)}
          keyboardType="default"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={update}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
}


  export default EditScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20,
      justifyContent: "center",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    inputLabel: {
      fontWeight: "bold",
      width: 100,
      marginRight: 10,
    },
    inputText: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 10,
      flex: 1,
      marginRight: 10,
    },
    button: {
      backgroundColor: "#4CAF50",
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: "center",
      marginBottom: 20,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });