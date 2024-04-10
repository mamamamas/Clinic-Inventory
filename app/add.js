import React, { useState, useCallback, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from 'axios'; 
import { useNavigation } from "@react-navigation/native";
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
  Alert
} from "react-native";


const add = () => {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [expiredDate, setExpiredDate] = useState("");
    const [manufactors, setManufactors] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [createdAt, setCreatedAt] = useState("");
    const [expired, setExpired] = useState(false);
    const navigation = useNavigation();
    const handleInformation = () => {
        const inventoryData = {
          itemName: itemName,
          quantity: quantity,
          expiredDate: expiredDate,
          manufactors: manufactors,
          createdAt : createdAt
          
        }
      
        axios.post("http://192.168.1.3:3000/add", inventoryData,)
        .then((response) => {
          console.log(response.data);
          Alert.alert("Information added", "", [
            {
              text: "OK",
              onPress: () => {
                // Babalik sa inventory
                navigation.navigate("index");
      
               
              },
            },
          ]);
        })
        .catch((error) => {
          Alert.alert("MAGLAGAY KA MUNAAA!!", "", [
            {
              text: "OK",
              onPress: () => {
                console.log('Failed'+error);
              },
            },
          ]);
        });
        
        // Handle submit button press
        console.log("Item Name:", itemName);
        console.log("Quantity:", quantity);
        console.log("Expired Date:", expiredDate);
        console.log("Created At:", createdAt);
        console.log("Manufacturer:", manufactors);
      };

     

        // Date Picker para sa expiration date
    const toggleDatePicker = () => {
      setShowPicker(!showPicker);
    }
  
    const onChange = ({type}, selectedDate) => {
      if(type === 'set'){
          const currentDate = selectedDate;
          setDate(currentDate)
  
          if(Platform.OS === 'android'){
              toggleDatePicker();
              setExpiredDate(moment(currentDate).format('ddd MMM DD YYYY'));
          }
      }else{
          toggleDatePicker();
      }
    }
    const calculateExpiration = () => {
      const diff = moment(expiredDate).diff(moment(), 'days');
      if (diff < 0) {
        setExpired(true);
      } else {
        setExpired(false);
      }
    }
    
    useEffect(() => {
      calculateExpiration();
    }, [expiredDate]);
   
  
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
            onChangeText={(text) => setQuantity(text)}
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
            color: expired ? 'red' : 'black',
            borderColor: 'white'
          }}
          value={expiredDate}
          onChangeText={(text) => setExpiredDate(text)}
          keyboardType="default"
          editable={false}
          />
          </Pressable>
          )}
          {/* Date Picker */}
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

        {/* Manufacturer */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Manufacturer:</Text>
          <TextInput
            style={styles.inputText}
            value={manufactors}
            onChangeText={(text) => setManufactors(text)}
            keyboardType="default"
          />

          {/* Add button */}
        </View>
            <TouchableOpacity style={styles.button} onPress={handleInformation}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
         </View>
    );
  }
  export default add;
  
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