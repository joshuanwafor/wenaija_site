import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "What is and isn't acceptable on WeNaija, and what happens when someone crosses the line.",
  robots: { index: false, follow: true },
};

export default function GuidelinesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Community Guidelines"
      lede="WeNaija is built around real places and the people in them. These rules exist so that stays worth something."
    >
      <LegalSection heading="The short version">
        <p>
          Post like your neighbours can see it — because on a town feed, they can.
        </p>
      </LegalSection>

      <LegalSection heading="Not allowed">
        <p>
          Harassment, threats, or targeting individuals. Hate speech directed at
          ethnicity, religion, or origin — a platform organised around region
          carries a particular responsibility here. Sexual content involving
          minors, which we screen for automatically at upload and report to the
          appropriate authorities. Scams, impersonation, and coordinated
          inauthentic behaviour.
        </p>
      </LegalSection>

      <LegalSection heading="Reporting">
        <p>
          Every post, comment, story, message and profile will be reportable, with
          a reason. Reports go into a prioritised queue reviewed by a person, and
          you&apos;ll be told the outcome.
        </p>
        <p>
          You&apos;ll also be able to block anyone. A block stops messages, hides
          your stories and profile from them, and works in both directions.
        </p>
      </LegalSection>

      <LegalSection heading="What happens when a rule is broken">
        <p>
          Depending on severity: the content is removed, the account is excluded
          from rankings, the account is suspended, or it is permanently banned.
          Every action is logged, and you can appeal once.
        </p>
        <p>
          While an account is under review, its content is excluded from all
          ranked surfaces — feeds, Explore, and the weekly awards.
        </p>
      </LegalSection>

      <LegalSection heading="Still to be finalised">
        <p>
          The full reason taxonomy, review time targets, and the appeals process
          in detail. Complete before registration opens.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
