import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Button,
  TextInput,
  Pressable
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";


const IndexScreen = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState("");
  const navigation = useNavigation();
  const [itemName, setItemName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [manufactors, setManufactors] = useState("");
  const [counter, setCounter] = useState(1);


      // Retrieve EndPoint
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get("http://192.168.1.3:3000/index");
        setInventory(response.data);
      } catch (err) {
        console.error("Error:", err);
      }
      setIsLoading(false);
    };

    fetchInventoryData();
  }, []);

   // Delete EndPoint
  const deleteItem = async (itemId) => {
    try {
      const response = await axios.delete(`http://192.168.1.3:3000/delete/${itemId}`);
      if (response.status === 200) {
        setInventory(inventory.filter((item) => item._id !== itemId));
        Alert.alert("Item deleted successfully.");
      }
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Failed to delete item. Please try again later.");
    }
  };


      // Search ENDPOINT
  const handleSearch = () => {
    axios
      .get(`http://192.168.1.3:3000/search?q=${itemName}`)
      .then((response) => {
        setSearchResults(response.data);
        setInventory(response.data);
        setSearched(true);
      })
      .catch((error) => {
        console.error("Error searching:", error);
      });
  };

    
          // Pupunta sa add screen
    const handlePress = useCallback((item) => {
        navigation.navigate("add", { item });
      }, [navigation]);

          // Pupunta sa edit screen
          const handleEdit = useCallback((item) => {
 
  navigation.navigate("edit", {
    itemId: item.id,
  });
}, [navigation]);


          // Message kapag walang nakitang result sa sinearch
    const NoResultsMessage = () => (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
        );
 
        // PARA SA EXPIRATION DATE MAG RERED ANG TEXT KAPAG MALAPIT NA MAG EXPIRED
  const renderItem = ({ item, index, itemId }) => {
    const isLastColumn = index === Object.keys(item).length - 1;

  const expirationDate = moment.utc(item.expiredDate);
  const today = moment.utc();
  const oneMonthFromNow = today.add(1, 'months');
  const isExpired = expirationDate.isBefore(oneMonthFromNow);

    return (

      // DITO NANGGAGALING ANG MGA TABLE DATA 
      <View style={styles.row}>
        
        <Text style={[styles.cell, { width: 80, }]}>{item.itemName}</Text>
        <Text style={[styles.cell, { width: 90 }]}>{item.quantity}</Text>
        <Text style={[styles.cell, { width: 110, color: isExpired ? 'red' : 'green' }]}>
          {moment(item.expiredDate).format("ddd MMM DD YYYY")}
        </Text>
        <Text style={[styles.cell, { width: 110 }]}>
          {moment(item.createdAt).format("ddd MMM DD YYYY")}
        </Text>
        <Text style={[styles.cell, { width: 110 }]}>{item.manufactors}</Text>
        <TouchableOpacity style={{ width: 20 }} onPress={() => deleteItem(item._id)}>
          <AntDesign name="delete" size={17} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 30, marginLeft: 10 }} onPress={() => handleEdit(item)}>
  <Feather name="edit" size={17} color="black" />
</TouchableOpacity>

      </View>
    );
  };

  
  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>

        {/* eto yung back button  */}
        <AntDesign
          style={{ marginLeft: 20, marginTop: 20 }}
          name="back"
          size={24}
          color="black"
        />
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 20
          }}
        >
          Clinic Inventory
        </Text>
        <View style={{ backgroundColor: "white"}}>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
            {/* Search */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 7,
                gap: 10,
                backgroundColor: "white",
                height: 40,
                borderRadius: 3,
                flex: 1
              }}
            >
              <TextInput
                style={{
                  borderRadius: 5,
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  width: "50%",
                  paddingLeft: 10,
                  height: 30
                }}
                placeholder="Enter search item name"
                value={itemName}
                onChangeText={(text) => setItemName(text)}
              />

              {/* sa ano na toh pag pinindot yung "search" */}
              <Pressable
                onPress={handleSearch}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "rgb(210, 230, 255)" : "white"
                  }
                ]}
              >
                <Text>Search</Text>
              </Pressable>
            </View>

            <AntDesign
              name="search1"
              size={25}
              color="black"
              style={{ padding: 5 }}
            />

            {/* Add Button */}
            <TouchableOpacity
              style={{ width: 30 }}
              onPress={handlePress}
            >
              <FontAwesome
                style={{ marginTop: 11, marginRight: 0 }}
                name="plus-square-o"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Table */}
        <View style={styles.Listcontainer}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { width: 90 }]}>Item Name</Text>
            <Text style={[styles.headerText, { width: 90 }]}>Quantity</Text>
            <Text style={[styles.headerText, { width: 120 }]}>
              Expiration Date
            </Text>
            <Text style={[styles.headerText, { width: 120}]}>Created At</Text>
            <Text style={[styles.headerText, { width: 120 }]}>Manufacturer</Text>
            <Text style={[styles.headerText, { width: 120 }]}>Settings</Text>
          </View>
          {searched && searchResults.length === 0 && <NoResultsMessage />}
          {!isLoading && inventory.length > 0 && (
            <FlatList
              data={inventory}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.Listcontainer}
            />
          )}
          {isLoading && <Text>Loading...</Text>}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 16,
    borderLeftWidth: 1,
    borderLeftColor: "lightgray",
    marginVertical: 8,
    marginHorizontal: 10
  },

  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50
  },
  Listcontainer: {
    flex: 1,
    width: "100%"
  },
  header: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%"
  },
  headerText: {
    fontSize: 15,
    textAlign: "center",
    flex: 1
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
    marginHorizontal: 1,
    elevation: 1,
    borderRadius: 3,
    paddingVertical: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    width: "100%"
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default IndexScreen;