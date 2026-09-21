import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slices/adminAuthSlice.js";
import adminDashboardReducer from "./slices/adminDashboardSlice.js";
import adminProductReducer from "./slices/adminProductSlice.js";
import adminCategoryReducer from "./slices/adminCategorySlice.js";
import adminOrderReducer from "./slices/adminOrderSlice.js";
import customerReducer from "./slices/customerSlice.js";
import journalReducer from "./slices/journalSlice.js";
import pillarReducer from "./slices/pillarSlice.js";
import newsletterReducer from "./slices/newsletterSlice.js";
import contactReducer from "./slices/contactSlice.js";
import mediaReducer from "./slices/mediaSlice.js";
import contentReducer from "./slices/contentSlice.js";
import settingsReducer from "./slices/settingsSlice.js";

/**
 * Centralized Redux Store for TEJOVA Admin Dashboard
 */
export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    adminDashboard: adminDashboardReducer,
    adminProducts: adminProductReducer,
    adminCategories: adminCategoryReducer,
    adminOrders: adminOrderReducer,
    adminCustomers: customerReducer,
    customers: customerReducer,
    adminJournal: journalReducer,
    journal: journalReducer,
    adminPillar: pillarReducer,
    pillar: pillarReducer,
    adminNewsletter: newsletterReducer,
    newsletter: newsletterReducer,
    adminContact: contactReducer,
    contact: contactReducer,
    adminMedia: mediaReducer,
    media: mediaReducer,
    adminContent: contentReducer,
    content: contentReducer,
    adminSettings: settingsReducer,
    settings: settingsReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;
