// pages/privacy.js

import React from 'react';
import './privacy.css'
import { Footer } from '@/components/ui/footer';
const PrivacyPolicy = () => {
  return (
    <div>
    <div className="privacy-container">
      <h1 className='privacy-title'>Privacy Policy</h1>

      <section>
        <p>
          This Privacy Policy outlines how our PDF AI Reader service collects, uses, and protects user information. By using the Service, you agree to the terms outlined in this policy.
        </p>
      </section>

      <section>
        <h2>1. Information We Collect</h2>
        <p>
          We collect information that users provide when using the Service, including uploaded documents for AI analysis. Additionally, we may collect usage data, such as interactions with the AI and service-related activities.
        </p>
      </section>

      <section>
      <h2>2. Information We Collect</h2>
            <>Personal information refers to details or opinions about an individual, whether recorded or not, that can identify them. The types of personal information we may collect include:
                
                The types of personal information we may collect about you include:
                
                <ul className='mb-5'>
    <li><strong>Identity Data:</strong> First name and last name.</li>
    <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
    <li><strong>Financial Data:</strong> Bank account and payment card details (through third-party payment processors such as Stripe).</li>
    <li><strong>Transaction Data:</strong> Details about payments to you from us and from you to us, and other details of products and services you have purchased from us or we have purchased from you.</li>
    <li><strong>Profile Data:</strong> Your username and password (including for NightCafe Lounge, our Discord forum), profile picture, purchases or orders you have made with us, designs you have created with us (prior to you deleting them), support requests you have made, content you post, send receive and share through our platform, information you have shared with our social media platforms, your interests, preferences, feedback, and survey responses.</li>
</ul>
                      
                            </>
      </section>

      <section>
      <h2>3. How We Collect Your Information</h2>
            <p>We collect personal information in various ways:</p>
            <ul className='mb-5'>
                <li>Directly: You provide personal information when registering, using the Feedback and Support form, or requesting assistance.</li>
                <li>Indirectly: Personal information may be collected during interactions on our website, via email, telephone, or other forums.</li>
                <li>From third parties: We collect information from authentication providers (Clerk : <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#001F3F' }}>View Clerk privacy policy here</a>), analytics, cookie providers, and marketing providers.</li>
            </ul>

      </section>
      <section>
        <h2>4. Use of Collected Information</h2>
        <p>
          The information collected is used to improve and personalize the Service, respond to user inquiries, and ensure the security of user data. We do not sell or share user information with third parties.
        </p>
      </section>
      <section>
        <h2>5. Cookies</h2>
        <p>
          The Service may use cookies to enhance user experience. Users can control cookie preferences through their browser settings. However, disabling cookies may affect the functionality of the Service.
        </p>
      </section>


      <section>
        <h2>6. Changes to Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Users will be notified of any changes, and continued use of the Service after updates constitutes acceptance of the revised policy.
        </p>
      </section>

      <section>
        <h2>7. Contact Information</h2>
        <p>
          For any questions or concerns regarding this Privacy Policy, please contact us at <a href="mailto:contact@email.com">contact@email.com</a>.
        </p>
      </section>
</div>
     <Footer />
    </div>
  );
};

export default PrivacyPolicy;
