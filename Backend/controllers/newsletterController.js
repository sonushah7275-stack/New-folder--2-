import mongoose from "mongoose";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

/**
 * Subscribe to newsletter
 * POST /api/newsletter/subscribe
 * Public
 */
export const subscribe = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let subscriber = await NewsletterSubscriber.findOne({ email: normalizedEmail });

    if (subscriber) {
      if (subscriber.isSubscribed) {
        return res.status(409).json({
          success: false,
          message: "This email is already subscribed to the TEJOVA newsletter.",
        });
      }

      // Re-subscribe previously unsubscribed email
      subscriber.isSubscribed = true;
      subscriber.subscribedAt = new Date();
      subscriber.unsubscribedAt = null;
      if (name) subscriber.name = name.trim();
      await subscriber.save();

      return res.status(200).json({
        success: true,
        message: "Welcome back! You have been re-subscribed to the newsletter.",
        data: {
          email: subscriber.email,
          isSubscribed: subscriber.isSubscribed,
        },
      });
    }

    subscriber = await NewsletterSubscriber.create({
      email: normalizedEmail,
      name: name ? name.trim() : "",
      isSubscribed: true,
      subscribedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for subscribing to the TEJOVA newsletter.",
      data: {
        email: subscriber.email,
        isSubscribed: subscriber.isSubscribed,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unsubscribe from newsletter
 * POST /api/newsletter/unsubscribe
 * Public
 */
export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const subscriber = await NewsletterSubscriber.findOne({ email: normalizedEmail });

    if (!subscriber || !subscriber.isSubscribed) {
      return res.status(404).json({
        success: false,
        message: "Email address is not currently subscribed.",
      });
    }

    subscriber.isSubscribed = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return res.status(200).json({
      success: true,
      message: "You have been successfully unsubscribed from the TEJOVA newsletter.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all newsletter subscribers
 * GET /api/newsletter
 * Protected: Admin Only
 */
export const getSubscribers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;
    const query = {};

    if (status === "subscribed") query.isSubscribed = true;
    if (status === "unsubscribed") query.isSubscribed = false;

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const total = await NewsletterSubscriber.countDocuments(query);
    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete newsletter subscriber record
 * DELETE /api/newsletter/:id
 * Protected: Admin Only
 */
export const deleteSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Subscriber ID format.",
      });
    }

    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscriber record deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
