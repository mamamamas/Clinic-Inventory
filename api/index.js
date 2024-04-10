const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const serverPort = 3000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://macky:macky@cluster0.txhql3y.mongodb.net/Clinic_Inventory")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: " + error.message);
  });

mongoose.connection.on('error', (error) => {
  console.error("Error connecting to MongoDB: " + error.message);
});

app.listen(serverPort, () => {
  console.log("Connected to Server port: " + serverPort);
});

const Item = require('./menu')

app.post('/add', async (req, res) => {
  try {
    const {
      itemName,
      quantity,
      expiredDate,
      manufactors,
    } = req.body;
    const menu = await Item.findOne({ itemName });
    
    const newItem = new Item({
      itemName,
      quantity,
      expiredDate,
      manufactors,
    });

    await newItem.save();

    res.status(200).json({ message: 'Item saved successfully', newItem: newItem });
  } catch (error) {
    console.error("Error saving item: " + error.message);
    res.status(500).json({ message: "Error saving item: " + error.message });
  }
});

app.get('/index', async (req, res) => {
 try {
    const inventoryItems = await Item.find();
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory items: " + error.message);
    res.status(500).json({ message: "Error fetching inventory items: " + error.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
    const itemIdToDelete = req.params.id;

    try {
        const deletedItem = await Item.findByIdAndDelete(itemIdToDelete);

        if (deletedItem) {
            res.status(200).json({ message: "Item deleted successfully" });
        } else {
            res.status(404).json({ message: "Item not found or already deleted" });
        }
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



app.put('/update/:id', async (req, res) => {
  const {  itemName, quantity, expiredDate, manufactors } = req.body;

  try {
    const updatedItem = {  itemName, quantity, expiredDate, manufactors };

    const updatedDocument = await Item.findByIdAndUpdate(req.params.id, updatedItem, { new: true, runValidators: true });

    if (!updatedDocument) {
      console.log('Failed to update item:', req.params.id);
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('Item updated successfully:', updatedDocument);
    return res.status(200).json({ message: 'Item updated successfully', updatedItem: updatedDocument });
  } catch (err) {
    console.error('Error updating item:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});





  app.get('/search', async (req, res) => {
    const { q } = req.query;
  
    try {
      const items = await Item.find({ itemName: { $regex: q, $options: 'i'} }).exec();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  


