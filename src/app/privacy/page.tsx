import type { Metadata } from "next";
import Link from "next/link";
import { LegalList, LegalP, LegalPage, LegalSection, LegalSubhead } from "@/components/legal/Legal";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Let's Fly.lk collects, uses, shares and protects your personal data when you book travel, apply for a visa, contact us or use our website.",
};

const purposes = [
  {
    purpose: "To manage our relationship with you, including personalising your experience and improving our services",
    data: "Technical, Usage, Marketing and Communications",
    basis: [
      "Necessary to comply with a legal obligation",
      "Necessary for our legitimate interests (to keep our records updated and to study how clients use our web services)",
      "Necessary for our legitimate interests to present you with the right kinds of products and services",
    ],
  },
  {
    purpose:
      "To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data)",
    data: "Technical",
    basis: [
      "Necessary for our legitimate interests (for running our business, provision of administration and IT services, network security and to prevent fraud)",
      "Necessary to comply with a legal obligation",
    ],
  },
  {
    purpose:
      "To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you",
    data: "Usage, Marketing and Communications, Technical",
    basis: [
      "Necessary for our legitimate interests (to study how clients use our services, to develop them, to grow our business and to inform our marketing strategy)",
    ],
  },
  {
    purpose: "To use data analytics to improve this website, our services, marketing, client relationships and experiences",
    data: "Technical, Usage",
    basis: [
      "Necessary for our legitimate interests (to define types of clients for our services, to keep this website updated and relevant, and to develop our business)",
    ],
  },
  {
    purpose: "To make suggestions and recommendations to you about services that may be of interest to you",
    data: "Technical, Usage",
    basis: ["Necessary for our legitimate interests (to develop our services and grow our business)"],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we look after the personal data you share with Let’s Fly.lk, your privacy rights, and the protection afforded by law."
    >
      <LegalSection title="1. Introduction">
        <LegalP>
          Let’s Fly.lk (“we”, “us”, “our” and/or “Company”) is a travel and tour agency registered in Sri Lanka, with
          our office at {contact.address}, Sri Lanka.
        </LegalP>
        <LegalSubhead>Why your privacy is important to us</LegalSubhead>
        <LegalP>
          Let’s Fly.lk remains committed to ensuring a robust and transparent personal data protection framework. Your
          privacy is important to us, and we wish to assure you that the Personal Data we collect about you will be
          treated with care. This Privacy Policy informs you about:
        </LegalP>
        <LegalList
          items={[
            "how we look after your Personal Data when you use any of our services (air tickets, visas, tours, hotels, rentals and related travel services), apply for a career at Let’s Fly.lk, contract with us, visit our website, or interact with us over the phone, via email, WhatsApp or our social media platforms;",
            "your privacy rights; and",
            "the protection afforded by law, including the Personal Data Protection Act, No. 9 of 2022 of Sri Lanka, as applicable.",
          ]}
        />
        <LegalP>
          By accepting the terms of this Privacy Policy, contracting with us and/or continuing to use our services, you
          confirm that you have read, understood and agreed to this Privacy Policy.
        </LegalP>
      </LegalSection>

      <LegalSection title="2. Definitions">
        <LegalP>This Privacy Policy uses a number of definitions, which are set out below.</LegalP>
        <LegalList
          items={[
            <>
              <strong className="text-ink-900">Personal Data:</strong> any information which identifies an individual,
              or information relating to an individual who can be identified (directly or indirectly) from that data
              alone or in combination with other identifiers we possess or can reasonably access. Personal Data does not
              include anonymous data or data that has had the identity of an individual permanently removed.
            </>,
            <>
              <strong className="text-ink-900">Processing or Process:</strong> any activity that involves the use of
              Personal Data. It includes obtaining, recording or holding the data, or carrying out any operation or set
              of operations on the data, including organising, amending, retrieving, using, disclosing, erasing or
              destroying it. Processing also includes transmitting or transferring Personal Data to third parties.
            </>,
            <>
              <strong className="text-ink-900">Special Categories of Personal Data:</strong> any data which reveals
              details about sensitive issues such as an individual’s race or ethnicity, religious or philosophical
              beliefs, sexual orientation, political opinions, trade union membership, information about health, or
              genetic and/or biometric data.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Important information and who we are">
        <LegalSubhead>Purpose of this Privacy Policy</LegalSubhead>
        <LegalP>
          This Privacy Policy aims to give you information on how we collect and process your Personal Data through your
          use of our website and services, including any data you may provide when you make an inquiry, book travel,
          apply for a visa or apply for a career with us. This website is not intended for children, and we do not
          knowingly collect data relating to children unless it is provided by their parents or guardians (for example,
          when booking family travel or visas).
        </LegalP>
        <LegalP>
          It is important that you read this Privacy Policy together with any other privacy notice we may provide on
          specific occasions when we are collecting or processing Personal Data about you, so that you are fully aware
          of how and why we are using your data. This Privacy Policy supplements those notices and is not intended to
          override them.
        </LegalP>

        <LegalSubhead>Data controller</LegalSubhead>
        <LegalP>
          Let’s Fly.lk is the data controller of all Personal Data relating to our clients, employees and third-party
          individual contacts, as well as any other Personal Data used in our business for our own commercial purposes.
          This means that we are responsible for determining when, why and how to Process Personal Data and for
          establishing practices and policies in line with applicable data protection law.
        </LegalP>

        <LegalSubhead>Contact details</LegalSubhead>
        <LegalP>
          If you have any questions about this Privacy Policy, including any requests to exercise your legal rights,
          please contact us using the details below.
        </LegalP>
        <dl className="grid max-w-[640px] grid-cols-1 gap-x-8 gap-y-3 rounded-xl border border-sand-300 bg-sand-50 p-5 text-body sm:grid-cols-[180px_1fr] sm:p-6">
          <dt className="font-semibold text-ink-900">Legal entity</dt>
          <dd className="text-ink-600">Let’s Fly.lk</dd>
          <dt className="font-semibold text-ink-900">Contact</dt>
          <dd className="text-ink-600">Data Protection Contact</dd>
          <dt className="font-semibold text-ink-900">Email</dt>
          <dd>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </dd>
          <dt className="font-semibold text-ink-900">Postal address</dt>
          <dd className="text-ink-600">{contact.address}, Sri Lanka</dd>
          <dt className="font-semibold text-ink-900">Telephone</dt>
          <dd>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </dd>
        </dl>

        <LegalSubhead>Your duty to provide accurate information and inform us of changes</LegalSubhead>
        <LegalP>
          It is important that the Personal Data we hold about you is accurate, valid and current. It is also your
          obligation to keep us informed if your Personal Data changes during your relationship with us. This is
          especially important for passport, visa and ticketing details, where errors can affect your travel.
        </LegalP>

        <LegalSubhead>Your duty to ensure the security of your own personal devices</LegalSubhead>
        <LegalP>
          It is important that you ensure the security of the devices used to transfer Personal Data to us, as no data
          transmission over the Internet can be guaranteed to be 100% secure. It is therefore your responsibility to
          secure such devices against security and cyber risks. We will not ask for your Personal Data or account
          information by any unsolicited means of communication, so you are responsible for keeping your Personal Data
          and account information secure and not sharing it with others.
        </LegalP>

        <LegalSubhead>Third-party consent</LegalSubhead>
        <LegalP>
          If you provide us with Personal Data on behalf of another person (for example, family members or fellow
          travellers in a group booking or visa application), you confirm that the information has been obtained by you
          and provided to us with the prior specific consent of that person, who has been made aware of this Privacy
          Policy. Such third-party Personal Data shall be accurate, up to date and valid, and shall not include any false
          or inaccurate information, misstatements of fact or misrepresentations.
        </LegalP>

        <LegalSubhead>Third-party links</LegalSubhead>
        <LegalP>
          This website may include links to third-party websites, plug-ins and applications (such as Google Maps,
          WhatsApp and social media platforms) which are not maintained or controlled by us. Clicking on those links or
          enabling those connections may allow third parties to collect or share data about you under their own terms
          of use and privacy policies. We do not control these third-party websites and are not responsible for their
          privacy statements or security controls. When you leave this website, we encourage you to read the privacy
          policy of every website you visit.
        </LegalP>
      </LegalSection>

      <LegalSection title="4. The data we collect">
        <LegalSubhead>Personal Data</LegalSubhead>
        <LegalP>
          We may collect, use, store and transfer different kinds of Personal Data about you, and about third parties
          you disclose to us, which we have grouped together as follows:
        </LegalP>
        <LegalList
          items={[
            "Personal Data which you directly and voluntarily submit to obtain our services or clarification about them, which may include your name, address, national identity card or passport number, date of birth, email address, contact details and the travel or visa documents required for your booking.",
            "Technical Data, which includes your internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.",
            "Usage Data, which includes information about how you use this website or our services.",
            "Marketing and Communications Data, which includes your preferences in receiving marketing from us and our third parties, and your communication preferences.",
          ]}
        />

        <LegalSubhead>Aggregated Data</LegalSubhead>
        <LegalP>
          When you visit this website, we may also collect, use, store and share aggregated, anonymised, statistical or
          demographic data (“Aggregated Data”). Aggregated Data may be derived from your Personal Data but is not
          considered Personal Data in law, as it cannot directly or indirectly reveal your identity. It may include the
          time and length of your visit, the pages you visited, and the website you visited immediately before this
          one. We use this information only to measure site activity and to develop ideas for improving our services.
        </LegalP>
        <LegalP>
          For example, we may aggregate your Usage Data to calculate the percentage of users accessing a specific
          website feature. However, if we combine or connect Aggregated Data with your Personal Data so that it can
          directly or indirectly identify you, we treat the combined data as Personal Data, which will be used in
          accordance with this Privacy Policy.
        </LegalP>

        <LegalSubhead>If you fail to provide Personal Data, or provide inaccurate or false Personal Data</LegalSubhead>
        <LegalP>
          Where we need to collect Personal Data by law, under the terms of a contract we have with you, or because it
          is required to provide the services you are looking for (for example, passport details for a ticket or visa),
          and you fail to provide that data when requested, we may not be able to perform the contract we have or are
          trying to enter into with you. In these circumstances, we may have to cancel or refuse the service you are
          looking for, but we will notify you if this is the case at the time.
        </LegalP>
        <LegalP>
          If we have reason to believe that any Personal Data provided by you is false, inaccurate, a misstatement of
          fact, a misrepresentation, an act of identity theft, a violation of any third-party right or similar, we have
          the right to refuse any services you require, terminate our contract with you, if any, and where relevant,
          report you to the relevant regulatory authorities.
        </LegalP>
      </LegalSection>

      <LegalSection title="5. How is your Personal Data collected?">
        <LegalP>We use different methods to collect data from and about you, including through:</LegalP>
        <LegalList
          items={[
            <>
              <strong className="text-ink-900">Direct interactions.</strong> You (or a person or agent acting on your
              behalf) may give us your Personal Data by filling in forms on this website or by corresponding with us in
              person, by phone, email, WhatsApp or otherwise. This includes Personal Data you provide when you make an
              inquiry or booking, apply for a visa, give us feedback, or make a complaint about our services.
            </>,
            <>
              <strong className="text-ink-900">This website.</strong> As you interact with this website, we may
              automatically collect Technical Data about your equipment, browsing actions and patterns. We collect this
              Personal Data by using cookies, server logs and other similar technologies. Please see section 6 below
              for further details.
            </>,
            <>
              <strong className="text-ink-900">Third parties or publicly available sources.</strong> We may receive
              Personal Data about you from various third parties and public sources, such as analytics providers (for
              example, Google-based analytics), advertising networks and search information providers, based within
              and/or outside Sri Lanka.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="6. How we use your Personal Data">
        <LegalP>
          We will only use your Personal Data in the manner permitted by law. Most commonly, we will rely on the
          following lawful bases to process your Personal Data:
        </LegalP>
        <LegalList
          items={[
            <>
              <strong className="text-ink-900">Legitimate interests:</strong> our interests in conducting and managing
              our business so that we can give you the highest standard of service and the best and most secure
              experience. We consider and balance any potential impact on you, both positive and negative, and your
              rights before we process your Personal Data for our legitimate interests. We do not use your Personal Data
              for activities where our interests are overridden by the impact on you, unless we have your express
              consent or are otherwise required or permitted to by law.
            </>,
            <>
              <strong className="text-ink-900">Performance of contract:</strong> processing your data where it is
              necessary to perform a contract to which you are a party, or to take steps at your request before
              entering into such a contract, including sharing it with airlines, hotels, embassies, visa-processing
              centres, transport providers and other suppliers as needed to deliver your booking.
            </>,
            <>
              <strong className="text-ink-900">Compliance with legal or regulatory obligations:</strong> processing,
              using and disclosing your Personal Data where necessary to comply with legal or regulatory obligations to
              which we are subject, or with requests by government, law enforcement, regulatory, judicial or related
              authorities.
            </>,
          ]}
        />

        <LegalSubhead>Purposes for which we will use your Personal Data</LegalSubhead>
        <LegalP>
          The table below describes the main ways we will use your Personal Data and the legal bases we rely on to do
          so. It may not be an exhaustive list, and we can provide additional information on request. We may process
          your Personal Data for more than one lawful basis depending on the specific purpose.
        </LegalP>
        <div className="overflow-x-auto rounded-xl border border-sand-300">
          <table className="w-full min-w-[640px] border-collapse text-left text-small">
            <thead className="bg-sand-50 text-ink-900">
              <tr>
                <th scope="col" className="w-[38%] p-4 font-semibold">Purpose / activity</th>
                <th scope="col" className="w-[20%] p-4 font-semibold">Type of data</th>
                <th scope="col" className="p-4 font-semibold">Lawful basis for processing</th>
              </tr>
            </thead>
            <tbody className="text-ink-600">
              {purposes.map((p) => (
                <tr key={p.purpose} className="border-t border-sand-300 align-top">
                  <td className="p-4">{p.purpose}</td>
                  <td className="p-4">{p.data}</td>
                  <td className="p-4">
                    <ul className="flex list-disc flex-col gap-1.5 pl-4 marker:text-ocean-600">
                      {p.basis.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <LegalSubhead>Cookies</LegalSubhead>
        <LegalP>
          This website uses cookies to measure site activity and to improve your experience when searching our
          services. Cookies are small identifiers sent to your device when you visit websites and online services. If
          your browser is set to accept them, they are stored on your device and allow this and other websites to
          recognise your preferences and tailor content to you. You can set your browser to refuse all or some cookies,
          or to alert you when websites set or access cookies. If you disable or refuse cookies, some parts of this
          website may become inaccessible or not function properly.
        </LegalP>

        <LegalSubhead>Change of purpose</LegalSubhead>
        <LegalP>
          We will only use your Personal Data for the purposes for which we collected it, unless we reasonably consider
          that we need to use it for another reason that is compatible with the original purpose. If you would like an
          explanation of how the processing for a new purpose is compatible with the original purpose, please contact
          us. If we need to use your Personal Data for an unrelated purpose, we will notify you and explain the legal
          basis which allows us to do so.
        </LegalP>
      </LegalSection>

      <LegalSection title="7. Marketing">
        <LegalP>
          We strive to provide you with choices regarding certain Personal Data uses, particularly around marketing and
          advertising. You can ask us to stop sending you marketing messages at any time by contacting us.
        </LegalP>
        <LegalSubhead>Third-party marketing</LegalSubhead>
        <LegalP>
          We will request your express consent before we share your Personal Data with any company outside Let’s
          Fly.lk for marketing purposes.
        </LegalP>
      </LegalSection>

      <LegalSection title="8. Disclosures of your Personal Data">
        <LegalP>We may have to share your Personal Data with the parties set out below for the purposes set out above.</LegalP>
        <LegalList
          items={[
            "Travel suppliers needed to deliver your booking, such as airlines, hotels, tour and transport operators, cruise and rail operators, travel insurers and our booking partners.",
            "Embassies, consulates, immigration authorities and visa-processing centres, where you ask us to assist with a visa application.",
            "Service providers, contractors and agents acting as processors who provide services such as IT, hosting, data processing and analytics, marketing and payment processing.",
            "Professional advisers, including lawyers, bankers, auditors and insurers who provide consultancy, banking, legal, insurance and accounting services.",
            "Any law enforcement authority, regulator or government institution, for security or other investigative purposes or where reporting is required by law.",
            "Third parties to whom we may choose to sell, transfer or merge parts of our business or our assets. If a change happens to our business, the new owners may use your Personal Data in the same way as set out in this Privacy Policy.",
          ]}
        />
        <LegalP>
          We require all third parties to respect the security of your Personal Data and to treat it in accordance with
          the law. We do not allow our third-party service providers to use your Personal Data for their own purposes,
          and only permit them to process it for specified purposes and in accordance with our instructions.
        </LegalP>
      </LegalSection>

      <LegalSection title="9. International transfers">
        <LegalP>
          Because we arrange travel, accommodation and visas in many different countries, it may be necessary to
          transfer your data outside Sri Lanka, for example to an overseas hotel, airline or embassy, in order to
          provide the services you have requested.
        </LegalP>
      </LegalSection>

      <LegalSection title="10. Data security">
        <LegalP>
          We have put in place appropriate security measures to prevent your Personal Data from being accidentally lost,
          used or accessed in an unauthorised way, altered or disclosed. We limit access to your Personal Data to those
          employees, agents, contractors and other third parties who have a business need to know. They will only
          process your Personal Data on our instructions and are subject to a duty of confidentiality. We have
          procedures in place to deal with any suspected Personal Data breach and will notify you and any applicable
          regulator of a breach where we are legally required to do so.
        </LegalP>
        <LegalP>
          Please bear in mind that we cannot accept responsibility for any unauthorised access to or loss of Personal
          Data that is beyond our control.
        </LegalP>
      </LegalSection>

      <LegalSection title="11. Data retention">
        <LegalSubhead>How long will you use my Personal Data for?</LegalSubhead>
        <LegalP>
          We will only retain your Personal Data for as long as necessary to fulfil the purposes we collected it for,
          including for the purposes of satisfying any legal, accounting or reporting requirements. To determine the
          appropriate retention period, we consider the amount, nature and sensitivity of the Personal Data, the
          potential risk of harm from unauthorised use or disclosure, the purposes for which we process it and whether
          we can achieve those purposes through other means, and the applicable legal requirements.
        </LegalP>
        <LegalP>
          In some circumstances you may ask us to delete your data (see{" "}
          <Link href="/gdpr">GDPR Compliance</Link>). In some circumstances we may anonymise your Personal Data so that
          it can no longer be associated with you, for research or statistical purposes, in which case we may use this
          information indefinitely without further notice to you.
        </LegalP>

        <LegalSubhead>Your legal rights</LegalSubhead>
        <LegalP>
          Under certain circumstances, you have the following rights under data protection laws in relation to your
          Personal Data:
        </LegalP>
        <LegalList
          items={[
            <>
              <strong className="text-ink-900">Request access</strong> to your Personal Data (commonly known as a
              “data subject access request”). This enables you to receive a copy of the Personal Data we hold about you
              and to check that we are lawfully processing it.
            </>,
            <>
              <strong className="text-ink-900">Request correction</strong> of the Personal Data that we hold about you.
              This enables you to have any incomplete or inaccurate data corrected, though we may need to verify the
              accuracy of the new data you provide.
            </>,
            <>
              <strong className="text-ink-900">Request erasure</strong> of your Personal Data where there is no good
              reason for us to continue processing it, where you have successfully exercised your right to object,
              where we may have processed it unlawfully, or where we are required to erase it to comply with local law.
              We may not always be able to comply with a request for erasure for specific legal reasons, which we will
              notify you of at the time of your request.
            </>,
            <>
              <strong className="text-ink-900">Object to processing</strong> of your Personal Data where we are relying
              on a legitimate interest and there is something about your particular situation which makes you want to
              object, or where we are processing your Personal Data for direct marketing purposes. In some cases, we may
              demonstrate that we have compelling legitimate grounds to process your information which override your
              rights and freedoms.
            </>,
            <>
              <strong className="text-ink-900">Request restriction of processing</strong> of your Personal Data: (a)
              if you want us to establish the data’s accuracy; (b) where our use of the data is unlawful but you do not
              want us to erase it; (c) where you need us to hold the data even if we no longer require it, to establish,
              exercise or defend legal claims; or (d) where you have objected to our use of your data but we need to
              verify whether we have overriding legitimate grounds to use it.
            </>,
            <>
              <strong className="text-ink-900">Request the transfer</strong> of your Personal Data to you or to a third
              party, in a structured, commonly used, machine-readable format. This right only applies to automated
              information which you initially provided consent for us to use, or where we used the information to
              perform a contract with you.
            </>,
            <>
              <strong className="text-ink-900">Withdraw consent</strong> at any time where we are relying on consent to
              process your Personal Data. This will not affect the lawfulness of any processing carried out before you
              withdraw your consent. If you withdraw your consent, we may not be able to provide certain services to
              you, and we will advise you if this is the case at the time.
            </>,
          ]}
        />
        <LegalP>
          If you wish to exercise any of the rights set out above, please contact us using the details in section 3.
        </LegalP>

        <LegalSubhead>No fee usually required</LegalSubhead>
        <LegalP>
          You will not have to pay a fee to access your Personal Data or to exercise any of the other rights. However,
          we may charge a reasonable fee if your request is clearly unfounded, repetitive or excessive, or refuse to
          comply with your request in these circumstances.
        </LegalP>

        <LegalSubhead>What we may need from you</LegalSubhead>
        <LegalP>
          We may need to request specific information from you to help us confirm your identity and ensure your right to
          access your Personal Data (or to exercise any of your other rights). This is a security measure to ensure that
          Personal Data is not disclosed to any person who has no right to receive it. We may also contact you to ask
          for further information in relation to your request to speed up our response.
        </LegalP>

        <LegalSubhead>Time limit to respond</LegalSubhead>
        <LegalP>
          We will use our best endeavours to respond to all legitimate requests within twenty-one days. Occasionally it
          may take us longer if your request is particularly complex or you have made a number of requests, in which
          case we will keep you updated.
        </LegalP>
      </LegalSection>

      <LegalSection title="12. Changes to this Privacy Policy">
        <LegalP>
          We may amend this Privacy Policy from time to time in accordance with applicable laws, regulations and best
          practices, and the updated version will be posted on this website. We ask that you revisit this page from
          time to time for updates. Previous versions of this Privacy Policy can be obtained by contacting us.
        </LegalP>
        <LegalP>
          This Privacy Policy may be translated into different languages. In the event of any inconsistency between the
          versions, the English version shall prevail.
        </LegalP>
      </LegalSection>

      <LegalSection title="13. Clarifications or complaints">
        <LegalP>
          If you have any comments, questions, concerns or complaints about this Privacy Policy or the way in which we
          use your information, please contact us at <a href={`mailto:${contact.email}`}>{contact.email}</a> or call{" "}
          <a href={contact.phoneHref}>{contact.phone}</a>.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
