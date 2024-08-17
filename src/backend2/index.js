import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from './database.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Add or update a cart item
app.post('/cartItem', async (req, res) => {
    try {
        const { name, quantity, price } = req.query;

        if (!name || !quantity || !price) {
            return res.status(400).json({ error: "Missing required parameters: 'name', 'quantity', and 'price' are required." });
        }

        const database = await Database("garden_china");
        const cart = await database.getCartItems();

        let itemUpdated = false;
        cart.data = cart.data.map(item => {
            if (item.name === name) {
                item.quantity += parseInt(quantity, 10); // Increment quantity
                itemUpdated = true;
            }
            return item;
        });

        if (!itemUpdated) {
            cart.data.push({ name, quantity: parseInt(quantity, 10), price: parseFloat(price) });
        }

        const result = await database.saveCartItems(cart.data);

        if (result.status === "success") {
            res.sendStatus(200);
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        console.error("Error occurred while adding/updating item in cart:", error);
        res.status(500).json({ error: "Failed to add/update item in cart. Please try again later." });
    }
});

// Get all cart items
app.get('/cartItems', async (req, res) => {
    try {
        const database = await Database("garden_china");
        const result = await database.getCartItems();

        if (result.status === "success") {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        console.error("Error occurred while retrieving cart items:", error);
        res.status(500).json({ error: "Failed to retrieve cart items. Please try again later." });
    }
});

// Update a cart item
app.put('/cartItem', async (req, res) => {
    try {
        const { name, quantity } = req.query;

        if (!name || !quantity) {
            return res.status(400).json({ error: "Missing required parameters: 'name' and 'quantity' are required." });
        }

        const database = await Database("garden_china");
        const result = await database.updateCartItem(name, parseInt(quantity, 10));

        if (result.status === "success") {
            res.sendStatus(200);
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        console.error("Error occurred while updating cart item:", error);
        res.status(500).json({ error: "Failed to update cart item. Please try again later." });
    }
});

// Delete a cart item
app.delete('/cartItem', async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: "Missing required parameter: 'name' is required." });
        }

        const database = await Database("garden_china");
        const result = await database.deleteCartItem(name);

        if (result.status === "success") {
            res.sendStatus(200);
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        console.error("Error occurred while deleting cart item:", error);
        res.status(500).json({ error: "Failed to delete cart item. Please try again later." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});