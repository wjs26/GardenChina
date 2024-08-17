import PouchDB from 'pouchdb';

// Initialize the database
const initdb = async (dbname) => {
    const db = new PouchDB(dbname);

    try {
        await db.get("menu");
    } catch (e) {
        await db.put({ _id: "menu", items: [] });
    }

    try {
        await db.get("orders");
    } catch (e) {
        await db.put({ _id: "orders", orders: [] });
    }

    try {
        await db.get("profiles");
    } catch (e) {
        await db.put({ _id: "profiles", profiles: [] });
    }

    try {
        await db.get("cart");
    } catch (e) {
        await db.put({ _id: "cart", items: [] });
    }

    await db.close();
};

// Create a database instance
const Database = async (dbname) => {
    await initdb(dbname);

    const getDB = () => new PouchDB(dbname);

    return {
        // Save cart items (update entire cart)
        saveCartItems: async (items) => {
            try {
                const db = getDB();
                const cartDoc = await db.get("cart");
                cartDoc.items = items;  // Replace the entire items array
                await db.put(cartDoc);
                await db.close();
                return { status: "success" };
            } catch (e) {
                return { status: "error", message: "Failed to save cart items", error: e.message };
            }
        },

        // Get all cart items
        getCartItems: async () => {
            try {
                const db = getDB();
                const cartDoc = await db.get("cart");
                await db.close();
                return { status: "success", data: cartDoc.items };
            } catch (e) {
                return { status: "error", message: "Failed to retrieve cart items", error: e.message };
            }
        },

        // Update a cart item (quantity)
        updateCartItem: async (itemName, newQuantity) => {
            try {
                const db = getDB();
                const cartDoc = await db.get("cart");
                const item = cartDoc.items.find(item => item.name === itemName);

                if (item) {
                    item.quantity = newQuantity;
                    await db.put(cartDoc);
                    await db.close();
                    return { status: "success" };
                } else {
                    return { status: "error", message: "Item not found in cart" };
                }
            } catch (e) {
                return { status: "error", message: "Failed to update cart item", error: e.message };
            }
        },

        // Delete a cart item
        deleteCartItem: async (itemName) => {
            try {
                const db = getDB();
                const cartDoc = await db.get("cart");
                cartDoc.items = cartDoc.items.filter(item => item.name !== itemName);
                await db.put(cartDoc);
                await db.close();
                return { status: "success" };
            } catch (e) {
                return { status: "error", message: "Failed to delete cart item", error: e.message };
            }
        }
    };
};

export default Database;