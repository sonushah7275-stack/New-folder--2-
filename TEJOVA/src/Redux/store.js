import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import productReducer from "./slices/productSlice.js";
import categoryReducer from "./slices/categorySlice.js";
import journalReducer from "./slices/journalSlice.js";
import pillarReducer from "./slices/pillarSlice.js";
import contentReducer from "./slices/contentSlice.js";
import settingsReducer from "./slices/settingsSlice.js";
import contactReducer from "./slices/contactSlice.js";
import newsletterReducer from "./slices/newsletterSlice.js";

/**
 * Centralized Redux Store for TEJOVA Public Frontend
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    products: productReducer,
    category: categoryReducer,
    categories: categoryReducer,
    journal: journalReducer,
    pillar: pillarReducer,
    pillars: pillarReducer,
    content: contentReducer,
    settings: settingsReducer,
    contact: contactReducer,
    newsletter: newsletterReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;
