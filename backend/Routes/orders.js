const express = require("express");
const mongoose = require("mongoose");
const { Order } = require("../Models/orders.js");
const router = express.Router();

// Post new order
// Create API
router.post("/create", async (req, res) => {
  try {
    const orderData = req.body.data;

    const newOrder = new Order({
      userID: orderData.userID,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      address: orderData.address,
      city: orderData.city,
      country: orderData.country,
      zipCode: orderData.zipCode,
      totalAmount: orderData.totalAmount,
      items: orderData.items, // Assuming items is an array of objects
      createdDate: orderData.createdDate || new Date(),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order saved to the database", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to save order to the database" });
  }
});

// Get orders by user ID
router.get("/:userId", async (req, res) => {
  const userID = req.params.userId;

  try {
    const orderList = await Order.find({ userID: userID });
    res.status(200).json(orderList);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders for the user" });
  }
});

module.exports = router;
