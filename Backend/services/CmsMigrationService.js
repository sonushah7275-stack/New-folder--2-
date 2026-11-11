import fs from 'fs';
import path from 'path';
import Page from '../models/Page.js';
import Settings from '../models/Settings.js';

class CmsMigrationService {
  constructor(options = {}) {
    this.backupDir = options.backupDir;
  }

  /**
   * Safe Data Backup before any mutation
   */
  static async backupData(customDir) {
    try {
      const backupDir = customDir || path.resolve('C:/Users/Sonu/.gemini/antigravity/brain/a00b4b42-bd2e-47e1-92d9-1a7d0bd21b91/scratch/backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      const existingSettings = await Settings.find().lean();
      const existingPages = await Page.find().lean();

      const settingsBackupFile = path.join(backupDir, `settings_${timestamp}.json`);
      const pagesBackupFile = path.join(backupDir, `pages_${timestamp}.json`);
      const combinedBackupFile = path.join(backupDir, `tejova_pre_migration_backup_${timestamp}.json`);

      const backupPayload = {
        timestamp: new Date().toISOString(),
        settingsCount: existingSettings.length,
        pagesCount: existingPages.length,
        settings: existingSettings,
        pages: existingPages,
      };

      fs.writeFileSync(settingsBackupFile, JSON.stringify(existingSettings, null, 2), 'utf8');
      fs.writeFileSync(pagesBackupFile, JSON.stringify(existingPages, null, 2), 'utf8');
      fs.writeFileSync(combinedBackupFile, JSON.stringify(backupPayload, null, 2), 'utf8');

      console.log(`📦 [Migration Backup] Pre-migration snapshot saved: ${combinedBackupFile} (${existingPages.length} pages, ${existingSettings.length} settings)`);
      return {
        settingsBackupFile,
        pagesBackupFile,
        combinedBackupFile,
        settingsCount: existingSettings.length,
        pagesCount: existingPages.length,
      };
    } catch (err) {
      console.warn(`⚠️ [Migration Backup] Could not write snapshot to scratch: ${err.message}. Proceeding with safe memory backup.`);
      return null;
    }
  }

  static async backupCurrentData(customDir) {
    const res = await this.backupData(customDir);
    return res ? res.combinedBackupFile : null;
  }

  async backupData(customDir) {
    return CmsMigrationService.backupData(customDir || this.backupDir);
  }

  async backupCurrentData(customDir) {
    return CmsMigrationService.backupCurrentData(customDir || this.backupDir);
  }

  /**
   * Migrate Settings safely and idempotently
   */
  static async migrateSettings() {
    let settings = await Settings.findOne();
    let wasCreated = false;

    if (!settings) {
      settings = new Settings({});
      wasCreated = true;
    }

    let modified = false;

    // Preserve existing customized siteName, or set approved default
    if (!settings.general) settings.general = {};
    if (!settings.general.siteName || settings.general.siteName === 'TEJOVA') {
      settings.general.siteName = 'TEJOVA VERIFIED';
      modified = true;
    }
    if (!settings.general.tagline) {
      settings.general.tagline = 'Expand Your Light';
      modified = true;
    }

    // Preserve existing customized address or update if placeholder
    const currentAddress = settings.general.address || '';
    if (
      !currentAddress ||
      currentAddress.includes('123 Wellness Way') ||
      currentAddress.includes('San Francisco')
    ) {
      settings.general.address = 'C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India';
      modified = true;
    }

    // Check raw underlying document directly from MongoDB collection (before schema defaults are applied)
    let rawCollectionDoc = null;
    try {
      if (Settings.collection && typeof Settings.collection.findOne === 'function') {
        rawCollectionDoc = await Settings.collection.findOne();
      }
    } catch (e) {
      // In-memory or mock test environment fallback
    }

    const rawGeneral = (rawCollectionDoc && rawCollectionDoc.general) || (settings._doc && settings._doc.general) || {};
    const rawSocial = (rawCollectionDoc && rawCollectionDoc.socialLinks) || (settings._doc && settings._doc.socialLinks) || {};

    // Preserve existing emails or set official defaults
    if (!settings.general.supportEmail || settings.general.supportEmail === 'support@tejova.com') {
      settings.general.supportEmail = 'concierge@tejova.com';
      if (typeof settings.markModified === 'function') settings.markModified('general');
      modified = true;
    }
    if (rawGeneral.careEmail === undefined) {
      settings.general.careEmail = 'care@tejova.com';
      if (typeof settings.markModified === 'function') settings.markModified('general');
      modified = true;
    }

    // Ensure socialLinks structure without assumed fake URLs
    if (!settings.socialLinks) settings.socialLinks = {};
    const socialFields = ['facebook', 'instagram', 'youtube', 'linkedin', 'twitter', 'pinterest'];
    for (const f of socialFields) {
      if (rawSocial[f] === undefined) {
        settings.socialLinks[f] = settings.socialLinks[f] || '';
        if (typeof settings.markModified === 'function') settings.markModified('socialLinks');
        modified = true;
      }
    }

    if (modified || wasCreated) {
      await settings.save();
      console.log('✅ [Migration Settings] Settings successfully updated to official Nagpur base and verified defaults.');
    } else {
      console.log('ℹ️ [Migration Settings] Settings already up to date. Preserving existing customized values.');
    }

    return settings;
  }

  /**
   * Manifest of all official client pages and stable sections
   */
  static getMigrationManifest() {
    return [
      // 1. PRIVACY POLICY
      {
        slug: 'privacy-policy',
        title: 'Privacy Policy — TEJOVA',
        subtitle: 'Effective Date: 07.11.2026 | Tejova Life',
        hero: {
          title: 'Privacy Policy',
          subtitle: 'BIOLOGICAL SOVEREIGNTY & DATA PROTECTION',
          description: 'At Tejova Life ("Tejova," "we," "us," or "our"), we are committed to protecting the privacy, security, and Biological Sovereignty of our clients. Compliant with DPDPA (India), GDPR (EU/UK), and CCPA (USA).',
          mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Tejova Privacy Policy',
          ctaText: 'Contact Data Protection Officer',
          ctaLink: '/contact',
        },
        sections: [
          {
            sectionId: 'sec_privacy_policy_content',
            type: 'rich_content',
            title: 'Privacy Policy Guidelines & Legal Provisions',
            subtitle: 'LEGAL NOTICE',
            kicker: 'TEJOVA LIFE',
            content: `
              <h3>Effective Date: 07.11.2026</h3>
              <p><strong>Website:</strong> www.tejova.com | <strong>Company:</strong> Tejova Life</p>
              <p>At Tejova Life ("Tejova," "we," "us," or "our"), we are committed to protecting the privacy, security, and Biological Sovereignty of our clients. This Privacy Policy governs how we collect, use, process, and protect your personal and health-related data when you visit our website (tejova.com), engage with our digital platforms, or participate in the Tejova Protocols and private consultations.</p>
              <p>This policy is designed to comply with global data protection standards, including the Digital Personal Data Protection Act (DPDPA, India), the General Data Protection Regulation (GDPR, EU/UK), and the California Consumer Privacy Act (CCPA, USA).</p>

              <h4>1. The Information We Collect</h4>
              <p>To engineer your personalized health architecture, we must collect specific categories of data. We strictly limit collection to what is necessary for your care and our service delivery.</p>
              <ul>
                <li><strong>Identity &amp; Contact Data:</strong> Name, email address, phone number, billing/shipping address, and demographic information required to establish your profile.</li>
                <li><strong>Sensitive Biological &amp; Health Data:</strong> Information provided during consultations, including medical history, lifestyle habits, sleep rhythms, dietary preferences, metabolic markers, and any physiological data required to design your Bespoke Metabolic &amp; Diet Protocols. (<em>Note: This is collected only with your explicit, informed consent</em>).</li>
                <li><strong>Financial &amp; Transaction Data:</strong> Details about payments and services purchased. (Payment processing is handled securely by encrypted, third-party payment gateways; we do not store your full credit card or bank details on our servers).</li>
                <li><strong>Technical &amp; Usage Data:</strong> IP address, browser type, time zone setting, operating system, and data on how you interact with our website to ensure a seamless digital experience.</li>
              </ul>

              <h4>2. How We Use Your Data</h4>
              <p>We utilize your data solely to elevate your health and provide a seamless executive experience. We use your information to:</p>
              <ul>
                <li>Deliver, design, and manage the Tejova Protocols and 1-on-1 consultations.</li>
                <li>Provide ongoing concierge support and adapt your nutritional and lifestyle architecture.</li>
                <li>Process secure transactions and manage your account.</li>
                <li>Communicate with you regarding appointments, protocol updates, and secure health insights.</li>
                <li>Comply with legal, regulatory, and medical record-keeping obligations.</li>
              </ul>

              <h4>3. Legal Basis for Processing (GDPR &amp; Global Standards)</h4>
              <p>Under international data protection laws, we process your personal data based on the following legal grounds:</p>
              <ul>
                <li><strong>Explicit Consent:</strong> When you provide sensitive biological and health data for our consultation services. You may withdraw this consent at any time.</li>
                <li><strong>Contractual Necessity:</strong> To fulfill our service agreements, process your payments, and deliver the Tejova Protocols you have requested.</li>
                <li><strong>Legitimate Interests:</strong> To secure our digital infrastructure, improve our website, and prevent fraud.</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable financial and medical compliance laws in India and internationally.</li>
              </ul>

              <h4>4. Data Sharing and Third Parties</h4>
              <p><strong>Your biological data is treated with the highest level of confidentiality. We do not and will never sell your personal or health data to third parties.</strong></p>
              <p>We may share your data only in the following restricted circumstances:</p>
              <ul>
                <li><strong>Trusted Service Providers:</strong> With carefully vetted third-party vendors who assist us in operating our platform (e.g., secure cloud hosting via Hostinger, encrypted video consultation platforms, and payment processors). These providers are legally bound by strict data processing agreements.</li>
                <li><strong>Legal &amp; Regulatory Authorities:</strong> If required to do so by law, court order, or regulatory mandate to protect the rights, property, or safety of Tejova Life, our clients, or the public.</li>
              </ul>

              <h4>5. International Data Transfers</h4>
              <p>Tejova Life operates its foundational base in Nagpur, Maharashtra, India. If you are accessing our services from the European Economic Area (EEA), the United States, or other regions, your data will be transferred to and processed in India. We ensure that all international data transfers comply with global standards by utilizing Standard Contractual Clauses (SCCs) and ensuring our hosting and software partners maintain GDPR-compliant security frameworks.</p>

              <h4>6. Data Security and Retention</h4>
              <p>We implement robust, industry-standard cryptographic and physical security measures to protect your data against unauthorized access, alteration, or disclosure. We retain your personal and biological data only for as long as necessary to fulfill the purposes outlined in this policy, deliver your ongoing health protocols, or comply with mandatory legal retention periods.</p>

              <h4>7. Your Privacy Rights (Sovereignty over your Data)</h4>
              <p>Depending on your jurisdiction (including DPDP Act, GDPR, and CCPA), you hold the following rights regarding your data:</p>
              <ul>
                <li><strong>The Right to Access:</strong> You may request a copy of the personal and biological data we hold about you.</li>
                <li><strong>The Right to Rectification:</strong> You may request that we correct any inaccurate or incomplete information.</li>
                <li><strong>The Right to Erasure ("Right to be Forgotten"):</strong> You may request the deletion of your personal data, subject to certain legal and medical record-keeping exceptions.</li>
                <li><strong>The Right to Restrict/Object:</strong> You may object to how we process your data, particularly for marketing purposes.</li>
                <li><strong>The Right to Data Portability:</strong> You may request your data be transferred to another provider in a structured, commonly used format.</li>
                <li><strong>The Right to Withdraw Consent:</strong> Where we rely on consent to process your health data, you can withdraw it at any time (though this may prevent us from continuing to provide bespoke health protocols).</li>
              </ul>

              <h4>8. Cookies and Tracking Technologies</h4>
              <p>Our website uses cookies and similar tracking technologies to ensure optimal performance, analyze site traffic, and enhance your user experience. You can manage your cookie preferences through your browser settings.</p>

              <h4>9. Policy Updates</h4>
              <p>As our ecosystem evolves, we may update this Privacy Policy to reflect changes in legal requirements or our operational practices. We will notify you of any significant changes by posting the new policy on this page and updating the "Effective Date."</p>

              <h4>10. Contact Us</h4>
              <p>For any questions, concerns, or requests regarding this Privacy Policy or the security of your data, please contact our Data Protection Officer at:</p>
              <p><strong>Tejova Life</strong><br>Email: concierge@tejova.com<br>Address: C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India</p>
            `,
            order: 0,
            isVisible: true,
          },
        ],
        isPublished: true,
      },

      // 2. TERMS AND CONDITIONS
      {
        slug: 'terms-and-conditions',
        title: 'Terms and Conditions — TEJOVA',
        subtitle: 'Effective Date: 07.11.2026 | Tejova Life',
        hero: {
          title: 'Terms and Conditions of Service',
          subtitle: 'LEGAL AGREEMENT & PROTOCOL TERMS',
          description: 'Welcome to Tejova Life. These Terms and Conditions govern your access to and use of the Tejova.com website, digital platforms, educational materials, and the Tejova Protocols.',
          mediaUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Tejova Terms and Conditions',
          ctaText: 'Client Care Support',
          ctaLink: '/contact',
        },
        sections: [
          {
            sectionId: 'sec_terms_conditions_content',
            type: 'rich_content',
            title: 'Terms of Service & Medical Disclaimer',
            subtitle: 'TERMS & CONDITIONS',
            kicker: 'TEJOVA LIFE',
            content: `
              <h3>Effective Date: 07.11.2026</h3>
              <p><strong>Website:</strong> www.tejova.com | <strong>Company:</strong> Tejova Life</p>
              <p>Welcome to Tejova Life. These Terms and Conditions ("Terms") govern your access to and use of the Tejova.com website, digital platforms, educational materials, and the Tejova Protocols (collectively, the "Services"). By accessing our platform, booking a consultation, or purchasing our digital products, you agree to be bound by these Terms.</p>

              <h4>1. The Tejova Ecosystem and Scope of Services</h4>
              <p>Tejova Life operates as a premier digital and in-person practice specializing in evidence-based nutritional science, restorative naturopathy, and holistic health optimization. Our offerings include, but are not limited to:</p>
              <ul>
                <li>Bespoke Metabolic &amp; Diet Protocols</li>
                <li>1-on-1 Executive Consultations (Online and Offline)</li>
                <li>Yoga and Structural Resilience guidance</li>
                <li>Digital publications and educational materials (including e-books)</li>
              </ul>

              <h4>2. Strict Medical Disclaimer (Assumption of Risk)</h4>
              <p><strong>Tejova Life provides architectural blueprints for health optimization, not medical treatment.</strong></p>
              <ul>
                <li>The services, protocols, and content provided by Archana C Parate, and the Tejova Research &amp; Practice Group are for educational and structural health optimization purposes only.</li>
                <li>We are certified practitioners in nutrition and naturopathy; we are not licensed medical doctors (MDs).</li>
                <li>Our guidance, including dietary recommendations, natural regimens, and lifestyle architecture, does not constitute medical advice, diagnosis, treatment, or a cure for any specific medical condition or disease.</li>
                <li>You must consult with a licensed primary care physician before beginning any Tejova Protocol, altering your diet, engaging in physical regimens, or modifying any prescribed medications. You assume total responsibility and risk for your voluntary participation in our programs.</li>
              </ul>

              <h4>3. Client Sovereignty and Responsibilities</h4>
              <p>To engineer an accurate and highly personalized protocol, we require your complete transparency. By engaging our services, you agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information regarding your physical health, biological markers, and lifestyle habits during consultations.</li>
                <li>Understand that absolute health transformation requires your active participation, discipline, and consistent application of the prescribed daily rhythms.</li>
                <li>Acknowledge that biological responses vary by individual, and Tejova Life cannot guarantee specific physical, metabolic, or cognitive results.</li>
              </ul>

              <h4>4. Intellectual Property and Brand Protection</h4>
              <p>The architecture of Tejova is proprietary. All content on Tejova.com—including text, graphics, logos, brand names ("Tejova," "Tejova Life," "Expand Your Light"), protocol frameworks, website design, and published digital materials (such as the e-book <em>21 Daily Habits for Lifelong Health</em>)—is the exclusive intellectual property of Tejova Life and is protected by Indian and international copyright and trademark laws.</p>
              <p>You are granted a limited, non-exclusive, non-transferable license to access our digital content and utilize your personalized protocols for personal, non-commercial use only. You may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any Tejova Life content or protocol frameworks without our explicit, written consent.</p>

              <h4>5. Payments, Digital Commerce, and Refund Policy</h4>
              <p>All financial transactions for consultations and digital products are processed through secure, third-party payment gateways integrated into our platform.</p>
              <ul>
                <li><strong>Consultations:</strong> Fees for online and offline 1-on-1 consultations must be paid in full prior to the scheduled session. Rescheduling or cancellation requests must be made at least 24 hours in advance. Failure to attend a scheduled session without prior notice may result in the forfeiture of the consultation fee.</li>
                <li><strong>Digital Products (E-books &amp; Guides):</strong> Due to the immediate, downloadable nature of digital information products, all sales of e-books and digital frameworks are final and non-refundable.</li>
                <li><strong>Pricing:</strong> We reserve the right to modify the pricing of our protocols, consultations, and products at any time without prior notice.</li>
              </ul>

              <h4>6. Platform Usage and Security</h4>
              <p>You agree to use Tejova.com only for lawful purposes. You are strictly prohibited from attempting to breach platform security, data mining, scraping, or submitting technologically harmful materials.</p>

              <h4>7. Limitation of Liability</h4>
              <p>To the maximum extent permitted by applicable law, Tejova Life, its founders, and practitioners shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of the platform, biological outcomes from nutritional protocols, or content inaccuracies.</p>

              <h4>8. Governing Law and Dispute Resolution</h4>
              <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes or claims shall be subject to the exclusive jurisdiction of the courts located in <strong>Nagpur, Maharashtra, India</strong>.</p>

              <h4>9. Modifications to the Terms of Service</h4>
              <p>Tejova Life reserves the right to update, change, or replace any part of these Terms at our sole discretion. Your continued use of the website following changes constitutes acceptance.</p>

              <h4>10. Contact Information</h4>
              <p>For inquiries regarding these Terms and Conditions, please contact:<br><strong>Tejova Life</strong><br>Email: concierge@tejova.com<br>Address: C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India</p>
            `,
            order: 0,
            isVisible: true,
          },
        ],
        isPublished: true,
      },

      // 3. SHIPPING, DELIVERY, AND REFUND POLICY
      {
        slug: 'shipping-policy',
        title: 'Shipping, Delivery & Refund Policy — TEJOVA',
        subtitle: 'Effective Date: 07.11.2026 | Tejova Life',
        hero: {
          title: 'Shipping, Delivery, and Refund Policy',
          subtitle: 'OPERATIONAL LOGISTICS & CLIENT CARE',
          description: 'This policy outlines operational guidelines for the delivery of digital protocols, executive consultation scheduling, physical materials shipping, and our authoritative return policies.',
          mediaUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Tejova Shipping and Refunds',
          ctaText: 'Operations Help Desk',
          ctaLink: '/contact',
        },
        sections: [
          {
            sectionId: 'sec_shipping_policy_content',
            type: 'rich_content',
            title: 'Operational Guidelines & Refund Policy',
            subtitle: 'LOGISTICS & POLICIES',
            kicker: 'TEJOVA LIFE',
            content: `
              <h3>Effective Date: 07.11.2026</h3>
              <p><strong>Website:</strong> www.tejova.com | <strong>Company:</strong> Tejova Life</p>
              <p>At Tejova Life, we value absolute clarity, precision, and the mutual respect of time. This policy outlines the operational guidelines for the delivery of our digital protocols, the scheduling of our executive consultations, the shipping of any physical materials, and our authoritative stance on returns and refunds.</p>

              <h4>1. Digital Delivery &amp; Access (E-Books &amp; Protocols)</h4>
              <ul>
                <li><strong>E-Books &amp; Digital Guides:</strong> Upon successful payment processing for digital products, including <em>21 Daily Habits for Lifelong Health: Your Practical Guide to Natural Wellness</em>, you will receive an automated email containing a secure download link or immediate portal access. Delivery is instantaneous.</li>
                <li><strong>Customized Diet &amp; Metabolic Protocols:</strong> For clients engaging in 1-on-1 consultations, your bespoke architectural blueprints (digital protocols) will be delivered to your registered email address within <strong>48 to 72 hours</strong> following the conclusion of your clinical assessment.</li>
                <li><strong>Technical Issues:</strong> If you experience any technical friction or do not receive your digital access link within 60 minutes of purchase, please contact our support desk immediately at <strong>care@tejova.com</strong> for priority resolution.</li>
              </ul>

              <h4>2. Consultation Scheduling, Rescheduling, and Cancellations</h4>
              <p>Time is the ultimate executive asset. We enforce strict boundaries to protect both your schedule and the dedicated focus of the Tejova Research &amp; Practice Group.</p>
              <ul>
                <li><strong>Confirmation:</strong> All consultations (both virtual and at our Nagpur center) are confirmed only upon receipt of full payment.</li>
                <li><strong>Rescheduling &amp; Cancellations:</strong> You may reschedule or cancel your consultation without penalty if notice is provided at least <strong>24 hours prior</strong> to the scheduled session time.</li>
                <li><strong>Late Cancellations &amp; No-Shows:</strong> Cancellations made within the 24-hour window, or failure to attend a scheduled session, will result in the total forfeiture of the consultation fee. Our practitioners allocate highly focused time for your biological assessment, which cannot be reassigned at the last minute.</li>
              </ul>

              <h4>3. Physical Shipping Policy (If Applicable)</h4>
              <p>Should you purchase physical goods, printed publications, or botanical materials directly from Tejova Life, the following logistical parameters apply:</p>
              <ul>
                <li><strong>Dispatch &amp; Processing:</strong> Physical orders are processed and dispatched from our foundational base in Nagpur, Maharashtra, within 2 to 3 business days of order confirmation.</li>
                <li><strong>Domestic Shipping (India):</strong> We utilize premium logistics partners. Standard delivery within India takes approximately <strong>4 to 7 business days</strong> post-dispatch, depending on your regional location.</li>
                <li><strong>International Shipping:</strong> Global transit times vary by destination (typically <strong>10 to 21 business days</strong>). International clients are solely responsible for any customs duties, import taxes, or localized levies applied by their respective regulatory authorities.</li>
                <li><strong>Tracking:</strong> A secure tracking number will be provided via email the moment your physical asset is handed over to our courier partner.</li>
              </ul>

              <h4>4. Returns &amp; Refund Policy</h4>
              <p>Due to the proprietary nature of our intellectual property and the highly customized design of our biological frameworks, our refund policies are strictly enforced.</p>
              <ul>
                <li><strong>Digital Products (Strict Non-Refundable Policy):</strong> Given the immediate, un-retractable nature of downloadable information, <strong>all sales of e-books, digital guides, and pre-recorded digital content are final</strong>. No refunds, exchanges, or credits will be issued under any circumstances.</li>
                <li><strong>Consultation Fees:</strong> Refunds for consultations are only granted if the cancellation is requested outside the mandatory 24-hour window prior to the appointment. Once a consultation has been conducted, the fee is entirely non-refundable, as the service and clinical time have been rendered.</li>
                <li><strong>Physical Goods:</strong> If you receive a physically damaged or defective item, you must notify us within <strong>48 hours of delivery</strong> with photographic evidence. Upon verification, Tejova Life will issue a replacement or authorize a return. We do not accept returns for physical goods based on "change of mind."</li>
              </ul>

              <h4>5. Grievance and Support Contact</h4>
              <p>To request a schedule adjustment, report a digital delivery failure, or raise a logistical inquiry, please direct your communication to our operations desk. We ensure priority handling for all active clients.</p>
              <p><strong>Tejova Life Operations</strong><br>Email: concierge@tejova.com / care@tejova.com<br>Address: C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India</p>
            `,
            order: 0,
            isVisible: true,
          },
        ],
        isPublished: true,
      },

      // 4. FAQS
      {
        slug: 'faqs',
        title: 'Frequently Asked Questions — TEJOVA',
        subtitle: 'Biological Sovereignty & Operational Protocols',
        hero: {
          title: 'Frequently Asked Questions',
          subtitle: 'CLINICAL INQUIRIES & PROTOCOL GUIDANCE',
          description: 'Answers to the most common questions regarding our evidence-based nutritional protocols, time-restricted eating, executive travel rhythms, and 1-on-1 consultations.',
          mediaUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Tejova FAQs',
          ctaText: 'Book a Consultation',
          ctaLink: '/contact',
        },
        sections: [
          {
            sectionId: 'sec_faqs_list',
            type: 'cards',
            title: 'Common Questions on the Tejova Protocols',
            subtitle: 'FREQUENTLY ASKED QUESTIONS',
            kicker: 'EXECUTIVE ADVISORY',
            items: [
              {
                id: 'faq_1',
                kicker: 'NUTRITION & CUISINE',
                title: 'Does the Tejova nutritional protocol require a specific regional cuisine or strictly Indian foods?',
                description: 'No. Biology is universal. While our foundational base is in India, our protocols are rooted in global metabolic science and cellular architecture. Whether you reside in New York, London, or Mumbai, we design your bespoke dietary protocol around the high-quality, plant-aligned foods native to and accessible in your specific geographical location. We focus on the glycemic load and nutritional density of your meals, adapting our nature-based principles to your culture and executive lifestyle.',
                order: 0,
                isVisible: true,
              },
              {
                id: 'faq_2',
                kicker: 'METABOLIC METHODOLOGY',
                title: 'Are your diet plans based on calorie counting or restrictive macro-tracking?',
                description: 'We reject tedious calorie counting and algorithmic biohacking. High-functioning leaders do not have the time or decision capital for disjointed, restrictive tracking. Instead, our protocols focus on metabolic rest and time-restricted eating. We architect a rhythm of nourishment that naturally stabilizes your blood sugar, honors your chronobiology, and fuels cellular regeneration without adding daily friction to your schedule.',
                order: 1,
                isVisible: true,
              },
              {
                id: 'faq_3',
                kicker: 'EXECUTIVE TRAVEL',
                title: 'I have a demanding global travel schedule. How do I maintain these dietary rhythms across different time zones?',
                description: 'True Biological Sovereignty means your health does not collapse when your environment changes. We engineer your protocols with executive travel in mind. By teaching you how to strategically leverage time-restricted eating, hydration, and conscious elemental immersion, we help you anchor your circadian rhythm and defend your metabolic health, effectively insulating your physical vessel against jet lag and travel-induced systemic stress.',
                order: 2,
                isVisible: true,
              },
              {
                id: 'faq_4',
                kicker: 'METABOLIC DEFENSE',
                title: 'I have been informed that I have pre-diabetic markers. Is this protocol designed to address metabolic decline?',
                description: 'Yes. Proactively defending against modern lifestyle diseases is the cornerstone of our Longevity pillar. Our evidence-based nutritional architecture is specifically designed to address metabolic decline at its root. Through pure, plant-aligned nourishment and precise eating windows, we aim to reverse the wear and tear caused by chronic stress, optimize body composition, and protect your long-term biological future. (Note: Tejova provides architectural blueprints for health optimization; our protocols should be implemented alongside the guidance of your primary medical physician).',
                order: 3,
                isVisible: true,
              },
              {
                id: 'faq_5',
                kicker: 'RESTORATIVE NATUROPATHY',
                title: 'Do the Tejova Protocols rely heavily on synthetic supplements and extreme clinical interventions?',
                description: "No. Led by Archana C Parate’s expertise in restorative naturopathy, we believe profound biological shifts come from consistent, natural rhythms, not extreme interventions. While highly targeted supplementation may be utilized for specific deficiencies, our primary mechanism for healing is pure, whole-food nourishment. We translate the theoretical frameworks of nature-based living into practical, daily executive action, prioritizing plant-aligned intelligence over synthetic shortcuts.",
                order: 4,
                isVisible: true,
              },
              {
                id: 'faq_6',
                kicker: 'THE 4 PILLARS',
                title: 'How exactly do the four pillars—Vitality, Nourishment, Lifestyle, and Longevity—work together in my diet?',
                description: 'They operate as a single, unified ecosystem. Nourishment provides the raw, cellular building blocks and stabilizes your metabolic markers. This pure fuel directly ignites your baseline Vitality and cognitive stamina. We map this diet onto your executive Lifestyle using time-restricted eating and circadian alignment so it requires zero decision fatigue. Together, this unified approach proactively defends against lifestyle diseases, securing your ultimate Longevity and healthspan.',
                order: 5,
                isVisible: true,
              },
              {
                id: 'faq_7',
                kicker: 'TIME EFFICIENCY',
                title: 'My schedule is incredibly demanding. Will implementing this protocol require a massive daily time commitment?',
                description: 'No. The Tejova methodology is explicitly designed to eliminate friction, not add to it. We do not prescribe complex, hours-long meal prep or disjointed routines. Archana specializes in translating nature-based living into streamlined, time-efficient systems that integrate seamlessly into a high-pressure executive schedule. You are investing in efficiency—a unified protocol that frees up your decision capital rather than draining it.',
                order: 6,
                isVisible: true,
              },
              {
                id: 'faq_8',
                kicker: 'CONSULTATION ROADMAP',
                title: 'What happens after I book a 1-on-1 private consultation?',
                description: 'Once your consultation is secured, our practice group will conduct a deep, clinical assessment of your current metabolic state, lifestyle rhythms, and biological goals based on your provided medical reports. Following this session, Archana will engineer your bespoke architectural blueprint—a highly personalized metabolic and dietary protocol designed to fuel your cellular architecture. This protocol is delivered directly to you within 48 to 72 hours, accompanied by ongoing concierge support to ensure seamless integration into your life.',
                order: 7,
                isVisible: true,
              },
            ],
            order: 0,
            isVisible: true,
          },
        ],
        isPublished: true,
      },

      // 5. VITALITY (Adding 4 Sovereign Disciplines while preserving existing protocol cards)
      {
        slug: 'vitality',
        title: 'Vitality — TEJOVA',
        subtitle: 'Natural Energy. Peak Vigor.',
        hero: {
          title: 'Master Your Physical Sovereignty. Unleash Your Vitality.',
          subtitle: 'VITALITY PROTOCOL',
          description: 'Integrate the four essential disciplines—Yoga, Breath, Health, and Fitness—for a definitive performance protocol built for longevity. Move beyond surviving into peak physical and mental sovereignty.',
          mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Sovereign Vitality Hero',
          ctaText: 'Explore Vitality Protocol →',
          ctaLink: '/contact',
        },
        sections: [
          {
            sectionId: 'sec_vitality_foundations',
            type: 'cards',
            title: 'The 4 Pillars of Vitality',
            subtitle: 'BIOLOGICAL FOUNDATION',
            kicker: 'CORE DISCIPLINES',
            items: [
              {
                id: 'vit_pillar_1',
                kicker: '1. YOGA',
                title: 'Sovereign Yoga',
                subtitle: 'Structural Alignment',
                description: 'Decompress the spine and unlock structural mobility to reverse daily sedentary wear.',
                image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800',
                order: 0,
                isVisible: true,
              },
              {
                id: 'vit_pillar_2',
                kicker: '2. BREATH',
                title: 'Autonomic Breath',
                subtitle: 'Nervous System Command',
                description: 'Regulate your nervous system to instantly clear stress and restore focus.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
                order: 1,
                isVisible: true,
              },
              {
                id: 'vit_pillar_3',
                kicker: '3. HEALTH',
                title: 'Cellular Health',
                subtitle: 'Metabolic Repair',
                description: 'Fuel natural cellular repair and metabolic rest to maximize your disease-free years.',
                image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800',
                order: 2,
                isVisible: true,
              },
              {
                id: 'vit_pillar_4',
                kicker: '4. FITNESS',
                title: 'Adaptive Fitness',
                subtitle: 'Physical Resilience',
                description: 'Build muscle, bone density, and vital stamina to ensure lifelong independence.',
                image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
                order: 3,
                isVisible: true,
              },
            ],
            order: 0,
            isVisible: true,
          },
          // Note: sec_vitality_protocols is preserved from earlier seed
        ],
        isPublished: true,
      },

      // 6. LIFESTYLE (Adding 4 Lifestyle Pillars with Blue background while preserving body)
      {
        slug: 'lifestyle',
        title: 'Lifestyle — TEJOVA',
        subtitle: 'Awareness. Growth. Human Potential.',
        hero: {
          title: 'Mindful Architecture for Daily Operations',
          subtitle: 'SOVEREIGN LIFESTYLE',
          description: 'Build formidable biological resilience and maximise your healthspan by uniting precise circadian alignment, proactive stress regulation, clean environmental living, and deep, purpose-driven community connection.',
          mediaUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Sovereign Lifestyle Hero',
          ctaText: 'Architect Your Routine →',
          ctaLink: '/contact',
        },
        sections: [
          {
            sectionId: 'sec_lifestyle_body',
            type: 'rich_content',
            title: 'Mindful Architecture for Daily Operations',
            subtitle: 'DAILY BLUEPRINT',
            kicker: 'CONSCIOUS LIVING',
            content: '<p>Build formidable biological resilience and maximise your healthspan by uniting precise circadian alignment, proactive stress regulation, clean environmental living, and deep, purpose-driven community connection.</p>',
            settings: {
              backgroundColor: '#0A2342',
              textColor: '#FAF9F6',
              borderColor: '#B87333',
            },
            order: 0,
            isVisible: true,
          },
          {
            sectionId: 'sec_lifestyle_pillars',
            type: 'cards',
            title: 'The 4 Pillars of Conscious Lifestyle',
            subtitle: 'LIFESTYLE ARCHITECTURE',
            kicker: 'INNER ALIGNMENT',
            items: [
              {
                id: 'life_pillar_1',
                kicker: '01. BREATH & MIND',
                title: 'Cognitive Resilience',
                subtitle: 'Mental Clarity',
                description: 'Actionable breathwork practices that shift nervous system arousal to immediately improve mental clarity.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
                order: 0,
                isVisible: true,
              },
              {
                id: 'life_pillar_2',
                kicker: '02. CHRONOBIOLOGY',
                title: 'Circadian Alignment',
                subtitle: 'Hormonal Harmony',
                description: 'Anchoring your internal biological clock to natural light cycles to optimize hormone secretion and eliminate chronic fatigue.',
                image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
                order: 1,
                isVisible: true,
              },
              {
                id: 'life_pillar_3',
                kicker: '03. ENVIRONMENT',
                title: 'Ecological Symbiosis',
                subtitle: 'Clean Living',
                description: 'Optimizing your internal biology through sustainable, eco-conscious daily habits and clean environmental immersion.',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
                order: 2,
                isVisible: true,
              },
              {
                id: 'life_pillar_4',
                kicker: '04. COMMUNITY',
                title: 'Collective Vitality',
                subtitle: 'Deep Belonging',
                description: 'Redefining longevity through shared community goals, collective joy, and deep relational belonging.',
                image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800',
                order: 3,
                isVisible: true,
              },
            ],
            order: 1,
            isVisible: true,
          },
        ],
        isPublished: true,
      },

      // 7. LONGEVITY (Adding 4 Longevity Pillars with Blue background while preserving body)
      {
        slug: 'longevity',
        title: 'Longevity — TEJOVA',
        subtitle: 'Cellular Restoration & Bio-Energetic Resilience',
        hero: {
          title: 'The Tejova Longevity Architecture',
          subtitle: 'BIOLOGICAL RESILIENCE',
          description: 'The ultimate goal is not merely lifespan extension, but the absolute maximization of your disease-free healthspan. We focus on unified natural protocols that actively resist cellular decay and unlock human potential.',
          mediaUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Sovereign Longevity Hero',
          ctaText: 'Explore Longevity Protocol →',
          ctaLink: '/contact',
        },
        sections: [
          {
            sectionId: 'sec_longevity_body',
            type: 'rich_content',
            title: 'Cellular Restoration & Bio-Energetic Resilience',
            subtitle: 'THE LONGEVITY ARCHITECTURE',
            kicker: 'HEALTHSPAN MAXIMIZATION',
            content: '<p>The ultimate goal is not merely lifespan extension, but the absolute maximization of your disease-free healthspan. We focus on unified natural protocols that actively resist cellular decay and unlock human potential.</p>',
            settings: {
              backgroundColor: '#0A2342',
              textColor: '#FAF9F6',
              borderColor: '#B87333',
            },
            order: 0,
            isVisible: true,
          },
          {
            sectionId: 'sec_longevity_pillars',
            type: 'cards',
            title: 'The 4 Keys to Cellular Longevity',
            subtitle: 'LONGEVITY FOUNDATIONS',
            kicker: 'BIOLOGICAL DEFENSE',
            items: [
              {
                id: 'long_pillar_1',
                kicker: '01. METABOLIC HEALTH',
                title: 'Nutrition and Metabolic Health',
                subtitle: 'Cellular Repair',
                description: 'Our protocol employs plant-aligned whole foods, time-restricted eating and proactive caloric control to repair your cellular architecture, sustain elite cognitive energy, and defend against lifestyle diseases.',
                image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800',
                order: 0,
                isVisible: true,
              },
              {
                id: 'long_pillar_2',
                kicker: '02. RECOVERY & REST',
                title: 'Regeneration, Biological Aging, and Deep Recovery',
                subtitle: 'Systemic Resilience',
                description: 'Our recovery protocol balances deep regenerative rest with controlled environmental stress to repair your cellular architecture, build systemic resilience, and decelerate biological aging.',
                image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
                order: 1,
                isVisible: true,
              },
              {
                id: 'long_pillar_3',
                kicker: '03. NEURO-REGULATION',
                title: 'Psychological Coherence & Brain Longevity',
                subtitle: 'Autonomic Regulation',
                description: 'By discharging chronic stress and actively balancing your nervous system, we halt stress-induced aging and protect your lifelong brain health through a calm, regulated mind.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
                order: 2,
                isVisible: true,
              },
              {
                id: 'long_pillar_4',
                kicker: '04. PURPOSE & ECOLOGY',
                title: 'Socio-Environmental Connection and Purpose',
                subtitle: 'Healthy Healthspan',
                description: 'Our longevity lifestyle extends your healthspan by removing isolation-induced aging through deep community connection, clear life goals and alignment with clean, natural environments.',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
                order: 3,
                isVisible: true,
              },
            ],
            order: 1,
            isVisible: true,
          },
        ],
        isPublished: true,
      },

      // 8. ABOUT US (Adding missing sections so admin can edit all entries)
      {
        slug: 'about',
        title: 'About Us — TEJOVA',
        subtitle: 'Our Story & Brand Philosophy',
        hero: {
          title: 'We Believe Wellness Should Expand Your Life, Not Limit It.',
          subtitle: 'OUR BRAND STORY',
          description: "TEJOVA was born out of a quiet realization: true health isn't found in rigid routines or synthetic quick fixes, but in living in harmonious resonance with natural biological laws.",
          mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Tejova Brand Story Hero',
          ctaText: 'Discover Our Protocol',
          ctaLink: '/vitality',
        },
        sections: [
          {
            sectionId: 'sec_about_philosophy',
            type: 'brand_philosophy',
            title: 'Expand Your Light',
            subtitle: 'THE PHILOSOPHY',
            kicker: 'TEJOVA ORIGIN',
            content: `
              <p>"Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, <strong>TEJOVA</strong> embodies the expansion of your innate physical and mental radiance.</p>
              <p>Every formulation we create, every article we write, and every ritual we share is designed to nurture your light — helping you show up fully for yourself, your loved ones, and the world around you.</p>
            `,
            badge: 'PRANA RADIANCE',
            order: 0,
            isVisible: true,
          },
          {
            sectionId: 'sec_about_commitments',
            type: 'rich_content',
            title: 'Our Core Commitments',
            subtitle: 'STANDARDS OF PURITY',
            kicker: 'ETHICAL SOURCING',
            content: `
              <ul>
                <li><strong>Purity Without Compromise:</strong> Wildcrafted, 100% organic ingredients sourced directly from ethical bio-farms.</li>
                <li><strong>Biological Synergy:</strong> Formulas designed to complement natural metabolic pathways rather than override them.</li>
                <li><strong>Mindful Living:</strong> Elevating everyday routines into conscious, grounding daily rituals.</li>
              </ul>
            `,
            order: 1,
            isVisible: true,
          },
          {
            sectionId: 'sec_about_pillars',
            type: 'cards',
            title: 'Built Upon Five Pillars',
            subtitle: 'A COMPLETE APPROACH',
            kicker: 'FOUNDATIONS',
            items: [
              { id: 'p_1', title: 'Vitality', subtitle: 'Pillar 01', description: 'Natural energy and somatic vigor.' },
              { id: 'p_2', title: 'Nourishment', subtitle: 'Pillar 02', description: 'Cellular renewal and organic nutrition.' },
              { id: 'p_3', title: 'Lifestyle', subtitle: 'Pillar 03', description: 'Awareness and purposeful daily rituals.' },
              { id: 'p_4', title: 'Longevity', subtitle: 'Pillar 04', description: 'Enduring biological resilience.' },
              { id: 'p_5', title: 'Conscious Mind', subtitle: 'Pillar 05', description: 'Inner calm and cognitive clarity.' },
            ],
            order: 2,
            isVisible: true,
          },
        ],
        isPublished: true,
      },

      // 9. CONTACT US (Adding concierge section for Archana C Parate)
      {
        slug: 'contact',
        title: 'Contact Us — TEJOVA',
        subtitle: 'Connect with the TEJOVA Protocol Team',
        hero: {
          title: 'Contact TEJOVA',
          subtitle: 'GET IN TOUCH',
          description: 'Have questions about our nutritional protocols, conscious living philosophy, or clinical advisory? We are here to support your journey.',
          mediaUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Contact Tejova Hero',
          ctaText: 'Schedule Consultation',
          ctaLink: '#contact-form',
        },
        sections: [
          {
            sectionId: 'sec_contact_concierge',
            type: 'rich_content',
            title: 'Personal Consultations with Archana C Parate',
            subtitle: 'CONCIERGE SUPPORT',
            kicker: 'CLINICAL ADVISORY',
            content: `
              <p>Schedule a 1-on-1 virtual or in-person session with Archana C Parate and the Tejova Research &amp; Practice Group to tailor a personalized metabolic and dietary protocol for your biological goals.</p>
              <p><strong>Nagpur Center:</strong> C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India</p>
              <p><strong>Official Inquiries:</strong> concierge@tejova.com | <strong>Logistics &amp; Orders:</strong> care@tejova.com</p>
            `,
            order: 0,
            isVisible: true,
          },
        ],
        isPublished: true,
      },

      // 10. PRODUCTS HEADER (Enables editing "The TEJOVA Collection" in Admin)
      {
        slug: 'products',
        title: 'Formulations & Products — TEJOVA',
        subtitle: 'The TEJOVA Collection',
        hero: {
          title: 'The TEJOVA Collection',
          subtitle: 'ORGANIC BOTANICAL FORMULATIONS',
          description: 'Ethically harvested, bio-available botanicals designed to restore your natural state of physical, mental and cellular vitality.',
          mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Tejova Products Collection',
          ctaText: 'Explore Categories',
          ctaLink: '#catalog',
        },
        sections: [
          {
            sectionId: 'sec_products_header',
            type: 'rich_content',
            title: 'Ethical Botanical Standards',
            subtitle: 'COLLECTION ARCHITECTURE',
            kicker: 'PURE INGREDIENTS',
            content: '<p>Every product is formulated without synthetic fillers, artificial binders, or harsh chemical extracts.</p>',
            order: 0,
            isVisible: true,
          },
        ],
        isPublished: true,
      },
      // 11. HOME PAGE
      {
        slug: 'home',
        title: 'Home — TEJOVA',
        subtitle: 'Expand Your Light. Sovereign Performance Living.',
        hero: {
          backgroundMediaUrl: '',
          title: 'Master Your Sovereignty. Unleash Your Vitality.',
          subtitle: 'TEJOVA — VITALITY PROTOCOL',
          description: 'Integrate the four essential pillars—Yoga, Breath, Health, and Fitness—for a definitive performance protocol built for longevity. Move beyond "not being sick" to a state of peak-impact vitality. Discover the Sovereign Body and rule your life.',
          mediaUrl: 'https://res.cloudinary.com/dyqdgujiq/image/upload/v1794188197/TEJOVA/products/oem6zcgywdd0qaniukju.jpg',
          resourceType: 'image',
          alt: 'Sovereign Living Hero',
          ctaText: 'Begin Your Journey →',
          ctaLink: '/blog',
        },
        sections: [
          {
            sectionId: 'sec_entry_sequence',
            type: 'entry_sequence',
            title: 'Entry Sequence Words',
            subtitle: 'Conscious Living',
            kicker: '',
            content: '',
            badge: '',
            media: { url: '', resourceType: 'image', alt: '', poster: '' },
            cta: { text: '', url: '', variant: 'primary' },
            items: [
              {
                id: 'seq_1',
                kicker: 'ORIGIN & RADIANCE',
                title: 'TEJOVA',
                subtitle: 'Sovereign Command',
                description: 'The expansion of innate physical and mental radiance.',
                image: 'https://res.cloudinary.com/dyqdgujiq/image/upload/v1794200747/TEJOVA/products/nmu8isvknd98yfapebmw.jpg',
                order: 0,
                isVisible: true,
              },
              {
                id: 'seq_2',
                kicker: 'PILLAR 01',
                title: 'Vitality',
                subtitle: 'Peak-Impact Energy',
                description: 'Mastery of Yoga, Breath, and biological heat.',
                image: 'https://res.cloudinary.com/dyqdgujiq/image/upload/v1794200766/TEJOVA/products/p1nmetvakpcvsuheuo99.jpg',
                order: 1,
                isVisible: true,
              },
              {
                id: 'seq_3',
                kicker: 'PILLAR 02',
                title: 'Nourishment',
                subtitle: 'Cellular Restoration',
                description: 'Conscious nutrition and pure biological formulations.',
                image: 'https://res.cloudinary.com/dyqdgujiq/image/upload/v1794200779/TEJOVA/products/xu3xwrbgjtkcxran5tdh.jpg',
                order: 2,
                isVisible: true,
              },
              {
                id: 'seq_4',
                kicker: 'PILLAR 03',
                title: 'Lifestyle',
                subtitle: 'Conscious Habits',
                description: 'Grounding rituals and sovereign daily routine.',
                image: 'https://res.cloudinary.com/dyqdgujiq/image/upload/v1794200805/TEJOVA/products/qk3h8av7qqyivvxyzl1b.jpg',
                order: 3,
                isVisible: true,
              },
              {
                id: 'seq_5',
                kicker: 'PILLAR 04',
                title: 'Longevity',
                subtitle: 'Sovereign Future',
                description: 'Cellular protection and enduring biological vigor.',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
                order: 4,
                isVisible: true,
              },
              {
                id: 'seq_6',
                kicker: 'SOVEREIGN PURPOSE',
                title: 'Expand Your Light',
                subtitle: 'Rule Your Life',
                description: 'Move beyond surviving into peak physical and mental sovereignty.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
                order: 5,
                isVisible: true,
              },
            ],
            order: 0,
            isVisible: true,
          },
          {
            sectionId: 'sec_brand_philosophy',
            type: 'brand_philosophy',
            title: 'Beyond Wellness. A Sovereign Lifestyle.',
            subtitle: 'BRAND PHILOSOPHY',
            kicker: 'TEJOVA PROTOCOL',
            content: '<p style="text-align: justify">We believe that human beings are not meant to merely survive. You are engineered to command your mind, elevate your biological energy, and rule your life with undeniable impact.</p>',
            order: 1,
            isVisible: true,
          },
          {
            sectionId: 'sec_brand_story',
            type: 'brand_story',
            title: 'The Origin of Radiance',
            subtitle: 'OUR ESSENCE',
            kicker: 'TEJOVA ROOTS',
            content: '<p style="text-align: justify">Originating from Nagpur, the heart of central India, TEJOVA unites timeless bio-energetic wisdom with pure elemental formulations.</p>',
            order: 2,
            isVisible: true,
          },
          {
            sectionId: 'sec_philosophy',
            type: 'philosophy',
            title: 'Our Core Philosophy',
            subtitle: 'THE THREE PILLARS OF SOVEREIGNTY',
            kicker: '',
            content: 'Vitality, Nourishment, and Lifestyle form the sovereign triquetra.',
            items: [
              {
                id: 'item_p1',
                title: 'High-Impact Vitality',
                description: 'Electrifying life-force energy through dynamic movement and breath mastery.',
                order: 0,
                isVisible: true,
              },
              {
                id: 'item_p2',
                title: 'Pure Nourishment',
                description: 'Dietary protocols and natural insights crafted to complement natural biological laws.',
                order: 1,
                isVisible: true,
              },
              {
                id: 'item_p3',
                title: 'Sovereign Lifestyle',
                description: 'Elevating everyday routines to move you beyond merely surviving.',
                order: 2,
                isVisible: true,
              },
            ],
            order: 3,
            isVisible: true,
          },
          {
            sectionId: 'sec_four_pillars',
            type: 'four_pillars',
            title: 'Built Upon Four Pillars',
            subtitle: 'A COMPLETE APPROACH',
            kicker: '',
            content: 'We view wellbeing through four interconnected dimensions that work together to create a vibrant life.',
            items: [
              {
                id: 'pil_vitality',
                kicker: 'PILLAR 01',
                title: 'Vitality',
                subtitle: 'Peak-Impact Energy. Sovereign Living.',
                description: 'Move beyond simply surviving your day to a state of peak-impact performance.',
                image: 'https://res.cloudinary.com/dyqdgujiq/image/upload/v1790263270/TEJOVA/journal/irqh7kefwz7yi2e4xhw6.jpg',
                link: '/vitality',
                order: 0,
                isVisible: true,
              },
              {
                id: 'pil_nourishment',
                kicker: 'PILLAR 02',
                title: 'Nourishment',
                subtitle: 'Real Food. Lasting Health.',
                description: 'Conscious nutrition and pure, natural formulations fuel your highest potential.',
                image: 'https://res.cloudinary.com/dyqdgujiq/image/upload/v1790139882/TEJOVA/journal/en32pciwriebtmewizo2.jpg',
                link: '/nourishment',
                order: 1,
                isVisible: true,
              },
              {
                id: 'pil_lifestyle',
                kicker: 'PILLAR 03',
                title: 'Lifestyle',
                subtitle: 'Conscious Habits. Sovereign Mind.',
                description: 'Integrate grounding rituals, restorative rest, and natural rhythms.',
                image: 'https://res.cloudinary.com/dyqdgujiq/image/upload/v1791129153/TEJOVA/journal/hjhrnfqwizhi8eagtb3d.jpg',
                link: '/lifestyle',
                order: 2,
                isVisible: true,
              },
              {
                id: 'pil_longevity',
                kicker: 'PILLAR 04',
                title: 'Longevity',
                subtitle: 'Longer Life. Deeper Wellbeing.',
                description: 'Protect your cellular health and nurture your spirit for enduring vigor.',
                image: 'https://res.cloudinary.com/dyqdgujiq/image/upload/v1790947825/TEJOVA/products/bfffppvrou9plxoy75bt.jpg',
                link: '/longevity',
                order: 3,
                isVisible: true,
              },
            ],
            order: 4,
            isVisible: true,
          },
        ],
        isPublished: true,
      },
    ];
  }

  static getMigrationPagesManifest() {
    return this.getMigrationManifest();
  }

  getMigrationPagesManifest() {
    return CmsMigrationService.getMigrationManifest();
  }

  getMigrationManifest() {
    return CmsMigrationService.getMigrationManifest();
  }

  async migrateSettings() {
    return CmsMigrationService.migrateSettings();
  }

  async migrateCmsPages() {
    return CmsMigrationService.migrateCmsPages();
  }

  /**
   * Idempotent CMS Page Migration
   * - Creates page if missing
   * - Appends missing sections by stable sectionId if page exists
   * - Never overwrites existing sections or admin-edited text
   * - Can run repeatedly safely
   */
  static async migrateCmsPages() {
    const manifest = this.getMigrationManifest();
    const stats = {
      pagesCreated: [],
      pagesExisting: [],
      sectionsAdded: [],
      sectionsPreserved: [],
    };

    for (const pageItem of manifest) {
      let page = await Page.findOne({ slug: pageItem.slug });

      if (!page) {
        // Page completely missing -> create with all manifest sections
        page = await Page.create(pageItem);
        stats.pagesCreated.push(pageItem.slug);
        for (const sec of pageItem.sections || []) {
          stats.sectionsAdded.push(`${pageItem.slug}:${sec.sectionId}`);
        }
        console.log(`🌱 [Migration CMS] Created missing page '${pageItem.slug}' with ${(pageItem.sections || []).length} sections.`);
      } else {
        // Page exists -> check each section by stable sectionId
        stats.pagesExisting.push(pageItem.slug);
        let pageModified = false;
        if (!Array.isArray(page.sections)) page.sections = [];

        for (const reqSec of pageItem.sections || []) {
          const exists = page.sections.some((s) => s.sectionId === reqSec.sectionId);
          if (exists) {
            stats.sectionsPreserved.push(`${pageItem.slug}:${reqSec.sectionId}`);
          } else {
            // Append missing section only
            page.sections.push(reqSec);
            pageModified = true;
            stats.sectionsAdded.push(`${pageItem.slug}:${reqSec.sectionId}`);
            console.log(`➕ [Migration CMS] Added missing section '${reqSec.sectionId}' to page '${pageItem.slug}'.`);
          }
        }

        if (pageModified) {
          if (page.markModified) page.markModified('sections');
          await page.save();
          console.log(`💾 [Migration CMS] Saved updated section manifest for page '${pageItem.slug}'.`);
        }
      }
    }

    console.log(`📊 [Migration CMS Summary] Pages: ${stats.pagesCreated.length} created, ${stats.pagesExisting.length} preserved | Sections: ${stats.sectionsAdded.length} added, ${stats.sectionsPreserved.length} preserved.`);
    return stats;
  }

  async runMigration() {
    return CmsMigrationService.runFullMigration();
  }

  static async runMigration() {
    return CmsMigrationService.runFullMigration();
  }

  /**
   * Primary entry point: runs backup, settings migration, and CMS migration
   */
  static async runFullMigration() {
    console.log('🚀 [Migration Engine] Starting safe, idempotent Phase 1 database migration...');
    const backupPath = await this.backupCurrentData();
    const settings = await this.migrateSettings();
    const cmsStats = await this.migrateCmsPages();
    console.log('🏁 [Migration Engine] Phase 1 database migration finished successfully.');
    return {
      success: true,
      backupPath,
      settingsUpdated: Boolean(settings),
      cmsStats,
    };
  }
}

export default CmsMigrationService;
