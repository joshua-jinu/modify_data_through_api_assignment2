const express = require('express');
const { resolve } = require('path');
const connectDB = require('./db.js');
const dotenv = require('dotenv');
const MenuItem = require('./menu.model.js');

const app = express();
const port = 3010;

dotenv.config();

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/menu', async (req, res)=>{
  const body = req.body;

  if(!body.name || !body.price){
    return res.status(400).json({success: false, message: "Required Data not avaliable"});
  }

  try{
    const newItem = new MenuItem(body);
    await newItem.save();

    console.log("Menu Item Created");
    return res.status(201).json({success: true, message: "Menu Item created", item: newItem});
  }catch(err){
    console.log("Error in menu item creation")
    return res.status(500).json({success: false, message: "Internal Server Error in creating menu item"});
  }
  
})

app.put('/menu/:id', async (req, res)=>{
  const {id} = req.params;
  const body = req.body;

  try{
    const item = await MenuItem.findByIdAndUpdate(id, body);

    console.log(`Item ${id} updated`);
    return res.status(200).json({
      success: true,
      message: item
    })

  }catch(err){
    console.log(`server user in editing menu item`,err);
    return res.status(500).json({
      success: false, 
      message: "server error in editing menu",
  });
  }
})

app.get('/menu', async (req, res)=>{
  try{
    const menu = await MenuItem.find({});
    console.log("Menu Successfully fetched");
    return res.status(200).send(menu)
  }catch(err){
    console.log("error in fetching menu", err)
    return res.status(500).json({success: false, message: "Internal Server Error in fetching menu"});
  }
})

app.delete('/menu/:id', async (req, res)=>{
  const {id} = req.params;

  try{
    await MenuItem.findByIdAndDelete(id);
    
    console.log(`Item ${id} deleted`);
    return res.status(200).json({
      success: true,
      message:`Item ${id} deleted`,
  });
  }catch(err){
    console.log('Item Deletion - Error');
    return res.status(500).json({
      success: false, 
      message: "server error in deleting menu item",
    });
  }
})

app.listen(port, () => {
  connectDB();
  console.log(`Example app listening at http://localhost:${port}`);
});
