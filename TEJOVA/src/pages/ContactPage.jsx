import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { Mail, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <SectionHeading
          subtitle="Get in Touch"
          title="Contact TEJOVA"
          description="Have questions about our botanical formulations, conscious living philosophy, or order guidance? We are here to support your journey."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-xs border border-gray-200/80 space-y-6">
              <h3 className="font-serif text-2xl text-[#1F4D3B]">Reach Out Directly</h3>
              <p className="text-sm text-[#687280] font-light leading-relaxed">
                Our client care team is available Monday through Friday to guide you through product selections and botanical wellness inquiries.
              </p>

              <div className="space-y-4 pt-2 text-sm text-[#1F4D3B]">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#668F6B]" />
                  <span>care@tejova.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#668F6B]" />
                  <span>+1 (800) 555-TEJOVA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#668F6B]" />
                  <span>San Francisco, CA • Zurich, Switzerland</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#668F6B]" />
                  <span>Mon – Fri: 9:00 AM – 6:00 PM EST</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1F4D3B] text-white p-8 rounded-xs space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#A7B99F] font-semibold block">Concierge Support</span>
              <h4 className="font-serif text-xl">Personal Botanical Consultations</h4>
              <p className="text-xs text-white/80 font-light leading-relaxed">
                Schedule a 1-on-1 virtual session with our certified herbalists to tailor a personalized daily ritual for your unique biological goals.
              </p>
            </div>
          </div>

          {/* Formik Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-xs border border-gray-200/80 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1F4D3B]/10 text-[#1F4D3B] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl text-[#1F4D3B]">Thank You for Reaching Out</h3>
                <p className="text-sm text-[#687280] font-light max-w-md mx-auto leading-relaxed">
                  We have received your message. A member of our TEJOVA wellness care team will respond to your email within 24 hours.
                </p>
                <div className="pt-4">
                  <Button variant="secondary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <Formik
                initialValues={{ name: '', email: '', subject: '', message: '' }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) errors.name = 'Full name is required';
                  if (!values.email) {
                    errors.email = 'Email address is required';
                  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                    errors.email = 'Invalid email address';
                  }
                  if (!values.message) errors.message = 'Message content is required';
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    setSubmitted(true);
                    setSubmitting(false);
                  }, 400);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <h3 className="font-serif text-2xl text-[#1F4D3B] mb-2">Send Us a Message</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                          Your Full Name *
                        </label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="e.g. Maya Lin"
                          className="w-full px-4 py-3 bg-[#FAF8F3] border border-gray-300 rounded-xs text-sm text-[#1F1F1F] focus:outline-none focus:border-[#1F4D3B]"
                        />
                        <ErrorMessage name="name" component="div" className="text-xs text-red-600 mt-1 font-light" />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Field
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 bg-[#FAF8F3] border border-gray-300 rounded-xs text-sm text-[#1F1F1F] focus:outline-none focus:border-[#1F4D3B]"
                        />
                        <ErrorMessage name="email" component="div" className="text-xs text-red-600 mt-1 font-light" />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                        Subject
                      </label>
                      <Field
                        type="text"
                        name="subject"
                        placeholder="Inquiry regarding botanical formulations"
                        className="w-full px-4 py-3 bg-[#FAF8F3] border border-gray-300 rounded-xs text-sm text-[#1F1F1F] focus:outline-none focus:border-[#1F4D3B]"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                        Message *
                      </label>
                      <Field
                        as="textarea"
                        name="message"
                        rows="5"
                        placeholder="How can we help you on your wellness journey?"
                        className="w-full px-4 py-3 bg-[#FAF8F3] border border-gray-300 rounded-xs text-sm text-[#1F1F1F] focus:outline-none focus:border-[#1F4D3B]"
                      />
                      <ErrorMessage name="message" component="div" className="text-xs text-red-600 mt-1 font-light" />
                    </div>

                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
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
