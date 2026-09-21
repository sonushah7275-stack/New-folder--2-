import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";
import { initialSiteContent } from "../../admin/data/contentData.js";

/**
 * Format raw content array from MongoDB into the structured siteContent object used by Content.jsx
 */
const formatContentForUI = (blocks = []) => {
  const merged = JSON.parse(JSON.stringify(initialSiteContent));

  blocks.forEach((block) => {
    if (!block || !block.key) return;
    const key = block.key.toUpperCase();

    try {
      let parsed = block.content;
      if (typeof parsed === "string" && (parsed.startsWith("{") || parsed.startsWith("["))) {
        parsed = JSON.parse(parsed);
      }

      if (key === "HERO") {
        if (typeof parsed === "object") merged.hero = { ...merged.hero, ...parsed };
        else if (block.title) merged.hero.headline = block.title;
      } else if (key === "ABOUT") {
        if (typeof parsed === "object") merged.about = { ...merged.about, ...parsed };
        else if (block.title) merged.about.title = block.title;
      } else if (key === "VITALITY_SECTION" || key === "VITALITY") {
        if (typeof parsed === "object") merged.vitalitySection = { ...merged.vitalitySection, ...parsed };
        else if (block.title) merged.vitalitySection.heading = block.title;
      } else if (key === "FOOTER") {
        if (typeof parsed === "object") merged.footer = { ...merged.footer, ...parsed };
        else if (block.title) merged.footer.copyrightText = block.title;
      } else if (key === "ANNOUNCEMENT") {
        if (typeof parsed === "string") merged.hero.announcementBar = parsed;
        else if (parsed?.announcementBar) merged.hero.announcementBar = parsed.announcementBar;
      }
    } catch (e) {
      // Fallback text
    }
  });

  return merged;
};

/**
 * Fetch all CMS content blocks
 * GET /api/content?all=true
 */
export const fetchContent = createAsyncThunk(
  "content/fetchContent",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/content", {
        params: { all: true, ...params },
      });
      const blocks = response.data?.data || [];
      const siteContent = formatContentForUI(blocks);

      return {
        blocks,
        siteContent,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch CMS content blocks.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Update or save a section content block
 * POST /api/content or PATCH /api/content/:id
 */
export const updateContentSection = createAsyncThunk(
  "content/updateContentSection",
  async ({ key, section, title, content, image }, { rejectWithValue, dispatch }) => {
    try {
      const normalizedKey = key.toUpperCase().trim();

      // Check if block already exists in list
      const checkRes = await api.get("/content", { params: { all: true } });
      const existing = (checkRes.data?.data || []).find(
        (b) => b.key.toUpperCase() === normalizedKey
      );

      const contentString = typeof content === "object" ? JSON.stringify(content) : String(content);

      if (existing) {
        await api.patch(`/content/${existing._id}`, {
          title: title || existing.title,
          content: contentString,
          section: section || existing.section,
          image: image !== undefined ? image : existing.image,
        });
      } else {
        await api.post("/content", {
          key: normalizedKey,
          title: title || normalizedKey,
          content: contentString,
          section: section || "general",
          image: image || "",
        });
      }

      dispatch(fetchContent());
      return { key, content };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update section content.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  blocks: [],
  siteContent: initialSiteContent,
  loading: false,
  saveLoading: false,
  error: null,
  successMessage: null,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    clearContentStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    updateLocalContentState: (state, action) => {
      state.siteContent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchContent
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.blocks = action.payload.blocks;
        state.siteContent = action.payload.siteContent;
        state.error = null;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateContentSection
      .addCase(updateContentSection.pending, (state) => {
        state.saveLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateContentSection.fulfilled, (state) => {
        state.saveLoading = false;
        state.successMessage = "Content section updated successfully!";
      })
      .addCase(updateContentSection.rejected, (state, action) => {
        state.saveLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContentStatus, updateLocalContentState } = contentSlice.actions;
export default contentSlice.reducer;
