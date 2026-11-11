import Settings from "../models/Settings.js";

/**
 * @desc    Get complete system settings (Admin)
 * @route   GET /api/settings
 * @access  Private/Admin
 */
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne().populate("updatedBy", "name email");

    if (!settings) {
      settings = await Settings.create({});
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update system settings (Admin)
 * @route   PATCH /api/settings
 * @access  Private/Admin
 */
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    const {
      general,
      appearance,
      notifications,
      businessHours,
      socialLinks,
      maintenanceMode,
    } = req.body;

    if (general) {
      settings.general = {
        ...settings.general?.toObject(),
        ...general,
      };
    }

    if (appearance) {
      settings.appearance = {
        ...settings.appearance?.toObject(),
        ...appearance,
      };
    }

    if (notifications) {
      settings.notifications = {
        ...settings.notifications?.toObject(),
        ...notifications,
      };
    }

    if (businessHours) {
      settings.businessHours = {
        ...settings.businessHours?.toObject(),
        ...businessHours,
      };
    }

    if (socialLinks) {
      settings.socialLinks = {
        ...settings.socialLinks?.toObject(),
        ...socialLinks,
      };
    }

    if (typeof maintenanceMode === "boolean") {
      settings.maintenanceMode = maintenanceMode;
    }

    settings.updatedBy = req.user._id;

    const updatedSettings = await settings.save();
    await updatedSettings.populate("updatedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get safe public configuration settings
 * @route   GET /api/settings/public
 * @access  Public
 */
export const getPublicSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    const publicData = {
      siteName: settings.general?.siteName || "TEJOVA VERIFIED",
      tagline: settings.general?.tagline || "Expand Your Light",
      supportEmail: settings.general?.supportEmail || "concierge@tejova.com",
      careEmail: settings.general?.careEmail || "care@tejova.com",
      contactPhone: settings.general?.contactPhone || "",
      address: settings.general?.address || "C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India",
      socialLinks: {
        facebook: settings.socialLinks?.facebook || "",
        instagram: settings.socialLinks?.instagram || "",
        youtube: settings.socialLinks?.youtube || "",
        linkedin: settings.socialLinks?.linkedin || "",
        twitter: settings.socialLinks?.twitter || "",
        pinterest: settings.socialLinks?.pinterest || "",
      },
      businessHours: settings.businessHours || {},
      maintenanceMode: settings.maintenanceMode || false,
    };

    return res.status(200).json({
      success: true,
      data: publicData,
    });
  } catch (error) {
    next(error);
  }
};
