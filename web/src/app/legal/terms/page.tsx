import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that will govern use of WeNaija.",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lede="The agreement between you and WeNaija when you use the platform."
    >
      <LegalSection heading="Who can use WeNaija">
        <p>
          You must be at least 16 years old. We collect date of birth at signup
          and block account creation below that age.
        </p>
        <p>
          Nigerians outside Nigeria are welcome and get the same access — a
          Nigerian phone number is not required.
        </p>
      </LegalSection>

      <LegalSection heading="Your content">
        <p>
          What you post remains yours. You grant us the licence needed to store,
          display and distribute it within the platform — nothing broader, and it
          ends when you delete the content or your account.
        </p>
      </LegalSection>

      <LegalSection heading="What we ask of you">
        <p>
          Follow the Community Guidelines. Don&apos;t post content that is
          illegal, abusive, or that you don&apos;t have the right to post.
          Don&apos;t attempt to manipulate rankings — accounts under 30 days old
          are excluded from them, self-interactions don&apos;t count, and
          coordinated engagement is discounted.
        </p>
      </LegalSection>

      <LegalSection heading="Cost">
        <p>
          WeNaija is free at launch. There is no paid tier and no advertising in
          the first version. If that changes, it will change with notice, not
          quietly.
        </p>
      </LegalSection>

      <LegalSection heading="Still to be finalised">
        <p>
          Governing law and dispute resolution, limitation of liability, account
          suspension and appeal procedure, and the notice period for changes to
          these terms. Complete before registration opens.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
