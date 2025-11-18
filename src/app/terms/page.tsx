// pages/terms.js
import React from 'react';
import './privacy.css'
import { Footer } from '@/components/ui/footer';

const Terms: React.FC = () => {
    return (
        <div>
    <div className="privacy-container">
      <h1 className='privacy-title'>Terms of Service</h1>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our PDF AI Reader service , you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          Our platform offers an AI-powered PDF reader that allows users to upload PDF documents for automated reading and analysis. Users can interact with the AI to inquire about the content of the documents. Uploaded documents are automatically saved in our secure database.
        </p>
      </section>

      <section>
        <h2>3. Usage Limits</h2>
        <p>
          <strong>Free Plan:</strong> Users on the free plan are limited to documents with a maximum size of 4MB and should not exceed 5 pages.
        </p>
        <p>
          <strong>Pro Plan:</strong> Subscribers to the Pro Plan enjoy increased limits, with a maximum document size of 16MB and a limit of 25 pages.
        </p>
      </section>

      <section>
        <h2>4. User Responsibilities</h2>
        <p>
          Users are responsible for the content they upload and the inquiries they make using the Service. The platform reserves the right to remove any content that violates these terms or is deemed inappropriate.
        </p>
      </section>

      <section>
        <h2>5. Data Security and Privacy</h2>
        <p>
          We prioritize the security and privacy of user data. Our detailed Privacy Policy outlines how we collect, use, and protect user information. By using the Service, you agree to the terms outlined in the Privacy Policy.
        </p>
      </section>

      <section>
        <h2>6. Prohibited Activities</h2>
        <p>
          Users are prohibited from engaging in any activity that may disrupt the functionality of the Service, compromise its security, or violate any applicable laws. Prohibited activities include, but are not limited to, attempting to gain unauthorized access to the platform or uploading malicious content.
        </p>
      </section>

      <section>
        <h2>7. Subscription and Payments</h2>
        <p>
          If you choose to subscribe to the Pro Plan, you agree to pay the specified fees. Payments are processed securely, and subscription details can be managed through your account settings.
        </p>
      </section>

      <section>
        <h2>8. Termination of Service</h2>
        <p>
          We reserve the right to terminate or suspend access to the Service, with or without cause, at any time and without notice.
        </p>
      </section>

      <section>
        <h2>9. Changes to Terms</h2>
        <p>
          We may update these terms periodically, and users will be notified of any changes. Continued use of the Service after changes are made constitutes acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2>10. Contact Information</h2>
        <p>
          For any questions or concerns regarding these terms, please contact us at <a href="mailto:contact@email.com">contact@email.com</a>.
        </p>
      </section>

    </div>
          <Footer />
</div>
  );
};

export default Terms;
