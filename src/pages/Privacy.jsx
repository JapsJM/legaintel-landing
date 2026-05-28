/*
 * PLACEHOLDER - Review with qualified Indian legal counsel before production deployment.
 * AI-generated document. Not a substitute for professional legal advice.
 *
 * LegAIntel — Privacy Policy
 * Route: /privacy
 * Public access — no authentication required
 * Aligned with: Digital Personal Data Protection Act, 2023 (DPDP Act)
 *               IT (SPDI) Rules, 2011
 *               Information Technology Act, 2000
 */

import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ShieldCheck, ArrowLeft, AlertTriangle } from 'lucide-react';

const LAST_UPDATED = "27 May 2026";
const GRIEVANCE_OFFICER = "Designated Privacy Officer";
const GRIEVANCE_EMAIL = "info.legaintel@gmail.com";

const Section = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-lg font-bold text-[#c5a059] uppercase tracking-[0.2em] mb-4 pb-3 border-b border-white/10">
      {title}
    </h2>
    <div className="text-slate-300 leading-relaxed space-y-4 text-sm md:text-base">
      {children}
    </div>
  </section>
);

const Sub = ({ title, children }) => (
  <div className="mt-4">
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    <div className="text-slate-400 leading-relaxed">{children}</div>
  </div>
);

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — LegAIntel';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', "LegAIntel's Privacy Policy — how we collect, process, and protect your personal data under the Digital Personal Data Protection Act 2023 and IT Rules 2011.");
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#c5a059] selection:text-black">

        {/* Navigation */}
        <nav className="border-b border-white/5 bg-[#0a0c10]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-baseline select-none">
              <span className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-white">leg</span>
              <span className="text-3xl md:text-4xl font-black text-[#c5a059] mx-[1px] leading-none">AI</span>
              <span className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-white">ntel</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="border-b border-white/5 bg-[#08090d] py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={18} className="text-[#c5a059]" />
              <span className="text-[#c5a059] text-xs tracking-[0.25em] font-bold uppercase">Legal Document</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Privacy Policy</h1>
            <p className="text-slate-400 text-sm">
              Last Updated: <span className="text-slate-200 font-medium">{LAST_UPDATED}</span>
            </p>
            <p className="text-slate-400 mt-4 text-sm md:text-base max-w-2xl leading-relaxed">
              LegAIntel is committed to protecting your personal data. This Policy explains what we
              collect, how we use it, and your rights under the Digital Personal Data Protection Act,
              2023 and the IT (SPDI) Rules, 2011.
            </p>
          </div>
        </div>

        {/* Placeholder Warning */}
        <div className="bg-[#c5a059]/10 border-b border-[#c5a059]/20 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#c5a059] text-xs tracking-wide font-semibold uppercase">
              ⚠ Placeholder Document — Must be reviewed and approved by qualified Indian legal counsel before production deployment
            </p>
          </div>
        </div>

        {/* AI Disclaimer Banner */}
        <div className="bg-red-950/30 border-b-2 border-red-800/50 px-6 py-6">
          <div className="max-w-4xl mx-auto flex items-start gap-4">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm leading-relaxed">
              <strong>AI Limitation Notice:</strong> LegAIntel is powered by artificial intelligence and
              can make mistakes. All outputs — including legal analysis, case summaries, citations, and
              statutory interpretation — must be independently verified by a qualified legal professional
              before being relied upon. LegAIntel does not provide legal advice and accepts no liability
              for professional decisions made based on AI-generated content.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-16">

          <Section title="1. Data Controller Identity">
            <p>
              LegAIntel ("we", "us", "our") is the Data Fiduciary responsible for your personal data
              collected through the Platform and associated Services, as defined under the Digital
              Personal Data Protection Act, 2023 ("DPDP Act"). LegAIntel operates as a Software-as-a-Service
              platform providing AI-assisted legal research tools to legal professionals in India.
            </p>
            <p>
              For the avoidance of doubt: LegAIntel is the Data Fiduciary in respect of personal data
              you provide directly to LegAIntel (such as account registration data, billing data, and
              usage data). Where you upload documents or data containing personal data of your own
              clients or third parties ("Client Data"), you act as the Data Fiduciary in respect of
              that Client Data, and LegAIntel processes it solely as your Data Processor for the
              purpose of delivering the Services. Your obligations as Data Fiduciary for Client Data
              under the DPDP Act, 2023 remain entirely your responsibility.
            </p>
            <p>
              For all data-related queries, requests, and complaints — including exercise of your rights
              as a Data Principal under the DPDP Act — please contact our Grievance Officer as specified
              in Section 11 of this Policy.
            </p>
          </Section>

          <Section title="2. Categories of Personal Data Collected">
            <Sub title="2.1 Account and Identity Data">
              Name, email address, phone number, professional designation, Bar Council enrollment number
              (where voluntarily provided), firm or organisation name, and billing address.
            </Sub>
            <Sub title="2.2 Usage and Interaction Data">
              Platform activity logs, search queries, documents uploaded, AI query history, feature
              usage patterns, session duration, and in-platform behavioural analytics.
            </Sub>
            <Sub title="2.3 Technical Data">
              IP address, browser type and version, operating system, device identifiers, referral URLs,
              and time-zone settings collected automatically when you access the Platform.
            </Sub>
            <Sub title="2.4 Payment and Billing Data">
              Transaction records, invoice details, and subscription history. Full payment card
              information is processed exclusively by PCI-DSS compliant third-party payment gateway
              partners and is never stored on LegAIntel servers.
            </Sub>
            <Sub title="2.5 User Content">
              Legal documents, case files, notes, annotations, and other materials you upload or create
              within the Platform ("User Content"). User Content may contain personal data of third
              parties including your clients. You warrant that you have the lawful right to upload such
              data and that doing so complies with your professional obligations and applicable law.
            </Sub>
            <Sub title="2.6 Data We Do Not Collect">
              LegAIntel does not intentionally collect sensitive personal data as defined under the
              IT (SPDI) Rules, 2011 — such as passwords (which are hashed, not stored), financial
              account numbers beyond what is necessary for billing, or biometric data — unless strictly
              necessary for a specific Service feature, in which case explicit consent will be sought.
            </Sub>
          </Section>

          <Section title="3. Purpose of Data Collection">
            <p>We collect and process your personal data for the following purposes only:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 ml-2 mt-2">
              <li>Providing, operating, maintaining, and improving the Services</li>
              <li>Account creation, authentication, and access management</li>
              <li>Processing subscriptions, billing, and issuing GST-compliant invoices</li>
              <li>Delivering AI-powered legal analysis, research, and briefing outputs</li>
              <li>Improving AI model quality and Platform performance using anonymised data</li>
              <li>Sending transactional communications (account alerts, receipts, security notifications)</li>
              <li>Complying with legal obligations under Indian law including the DPDP Act, 2023</li>
              <li>Detecting, investigating, and preventing fraud, abuse, and security incidents</li>
              <li>Providing customer support and responding to queries and complaints</li>
              <li>Enforcing our Terms of Service and protecting LegAIntel's legal rights</li>
            </ul>
            <p className="mt-4">
              We do not use your personal data for purposes incompatible with those listed above without
              your explicit prior consent.
            </p>
          </Section>

          <Section title="4. Legal Basis for Processing">
            <p>
              Under the Digital Personal Data Protection Act, 2023, and the IT (SPDI) Rules, 2011,
              we process your personal data on the following legal bases:
            </p>
            <Sub title="Consent">
              Where you have given clear, specific, informed, and unambiguous consent — for example,
              when registering an account or opting into communications. You may withdraw consent for
              non-essential data processing (such as marketing communications and optional analytics)
              at any time without affecting the lawfulness of processing prior to withdrawal, by
              contacting us at {GRIEVANCE_EMAIL}. For the avoidance of doubt, withdrawal of consent
              does not affect processing that is necessary for contractual performance, legal compliance,
              or legitimate interests, and does not release you from the binding obligations under the
              Terms of Service to which you have separately agreed.
            </Sub>
            <Sub title="Contractual Necessity">
              Processing necessary to deliver the Services you have subscribed to, including account
              management, feature access, AI query processing, and billing.
            </Sub>
            <Sub title="Legitimate Interests">
              Processing for Platform security, fraud prevention, abuse detection, and aggregate
              analytics, where such interests do not override your fundamental rights and freedoms
              as a Data Principal.
            </Sub>
            <Sub title="Legal Obligation">
              Where processing is required to comply with applicable Indian law, court orders, directions
              from competent authorities, or regulatory requirements under the DPDP Act, 2023 or the
              IT Act, 2000.
            </Sub>
          </Section>

          <Section title="5. Data Retention Periods">
            <p>
              We retain personal data only for as long as necessary to fulfil the purposes for which
              it was collected, comply with legal obligations, resolve disputes, and enforce agreements:
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-slate-300 font-semibold py-3 pr-6">Data Category</th>
                    <th className="text-left text-slate-300 font-semibold py-3">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  {[
                    ["Account and identity data", "Duration of account + 2 years post-closure"],
                    ["Usage and activity logs", "12 months rolling"],
                    ["Payment and billing records", "7 years (Income Tax Act, GST law requirements)"],
                    ["User Content (uploaded documents)", "Duration of subscription + 30 days post-cancellation"],
                    ["Support communications", "3 years from resolution"],
                    ["Security and audit logs", "24 months"],
                    ["Consent records", "Duration of processing + 3 years"],
                  ].map(([cat, period]) => (
                    <tr key={cat} className="border-b border-white/5">
                      <td className="py-3 pr-6">{cat}</td>
                      <td className="py-3">{period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-slate-500 text-xs">
              Retention periods may be extended where required by ongoing legal proceedings, regulatory
              investigation, or applicable mandatory law.
            </p>
          </Section>

          <Section title="6. Your Rights as a Data Principal">
            <p>
              Under the Digital Personal Data Protection Act, 2023, you have the following rights
              regarding your personal data:
            </p>
            <Sub title="Right of Access">
              You may request confirmation of whether we process your personal data and obtain a summary
              of the data we hold about you and the purposes for which it is processed.
            </Sub>
            <Sub title="Right to Correction and Completion">
              You may request correction of inaccurate or incomplete personal data. Basic account data
              can be updated directly in your Profile settings.
            </Sub>
            <Sub title="Right to Erasure">
              You may request deletion of your personal data where processing is no longer necessary
              for the purposes for which it was collected, subject to our legal retention obligations
              and legitimate interests.
            </Sub>
            <Sub title="Right to Grievance Redressal">
              You have the right to have your grievance addressed by our Grievance Officer within the
              timeframes specified under the DPDP Act, 2023 and IT Rules, 2011.
            </Sub>
            <Sub title="Right to Nominate">
              Under the DPDP Act, 2023, you may nominate another individual to exercise your data
              rights in the event of your death or incapacity.
            </Sub>
            <p className="mt-4">
              To exercise any of these rights, contact our Grievance Officer at{' '}
              <a href="mailto:info.legaintel@gmail.com" className="text-[#c5a059] hover:underline">
                {GRIEVANCE_EMAIL}
              </a>{' '}
              with subject "Data Rights Request — [Your Name]". We will respond within the timeframe
              prescribed under applicable law, including the DPDP Act, 2023 and IT Rules, 2011.
            </p>
          </Section>

          <Section title="7. Third Party Sharing Disclosure">
            <p>
              LegAIntel does not sell, rent, or trade your personal data or User Content to third parties
              for commercial or marketing purposes. We may share data only in the following limited
              circumstances:
            </p>
            <Sub title="7.1 Authorised Sub-Processors">
              Trusted service providers (Data Processors) who assist in operating the Platform —
              including cloud infrastructure, payment gateway, email delivery, and analytics providers.
              All sub-processors are bound by data processing agreements consistent with the DPDP Act,
              2023 and maintain confidentiality obligations. The categories of sub-processors we engage
              may be updated from time to time as our operational requirements evolve. LegAIntel does
              not guarantee that any specific sub-processor list will be made available on demand.
            </Sub>
            <Sub title="7.2 Legal and Regulatory Disclosure">
              Where required by a court order, law enforcement direction, or applicable Indian law —
              including under the IT Act, 2000 or the DPDP Act, 2023 — we may disclose personal data
              to competent authorities. LegAIntel may, where legally permissible and operationally
              practicable, notify you of such disclosure, but no guarantee of such notification is made.
            </Sub>
            <Sub title="7.3 Business Transfers">
              In the event of a merger, acquisition, restructuring, or sale of assets, your data may be
              transferred to the successor entity subject to privacy protections no less stringent than
              those set out in this Policy, subject to applicable law, and with reasonable advance notice
              to you where legally permissible.
            </Sub>
          </Section>

          <Section title="8. Cookie Policy">
            <Sub title="8.1 Types of Cookies Used">
              The Platform uses: (a) Essential cookies — strictly necessary for login, session management,
              and Platform security; (b) Preference cookies — to remember your settings and personalise
              your experience; (c) Analytics cookies — to understand aggregate usage patterns and
              improve Platform performance.
            </Sub>
            <Sub title="8.2 Essential Cookies">
              Essential cookies cannot be disabled as they are necessary for core Platform functionality,
              including authentication token management and session security.
            </Sub>
            <Sub title="8.3 Managing Non-Essential Cookies">
              You may manage non-essential cookies through the cookie consent interface presented on
              first visit, or through your browser settings. Disabling non-essential cookies does not
              affect your right to use the Platform but may impact certain features.
            </Sub>
          </Section>

          <Section title="9. Security Measures">
            <p>
              LegAIntel implements appropriate technical and organisational security measures to protect
              your personal data in accordance with the IT (SPDI) Rules, 2011 and the DPDP Act, 2023:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 ml-2 mt-2">
              <li>Encryption of data in transit using industry-standard protocols</li>
              <li>Industry-standard encryption measures for sensitive data at rest, as operationally implemented</li>
              <li>Role-based access controls and principle of least privilege</li>
              <li>Multi-factor authentication available for account access</li>
              <li>Periodic security reviews and vulnerability assessments as operationally appropriate</li>
              <li>Incident response and Personal Data Breach notification procedures</li>
              <li>Logical separation of user data using appropriate technical controls</li>
              <li>Employee data access restricted on a need-to-know basis with confidentiality obligations</li>
            </ul>
            <p className="mt-4">
              In the event of a Personal Data Breach affecting your rights and freedoms, LegAIntel will
              notify affected Data Principals and the Data Protection Board of India as required under
              the DPDP Act, 2023, within the prescribed timeframe.
            </p>
            <p className="mt-4">
              NOTWITHSTANDING THE FOREGOING, NO SECURITY MEASURE IS INFALLIBLE. LEGAINTEL DOES NOT
              WARRANT OR GUARANTEE THAT YOUR PERSONAL DATA WILL BE IMMUNE FROM UNAUTHORISED ACCESS,
              DISCLOSURE, ALTERATION, OR DESTRUCTION. THE SECURITY MEASURES DESCRIBED ABOVE REPRESENT
              LEGAINTEL'S CURRENT COMMERCIALLY REASONABLE EFFORTS AND DO NOT CONSTITUTE A WARRANTY OF
              ABSOLUTE SECURITY. YOU ACKNOWLEDGE AND ACCEPT THIS INHERENT RISK AS A CONDITION OF
              USING THE SERVICES.
            </p>
            <p className="mt-4">
              YOU EXPRESSLY ACKNOWLEDGE THAT: (A) TRANSMISSION OF YOUR DATA OVER THE INTERNET IS
              INHERENTLY INSECURE AND LEGAINTEL MAKES NO GUARANTEE OF SECURITY DURING TRANSMISSION;
              (B) THIRD-PARTY CLOUD INFRASTRUCTURE PROVIDERS AND AI API PROVIDERS OPERATE UNDER
              THEIR OWN INDEPENDENT SECURITY REGIMES WHICH ARE OUTSIDE LEGAINTEL'S DIRECT CONTROL,
              AND LEGAINTEL IS NOT LIABLE FOR ANY BREACH, COMPROMISE, OR UNAUTHORISED ACCESS
              ORIGINATING FROM SUCH PROVIDERS; (C) CYBERATTACKS, HACKING ATTEMPTS, AND MALICIOUS
              INTRUSION REPRESENT RISKS THAT NO SECURITY FRAMEWORK CAN ENTIRELY ELIMINATE; AND
              (D) YOU ASSUME ALL RISK ASSOCIATED WITH YOUR DECISION TO UPLOAD CONFIDENTIAL,
              PRIVILEGED, OR SENSITIVE LEGAL DOCUMENTS TO ANY INTERNET-BASED PLATFORM, INCLUDING
              THIS ONE. LEGAINTEL'S LIABILITY FOR ANY SECURITY BREACH IS SUBJECT TO THE LIMITATION
              OF LIABILITY PROVISIONS IN THE TERMS OF SERVICE.
            </p>
          </Section>

          <Section title="10. Cross-Border Data Transfer Policy">
            <p>
              LegAIntel's primary data processing infrastructure is located in India. Where data is
              processed or stored outside India through cloud service providers or sub-processors with
              global infrastructure, we ensure that:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 ml-2 mt-2">
              <li>
                Transfers comply with the Digital Personal Data Protection Act, 2023, including any
                restrictions on cross-border data transfers notified by the Central Government
              </li>
              <li>Receiving parties maintain contractual data protection obligations equivalent to
                those imposed by applicable Indian law</li>
              <li>User Content containing privileged legal data is processed within Indian jurisdiction
                to the extent permitted by LegAIntel's operational requirements and third-party
                infrastructure constraints</li>
              <li>We do not transfer data to jurisdictions blacklisted under the DPDP Act, 2023</li>
            </ul>
            <p className="mt-4">
              By using the Services, you acknowledge that your data may be processed in jurisdictions
              outside India as described above, subject to the safeguards outlined herein.
            </p>
          </Section>

          <Section title="11. Grievance Officer">
            <p>
              As required under Rule 5(9) of the Information Technology (Reasonable Security Practices
              and Procedures and Sensitive Personal Data or Information) Rules, 2011, and consistent with
              the Digital Personal Data Protection Act, 2023, LegAIntel has designated a Grievance Officer
              to address privacy-related complaints, data rights requests, and escalations:
            </p>
            <div className="mt-4 p-6 border border-[#c5a059]/20 bg-[#0a0c10] rounded-sm space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Grievance Officer</p>
                <p className="text-white font-semibold">{GRIEVANCE_OFFICER}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Organisation</p>
                <p className="text-slate-300">LegAIntel</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Email</p>
                <a href={`mailto:${GRIEVANCE_EMAIL}`} className="text-[#c5a059] hover:underline">
                  {GRIEVANCE_EMAIL}
                </a>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Subject Line</p>
                <p className="text-slate-300">Privacy Grievance — [Your Name]</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Response Commitment</p>
                <p className="text-slate-300">
                  Within the timeframe prescribed under the IT Rules, 2011 and the DPDP Act, 2023,
                  as applicable to the nature of the grievance
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              If you are not satisfied with the resolution provided by the Grievance Officer, you may
              escalate your complaint to the <strong className="text-white">Data Protection Board of India</strong>{' '}
              once it is constituted under the DPDP Act, 2023.
            </p>
          </Section>

          <Section title="12. AI Processing Disclosure">
            <p>
              LegAIntel uses artificial intelligence and machine learning systems to process your queries
              and User Content in order to deliver its Services. By using the Platform, you acknowledge
              and accept that:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 ml-2 mt-2">
              <li>Your queries and uploaded content are processed by AI systems to generate outputs</li>
              <li>AI outputs may be inaccurate, incomplete, or contextually incorrect</li>
              <li>
                LegAIntel does not use your identifiable personal data or confidential User Content
                to train any AI model — whether shared with other users or not — without your explicit
                prior consent. Anonymised, aggregated, non-attributable data may be used for model
                improvement purposes only, and cannot be used to reconstruct or identify any individual
                user or their client data.
              </li>
              <li>
                Anonymised, aggregated usage data may be used to improve model performance and
                Platform quality
              </li>
              <li>
                You retain the right to opt out of non-essential AI processing by contacting our
                Grievance Officer
              </li>
            </ul>
          </Section>

          <Section title="13. Changes to This Privacy Policy">
            <p>
              LegAIntel reserves the right to update this Privacy Policy at any time. Material changes
              will be notified to registered users via email and an in-Platform notice at least 30 days
              before taking effect. The "Last Updated" date at the top of this Policy reflects the most
              recent revision. Continued use of the Services after any change constitutes your acceptance
              of the updated Policy.
            </p>
          </Section>

          <Section title="14. Contact for Privacy Queries">
            <p>
              For general privacy queries, data access requests, or concerns about this Policy:
            </p>
            <div className="mt-4 p-6 border border-white/10 bg-[#0a0c10] rounded-sm space-y-2">
              <p className="text-white font-semibold">LegAIntel Privacy Team</p>
              <p className="text-slate-400">
                Email:{' '}
                <a href="mailto:info.legaintel@gmail.com" className="text-[#c5a059] hover:underline">
                  {GRIEVANCE_EMAIL}
                </a>
              </p>
              <p className="text-slate-400">Subject Line: <span className="text-slate-300">Privacy Query — [Your Name]</span></p>
              <p className="text-slate-500 text-xs mt-3">
                LegAIntel will use commercially reasonable efforts to respond to privacy queries within
                the timeframes prescribed under applicable Indian law. No specific response period
                beyond statutory requirements is guaranteed.
              </p>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#08090d] px-6 py-10">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} LegAIntel. All professional rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/privacy" className="text-[#c5a059]">Privacy Policy</Link>
              <span className="text-slate-800">•</span>
              <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
              <span className="text-slate-800">•</span>
              <Link to="/contact" className="hover:text-white transition">Contact</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
