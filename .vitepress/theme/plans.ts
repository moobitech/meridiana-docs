// The plans, for the cards of the site. The same plans are in the table of docs/pricing.md (for
// GitHub): change them together.
const MAIL = 'michele.bombardi@moobitech.it';

const mailto = (subject: string, lines: string[]) =>
  `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n') + '\n')}`;

const app = ['Application name:', 'Web hosts (e.g. app.example.com, *.example.com):'];
const mobile = ['Mobile bundle ids (e.g. com.example.app):'];
const billing = ['Company:', 'VAT number:', 'Billing address:', 'Notes:'];

export interface Plan {
  name: string;
  price: string;
  unit: string;
  summary: string;
  features: string[];
  action: string;
  href: string;
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    name: 'Community',
    price: 'Free',
    unit: 'for one application',
    summary: 'Individuals, open-source projects and small companies.',
    features: [
      'Angular and React views',
      'Non-commercial, open source, or under €1M revenue',
      'At most 5 developers in a company',
      'Updates, community support',
    ],
    action: 'Request a free key',
    href: mailto('Meridiana Community key request', [
      ...app,
      'Who you are (individual, open-source project with its repository, or organization):',
      'I confirm we meet the Community conditions (non-commercial, open source, or less than EUR 1M revenue and at most 5 developers): yes',
      'Notes:',
    ]),
  },
  {
    name: 'Web',
    price: '€390',
    unit: 'per application / year',
    summary: 'Commercial web applications.',
    features: [
      'Angular and React views',
      'Unlimited developers and end users',
      'Every environment and tenant of the app',
      'Updates and email support',
    ],
    action: 'Request a license',
    href: mailto('Meridiana license request: Web', ['Plan: Web', ...app, ...billing]),
  },
  {
    name: 'Web + Mobile',
    price: '€690',
    unit: 'per application / year',
    summary: 'One application on the web and on iOS and Android.',
    features: [
      'Everything in Web',
      'React Native views for Expo',
      'Touch gestures and bottom sheet menus',
      'Updates and email support',
    ],
    action: 'Request a license',
    href: mailto('Meridiana license request: Web + Mobile', [
      'Plan: Web + Mobile',
      ...app,
      ...mobile,
      ...billing,
    ]),
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: 'on request',
    summary: 'Many applications, OEM and custom terms.',
    features: [
      'Web and Mobile for many applications',
      'Resource timeline add-on, when it ships',
      'OEM and redistribution terms',
      'Priority support',
    ],
    action: 'Contact us',
    href: mailto('Meridiana license request: Enterprise', [
      'Plan: Enterprise',
      'Number of applications:',
      'Products (Web, Mobile):',
      'What you need (OEM, redistribution, support):',
      ...billing,
    ]),
  },
];
