import mongoose from "mongoose"; // Import mongoose as default
import { MenuItem } from "../models/menuItems.js"; // Adjust the path based on your project structure

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://remoomakram1:DjvIQ9cY00PWmYNA@cluster0.1uhdj.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const createMenuItems = async () => {
  const categoryId = "673aa3ca2ec0391c1ef199c9";

  const menuItems = [
    {
      name: "DÖNERTASCHE",
      description: "mit Dönerfleisch, Salat u. Soße",
      price: 8.0,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "MINI DÖNER",
      description: "mit Dönerfleisch, Salat u. Soße",
      price: 6.5,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "JUMBO DÖNER",
      description: "mit Dönerfleisch, Salat u. Soße",
      price: 9.0,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "CHEESY DÖNER",
      description:
        "mit Dönerfleisch, gebackenem Käse, Salat u. Hollandaise Soße",
      price: 9.0,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "CHILI CHEESE DÖNER",
      description: "mit Dönerfleisch, Salat, Jalapeno u. Chili Cheese Soße",
      price: 9.0,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "HAWAII DÖNER",
      description: "mit Dönerfleisch, Ananas, Salat u. Soße",
      price: 8.5,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "DÜRÜM DÖNER",
      description: "Teigrolle mit Dönerfleisch, Salat u. Soße",
      price: 8.5,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "DÜRÜM CHEESY",
      description:
        "Teigrolle mit Dönerfleisch, gebackenem Käse, Salat u. Hollandaise Soße",
      price: 9.5,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "DÖNER BOX",
      description: "mit Dönerfleisch, Pommes o. Reis, Salat u. Soße",
      price: 8.5,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "SUCUK DÖNER",
      description: "mit Dönerfleisch, Sucuk, Salat u. Soße",
      price: 9.0,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "DÖNER TELLER KLEIN",
      description: "mit Dönerfleisch, Pommes o. Reis, Salat u. Soße",
      price: 12.0,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "DÖNER TELLER GROSS",
      description: "mit Dönerfleisch, Pommes o. Reis, Salat u. Soße",
      price: 15.0,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
    {
      name: "DÖNER TELLER CHEESY",
      description:
        "mit Dönerfleisch, gebackenem Käse, Pommes o. Reis, Salat u. Hollandaise Soße",
      price: 16.0,
      extraIngredientPrice: [
        {
          name: "mit geriebenem",
          price: 1,
        },
      ],
    },
  ];

  try {
    for (const item of menuItems) {
      await MenuItem.create({
        name: item.name,
        description: item.description,
        category: categoryId,
        price: item.price,
        image: "",
        sizes: [],
        extraIngredientPrice: [],
      });
    }
    console.log("Menu items added successfully");
  } catch (error) {
    console.error("Error adding menu items:", error);
  }
};

// Run the script
(async () => {
  await connectToDatabase();
  await createMenuItems();
  mongoose.connection.close();
})();
