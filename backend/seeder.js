import connectDB from "./config/connectDB.js";
import BeverageModel from "./models/beverage.model.js";
import mongoose from "mongoose";
import colors from "colors";
import FoodModel from "./models/food.model.js";
// connect to mongoDB
await connectDB();

// Data

const beverages = [
  {
    name: "Chardonnay",
    description: "A dry white wine with notes of apple and vanilla.",
    category: "beverage",
    type: "wine",
    extras: [],
    sizesPrices: [
      { size: "small", price: 8.99 },
      { size: "medium", price: 12.99 },
      { size: "large", price: 16.99 },
    ],
  },
  {
    name: "Cabernet Sauvignon",
    description: "A bold red wine with flavors of black currant and oak.",
    category: "beverage",
    type: "wine",
    extras: [],
    sizesPrices: [
      { size: "small", price: 9.99 },
      { size: "medium", price: 13.99 },
      { size: "large", price: 18.99 },
    ],
  },
  {
    name: "Whiskey Sour",
    description:
      "A classic cocktail with whiskey, lemon juice, and simple syrup.",
    category: "beverage",
    type: "spirits",
    extras: [],
    sizesPrices: [
      { size: "small", price: 7.99 },
      { size: "medium", price: 10.99 },
      { size: "large", price: 13.99 },
    ],
  },
  {
    name: "Margarita",
    description: "A tequila-based cocktail with lime juice and triple sec.",
    category: "beverage",
    type: "spirits",
    extras: [],
    sizesPrices: [
      { size: "small", price: 6.99 },
      { size: "medium", price: 9.99 },
      { size: "large", price: 12.99 },
    ],
  },
  {
    name: "IPA Beer",
    description: "An India Pale Ale with a hoppy and bitter flavor profile.",
    category: "beverage",
    type: "beer",
    extras: [],
    sizesPrices: [
      { size: "small", price: 5.99 },
      { size: "medium", price: 7.99 },
      { size: "large", price: 10.99 },
    ],
  },
  {
    name: "Stout Beer",
    description: "A dark beer with rich chocolate and coffee flavors.",
    category: "beverage",
    type: "beer",
    extras: [],
    sizesPrices: [
      { size: "small", price: 5.99 },
      { size: "medium", price: 7.99 },
      { size: "large", price: 10.99 },
    ],
  },
  {
    name: "Cola",
    description: "A classic carbonated soda with a hint of vanilla.",
    category: "beverage",
    type: "soda",
    extras: [],
    sizesPrices: [
      { size: "small", price: 2.99 },
      { size: "medium", price: 3.99 },
      { size: "large", price: 4.99 },
    ],
  },
  {
    name: "Ginger Ale",
    description: "A refreshing soda with a ginger flavor.",
    category: "beverage",
    type: "soda",
    extras: [],
    sizesPrices: [
      { size: "small", price: 2.99 },
      { size: "medium", price: 3.99 },
      { size: "large", price: 4.99 },
    ],
  },
  {
    name: "Espresso Martini",
    description: "A cocktail made with vodka, espresso, and coffee liqueur.",
    category: "beverage",
    type: "spirits",
    extras: [],
    sizesPrices: [
      { size: "small", price: 8.99 },
      { size: "medium", price: 11.99 },
      { size: "large", price: 14.99 },
    ],
  },
  {
    name: "Shiraz",
    description: "A red wine with bold flavors of plum and black pepper.",
    category: "beverage",
    type: "wine",
    extras: [],
    sizesPrices: [
      { size: "small", price: 9.99 },
      { size: "medium", price: 13.99 },
      { size: "large", price: 18.99 },
    ],
  },
];

const foodItems = [
  {
    name: "Caesar Salad",
    price: 7.99,
    description:
      "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan cheese.",
    category: "starter",
    extras: [],
  },
  {
    name: "Bruschetta",
    price: 6.99,
    description: "Toasted bread with tomato, basil, and balsamic glaze.",
    category: "starter",
    extras: [],
  },
  {
    name: "Mozzarella Sticks",
    price: 8.99,
    description: "Breaded mozzarella sticks served with marinara sauce.",
    category: "starter",
    extras: [],
  },
  {
    name: "Chicken Wings",
    price: 10.99,
    description: "Spicy chicken wings with blue cheese dip.",
    category: "starter",
    extras: [],
  },
  {
    name: "House Salad",
    price: 5.99,
    description: "Mixed greens with tomato, cucumber, and carrots.",
    category: "starter",
    extras: [],
  },
  {
    name: "Margherita Pizza",
    price: 12.99,
    description: "Classic pizza with tomato, mozzarella, and basil.",
    category: "main",
    extras: [],
  },
  {
    name: "Spaghetti Carbonara",
    price: 13.99,
    description: "Pasta with pancetta, egg, and parmesan.",
    category: "main",
    extras: [],
  },
  {
    name: "Grilled Chicken Breast",
    price: 12.99,
    description: "Grilled chicken breast with a choice of two sides.",
    category: "main",
    extras: [],
  },
  {
    name: "Beef Burger",
    price: 14.99,
    description: "Juicy beef burger with lettuce, tomato, and cheese.",
    category: "main",
    extras: [],
  },
  {
    name: "Veggie Burger",
    price: 13.99,
    description: "Plant-based burger with lettuce, tomato, and vegan cheese.",
    category: "main",
    extras: [],
  },
  {
    name: "Lobster Roll",
    price: 18.99,
    description: "Lobster meat with mayonnaise on a soft roll.",
    category: "main",
    extras: [],
  },
  {
    name: "Beef Tacos",
    price: 10.99,
    description: "Soft tacos with seasoned beef, lettuce, and cheese.",
    category: "main",
    extras: [],
  },
  {
    name: "Shrimp Tacos",
    price: 12.99,
    description: "Soft tacos with grilled shrimp, lettuce, and pico de gallo.",
    category: "main",
    extras: [],
  },
  {
    name: "Salmon Filet",
    price: 16.99,
    description: "Grilled salmon with a choice of two sides.",
    category: "main",
    extras: [],
  },
  {
    name: "French Fries",
    price: 3.99,
    description: "Golden crispy fries served with ketchup.",
    category: "side",
    extras: [],
  },
  {
    name: "Sweet Potato Fries",
    price: 4.99,
    description: "Sweet potato fries with honey mustard sauce.",
    category: "side",
    extras: [],
  },
  {
    name: "Onion Rings",
    price: 5.99,
    description: "Crispy onion rings with ranch dressing.",
    category: "side",
    extras: [],
  },
  {
    name: "Coleslaw",
    price: 3.49,
    description: "Traditional coleslaw with cabbage and carrots.",
    category: "side",
    extras: [],
  },
  {
    name: "Baked Potato",
    price: 3.99,
    description: "Baked potato with butter and sour cream.",
    category: "side",
    extras: [],
  },
  {
    name: "Garlic Bread",
    price: 3.99,
    description: "Toasted bread with garlic butter.",
    category: "side",
    extras: [],
  },
  {
    name: "Mac and Cheese",
    price: 4.99,
    description: "Creamy macaroni and cheese.",
    category: "side",
    extras: [],
  },
  {
    name: "Cheesecake",
    price: 5.99,
    description: "Rich and creamy cheesecake with a graham cracker crust.",
    category: "dessert",
    extras: [],
  },
  {
    name: "Chocolate Cake",
    price: 6.49,
    description: "Decadent chocolate cake with chocolate ganache.",
    category: "dessert",
    extras: [],
  },
  {
    name: "Tiramisu",
    price: 6.99,
    description: "Classic Italian dessert with coffee-soaked ladyfingers.",
    category: "dessert",
    extras: [],
  },
  {
    name: "Ice Cream Sundae",
    price: 5.49,
    description: "Vanilla ice cream with chocolate syrup and whipped cream.",
    category: "dessert",
    extras: [],
  },
  {
    name: "Apple Pie",
    price: 5.99,
    description: "Classic apple pie with a flaky crust.",
    category: "dessert",
    extras: [],
  },
  {
    name: "Banana Split",
    price: 6.99,
    description: "Three scoops of ice cream with banana and toppings.",
    category: "dessert",
    extras: [],
  },
  {
    name: "Grilled Veggie Wrap",
    price: 10.99,
    description: "Wrap with grilled vegetables and hummus.",
    category: "main",
    extras: [],
  },
  {
    name: "Chicken Caesar Wrap",
    price: 11.99,
    description: "Wrap with grilled chicken and Caesar dressing.",
    category: "main",
    extras: [],
  },
  {
    name: "Mediterranean Salad",
    price: 7.99,
    description: "Salad with cucumber, tomato, and feta cheese.",
    category: "starter",
    extras: [],
  },
  {
    name: "Chicken Quesadilla",
    price: 11.49,
    description: "Grilled quesadilla with chicken and cheese.",
    category: "main",
    extras: [],
  },
  {
    name: "Beef Burrito",
    price: 11.99,
    description: "Burrito with seasoned beef and rice.",
    category: "main",
    extras: [],
  },
  {
    name: "Fish and Chips",
    price: 12.99,
    description: "Fried fish with French fries.",
    category: "main",
    extras: [],
  },
  {
    name: "Clam Chowder",
    price: 6.49,
    description: "Creamy clam chowder with potatoes.",
    category: "starter",
    extras: [],
  },
  {
    name: "Minestrone Soup",
    price: 5.99,
    description: "Traditional Italian soup with vegetables.",
    category: "starter",
    extras: [],
  },
  {
    name: "Tomato Soup",
    price: 4.99,
    description: "Rich tomato soup with a hint of basil.",
    category: "starter",
    extras: [],
  },
  {
    name: "Stuffed Mushrooms",
    price: 8.99,
    description: "Mushrooms stuffed with cheese and herbs.",
    category: "starter",
    extras: [],
  },
  {
    name: "Potato Skins",
    price: 7.99,
    description: "Potato skins with cheese and bacon.",
    category: "starter",
    extras: [],
  },
];

const importData = async () => {
  try {
    await BeverageModel.deleteMany();
    await FoodModel.deleteMany();
    // add data to mongoDB
    await BeverageModel.insertMany(beverages);
    await FoodModel.insertMany(foodItems);
    console.log("Data added sussessfully");
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// disconnect mongoDB
await importData();
await mongoose.disconnect();
