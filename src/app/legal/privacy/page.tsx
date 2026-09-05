import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How WeNaija will collect, use and protect personal data, under the Nigeria Data Protection Act 2023.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lede="What we plan to collect, why, and the rights you'll have over it — written against the Nigeria Data Protection Act 2023."
    >
      <LegalSection heading="What we collect at signup">
        <p>
          Your name, phone number or email address, date of birth, and your
          registered location — state, local government area and town. Location is
          the one piece of data the product genuinely cannot work without: it is
          what decides which feeds you see.
        </p>
        <p>
          We do not request device location, and the app will not trigger a
          browser location prompt. Your registered location is the only one we use.
        </p>
      </LegalSection>

      <LegalSection heading="Why we ask for your date of birth">
        <p>
          To enforce a minimum age of 16. It is not shown on your profile and is
          not used for advertising — there is no advertising.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          Under the Nigeria Data Protection Act 2023 you have the right to access
          your data, correct it, delete it, and take a portable copy with you.
          Data export and account deletion will be available in Settings — not
          buried in a help article, and not requiring an email to us.
        </p>
        <p>
          You will also be able to see and withdraw the consents you gave at
          signup, separately from deleting your account.
        </p>
      </LegalSection>

      <LegalSection heading="What we will never do">
        <p>
          Sell your personal data. Use your message content for advertising —
          again, there is no advertising in the first version. Or put message
          content into an SMS, which is why the SMS we send when someone
          can&apos;t reach you online contains only a name and a link.
        </p>
      </LegalSection>

      <LegalSection heading="Still to be finalised">
        <p>
          Retention periods, our data protection contact, registration with the
          Nigeria Data Protection Commission, and the full description of
          processors we use. These will be complete and published before
          registration opens.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
