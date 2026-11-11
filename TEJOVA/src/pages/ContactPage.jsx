import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PageContainer } from "../components/layout/PageContainer";
import { SectionHeading } from "../components/common/SectionHeading";
import { Button } from "../components/common/Button";
import { Mail, MapPin, CheckCircle, Clock, UserCheck } from "lucide-react";
import { submitContactMessage, clearContactStatus } from "../Redux/slices/contactSlice";
import { fetchPublicSettings } from "../Redux/slices/settingsSlice";
import { fetchPageBySlug } from "../Redux/slices/contentSlice";
import DOMPurify from "dompurify";

export const ContactPage = () => {
  const dispatch = useDispatch();
  const { loading: contactLoading, successMessage, error: contactError } = useSelector(
    (state) => state.contact
  );
  const { publicSettings } = useSelector((state) => state.settings);
  const { pagesMap } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchPublicSettings());
    dispatch(fetchPageBySlug("contact"));
  }, [dispatch]);

  const contactCmsPage = pagesMap?.contact;

  // Official addresses and emails
  const conciergeEmail = publicSettings?.supportEmail || "concierge@tejova.com";
  const careEmail = publicSettings?.careEmail || "care@tejova.com";
  const address =
    publicSettings?.address ||
    "C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India";
  const hours = publicSettings?.businessHours?.mondayToFriday
    ? `Mon – Fri: ${publicSettings.businessHours.mondayToFriday}`
    : "Mon – Fri: 9:00 AM – 6:00 PM IST";

  // Dynamic CMS concierge section
  const conciergeSection = contactCmsPage?.sections?.find(
    (s) => s.sectionId === "sec_contact_concierge" && s.isVisible !== false
  );

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <SectionHeading
          subtitle={contactCmsPage?.hero?.subtitle || "GET IN TOUCH"}
          title={contactCmsPage?.hero?.title || "Connect With Our Sovereign Team"}
          description={
            contactCmsPage?.hero?.description ||
            "Have questions about our evidence-based nutritional protocols, time-restricted eating, or 1-on-1 consultations? We are here to support your journey."
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Contact Channels & Concierge Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Contact Channels */}
            <div className="bg-[#FAF9F6] p-7 sm:p-8 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 space-y-6 shadow-xs">
              <h3 className="font-serif text-2xl text-[#0A2342] font-medium">Reach Out Directly</h3>
              <p className="text-sm text-[#0A2342]/75 font-light leading-relaxed">
                Connect with our dedicated practice group for protocol inquiries, consultation scheduling, and logistical support.
              </p>

              <div className="space-y-4 pt-2 text-sm text-[#0A2342]">
                {/* Concierge Email */}
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#B87333] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#B87333] font-semibold block">
                      Concierge & Consultations
                    </span>
                    <a href={`mailto:${conciergeEmail}`} className="hover:text-[#B87333] font-medium transition-colors">
                      {conciergeEmail}
                    </a>
                    <span className="text-[11px] text-[#0A2342]/65 block font-light">
                      Private 1-on-1 assessments & executive advisory
                    </span>
                  </div>
                </div>

                {/* Client Care Email */}
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#B87333] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#B87333] font-semibold block">
                      Client Care & Support
                    </span>
                    <a href={`mailto:${careEmail}`} className="hover:text-[#B87333] font-medium transition-colors">
                      {careEmail}
                    </a>
                    <span className="text-[11px] text-[#0A2342]/65 block font-light">
                      Operations, orders & protocol delivery
                    </span>
                  </div>
                </div>

                {/* Official Address */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#B87333] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#B87333] font-semibold block">
                      Nagpur Center & Registered Office
                    </span>
                    <span className="leading-relaxed block font-medium">
                      {address}
                    </span>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#B87333] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#B87333] font-semibold block">
                      Operating Hours
                    </span>
                    <span className="leading-relaxed block">{hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Concierge Support Section (CMS sec_contact_concierge) */}
            <div className="bg-[#0A2342] text-white p-7 sm:p-8 rounded-xs border-l-4 border-l-[#D4AF37] border-y border-r border-[#B87333]/30 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block">
                  {conciergeSection?.subtitle || "CONCIERGE SUPPORT"}
                </span>
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-white font-medium leading-tight">
                {conciergeSection?.title || "Personal Consultations with Archana C Parate"}
              </h4>
              {conciergeSection?.content ? (
                <div
                  className="text-xs sm:text-sm text-white/85 font-light leading-relaxed space-y-2"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(conciergeSection.content) }}
                />
              ) : (
                <div className="text-xs sm:text-sm text-white/85 font-light leading-relaxed space-y-2">
                  <p>
                    Schedule a 1-on-1 virtual or in-person session with Archana C Parate and the Tejova Research &amp; Practice Group to tailor a personalized metabolic and dietary protocol for your biological goals.
                  </p>
                  <p className="text-[#D4AF37] font-medium pt-1">
                    Delivered directly to your registered email within 48 to 72 hours post-assessment.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Dynamic Formik Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF9F6] p-7 sm:p-10 md:p-12 rounded-xs border border-[#B87333]/30 shadow-xs">
            {successMessage ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#0A2342]/10 text-[#0A2342] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-[#B87333]" />
                </div>
                <h3 className="font-serif text-3xl text-[#0A2342] font-medium">Thank You for Reaching Out</h3>
                <p className="text-sm text-[#0A2342]/75 font-light max-w-md mx-auto leading-relaxed">
                  {successMessage}
                </p>
                <div className="pt-4">
                  <Button variant="secondary" onClick={() => dispatch(clearContactStatus())}>
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <Formik
                initialValues={{ name: "", email: "", phone: "", subject: "", message: "" }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name || values.name.trim() === "") {
                    errors.name = "Full name is required";
                  }
                  if (!values.email || values.email.trim() === "") {
                    errors.email = "Email address is required";
                  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                    errors.email = "Invalid email address";
                  }
                  if (!values.message || values.message.trim() === "") {
                    errors.message = "Message content is required";
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  dispatch(submitContactMessage(values)).then((res) => {
                    setSubmitting(false);
                    if (res && !res.error) {
                      resetForm();
                    }
                  });
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl text-[#0A2342] font-medium mb-1">
                        Send an Inquiry
                      </h3>
                      <p className="text-xs sm:text-sm text-[#0A2342]/70 font-light">
                        Direct your clinical advisory or operational inquiry to the Tejova practice group.
                      </p>
                    </div>

                    {contactError && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xs">
                        {contactError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2342] mb-2">
                          Your Name <span className="text-[#B87333]">*</span>
                        </label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="e.g. Elena Rostova"
                          className="w-full px-4 py-3 bg-white border border-[#B87333]/30 rounded-xs text-sm text-[#0A2342] placeholder-[#0A2342]/40 focus:outline-none focus:border-[#B87333] transition-colors"
                        />
                        <ErrorMessage name="name" component="div" className="text-xs text-red-500 mt-1" />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2342] mb-2">
                          Email Address <span className="text-[#B87333]">*</span>
                        </label>
                        <Field
                          type="email"
                          name="email"
                          placeholder="elena@example.com"
                          className="w-full px-4 py-3 bg-white border border-[#B87333]/30 rounded-xs text-sm text-[#0A2342] placeholder-[#0A2342]/40 focus:outline-none focus:border-[#B87333] transition-colors"
                        />
                        <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2342] mb-2">
                          Phone Number (Optional)
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          placeholder="+91 (0) 98765 43210"
                          className="w-full px-4 py-3 bg-white border border-[#B87333]/30 rounded-xs text-sm text-[#0A2342] placeholder-[#0A2342]/40 focus:outline-none focus:border-[#B87333] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2342] mb-2">
                          Subject / Inquiry Type
                        </label>
                        <Field
                          as="select"
                          name="subject"
                          className="w-full px-4 py-3 bg-white border border-[#B87333]/30 rounded-xs text-sm text-[#0A2342] focus:outline-none focus:border-[#B87333] transition-colors"
                        >
                          <option value="">Select Inquiry Topic</option>
                          <option value="1-on-1 Consultation with Archana C Parate">1-on-1 Consultation with Archana C Parate</option>
                          <option value="Nutritional & Metabolic Blueprint Guidance">Nutritional & Metabolic Blueprint Guidance</option>
                          <option value="Digital Protocol & Habit Guide Inquiries">Digital Protocol & Habit Guide Inquiries</option>
                          <option value="Operations & Support">Operations & Support</option>
                          <option value="Other">Other</option>
                        </Field>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2342] mb-2">
                        Message <span className="text-[#B87333]">*</span>
                      </label>
                      <Field
                        as="textarea"
                        name="message"
                        rows={5}
                        placeholder="Please describe your biological goals, lifestyle rhythms, or specific inquiry..."
                        className="w-full px-4 py-3 bg-white border border-[#B87333]/30 rounded-xs text-sm text-[#0A2342] placeholder-[#0A2342]/40 focus:outline-none focus:border-[#B87333] transition-colors"
                      />
                      <ErrorMessage name="message" component="div" className="text-xs text-red-500 mt-1" />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting || contactLoading}
                        icon
                      >
                        {isSubmitting || contactLoading ? "Submitting Inquiry..." : "Submit Inquiry"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
