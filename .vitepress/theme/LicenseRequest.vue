<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { CONTACT_ANCHOR, CONTACT_EMAIL, CONTACT_ENDPOINT, requestedPlan } from './contact';
import { plans } from './plans';

// Every plan asks what its order needs (docs/licensing.md, "The license lifecycle"): the licensee,
// the application with its hosts and bundle ids, the Community conditions (LICENSE.md, section 3)
// or the billing details. One table, below, says which field each plan asks.

const COMMUNITY = 'Community';
const WEB = 'Web';
const MOBILE = 'Web + Mobile';
const ENTERPRISE = 'Enterprise';
const NOT_SURE = 'Not sure yet';
const PLANS = [...plans.map((plan) => plan.name), NOT_SURE];
const PAID = [WEB, MOBILE, ENTERPRISE];

const ELIGIBILITY = [
  'Individual, non-commercial use',
  'Open-source project under an OSI-approved license',
  'Organization with less than €1M of annual revenue and at most 5 developers',
];
const OPEN_SOURCE = ELIGIBILITY[1];

type Key =
  | 'licensee'
  | 'app'
  | 'hosts'
  | 'bundles'
  | 'eligibility'
  | 'repository'
  | 'applications'
  | 'products'
  | 'vat'
  | 'billing';

interface FieldSpec {
  key: Key;
  label: string;
  /** The plans that ask it, all required unless `optional` names them. */
  plans: string[];
  optional?: string[];
  hint?: string;
  placeholder?: string;
  type?: 'text' | 'url' | 'number' | 'select' | 'textarea';
  options?: string[];
  autocomplete?: string;
  wide?: boolean;
  /** Asked only when this is true, e.g. the repository of an open-source project. */
  when?: () => boolean;
  error: string;
}

const values = reactive<Record<Key, string | number>>({
  licensee: '',
  app: '',
  hosts: '',
  bundles: '',
  eligibility: '',
  repository: '',
  applications: '',
  products: '',
  vat: '',
  billing: '',
});

const FIELDS: FieldSpec[] = [
  {
    key: 'licensee',
    label: 'Licensee',
    plans: [COMMUNITY, ...PAID],
    hint: 'The full legal name of the individual, company or project the license is issued to.',
    autocomplete: 'organization',
    error: 'Enter who the license is issued to.',
  },
  {
    key: 'app',
    label: 'Application',
    plans: PLANS,
    optional: [ENTERPRISE],
    placeholder: 'e.g. Acme Booking',
    error: 'Enter the application or project.',
  },
  {
    key: 'hosts',
    label: 'Web hosts',
    plans: [COMMUNITY, WEB, MOBILE],
    hint: 'Every host of the application, staging included. Local hosts need no entry.',
    placeholder: 'e.g. app.example.com, *.example.com',
    error: 'Enter the web hosts of the application.',
  },
  {
    key: 'bundles',
    label: 'Mobile bundle ids',
    plans: [MOBILE],
    hint: 'The iOS and Android bundle ids. Expo Go needs no entry.',
    placeholder: 'e.g. com.example.app',
    error: 'Enter the bundle ids of the mobile app.',
  },
  {
    key: 'eligibility',
    label: 'Community condition',
    plans: [COMMUNITY],
    type: 'select',
    options: ELIGIBILITY,
    wide: true,
    error: 'Choose the condition that applies to you.',
  },
  {
    key: 'repository',
    label: 'Repository',
    plans: [COMMUNITY],
    type: 'url',
    placeholder: 'e.g. https://github.com/example/project',
    wide: true,
    when: () => values.eligibility === OPEN_SOURCE,
    error: 'Enter the repository of the project.',
  },
  {
    key: 'applications',
    label: 'Number of applications',
    plans: [ENTERPRISE],
    type: 'number',
    error: 'Enter how many applications.',
  },
  {
    key: 'products',
    label: 'Products',
    plans: [ENTERPRISE],
    type: 'select',
    options: ['Web', 'Web and Mobile'],
    error: 'Choose the products.',
  },
  {
    key: 'vat',
    label: 'VAT number',
    plans: PAID,
    hint: 'Or the tax code, for an individual.',
    error: 'Enter the VAT number or the tax code.',
  },
  {
    key: 'billing',
    label: 'Billing address',
    plans: PAID,
    type: 'textarea',
    autocomplete: 'street-address',
    error: 'Enter the billing address.',
  },
];

const MESSAGE_HINT: Record<string, string> = {
  [ENTERPRISE]: 'What you need: OEM, redistribution, support, the resource timeline.',
  [NOT_SURE]: 'Tell us about your application and its developers: we suggest a plan.',
};

const form = reactive({ name: '', email: '', plan: '', confirm: false, message: '', gotcha: '' });
const errors = reactive<Record<string, string | undefined>>({});
const state = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle');
const formElement = ref<HTMLFormElement>();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The fields of the chosen plan, in order. */
const fields = computed(() =>
  FIELDS.filter((field) => field.plans.includes(form.plan) && (field.when?.() ?? true)),
);
const required = (field: FieldSpec) => !field.optional?.includes(form.plan);
const community = computed(() => form.plan === COMMUNITY);

// A button of the plans chooses the plan here
watch(requestedPlan, (plan) => {
  if (plan) form.plan = plan;
});

// Another plan: the errors of the fields it does not ask go away
watch(
  () => form.plan,
  () => {
    for (const key of Object.keys(errors)) errors[key] = undefined;
  },
);

function validate(): boolean {
  errors.name = form.name.trim() ? undefined : 'Enter your name.';
  errors.email = !form.email.trim()
    ? 'Enter your email address.'
    : EMAIL.test(form.email.trim())
      ? undefined
      : 'Enter an email address like name@example.com.';
  errors.plan = form.plan ? undefined : 'Choose a plan.';
  for (const field of FIELDS) {
    const asked = fields.value.includes(field) && required(field);
    errors[field.key] = asked && !String(values[field.key]).trim() ? field.error : undefined;
  }
  errors.confirm =
    community.value && !form.confirm ? 'Confirm the Community conditions.' : undefined;

  return !Object.values(errors).some(Boolean);
}

async function submit() {
  // The first field in error takes the focus, so a screen reader reads its message
  if (!validate()) {
    await nextTick();
    formElement.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }

  // Only the fields of the plan, each with its own name in the notification of the endpoint
  const details = Object.fromEntries(
    fields.value.map((field) => [field.key, String(values[field.key]).trim()]),
  );
  state.value = 'sending';
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        plan: form.plan,
        ...details,
        ...(community.value && {
          conditions: 'Confirmed (LICENSE.md, section 3), Angular and React views only',
        }),
        message: form.message.trim(),
        _subject: community.value
          ? 'Meridiana Community key request'
          : `Meridiana license request: ${form.plan}`,
        _gotcha: form.gotcha,
      }),
    });
    state.value = response.ok ? 'sent' : 'failed';
  } catch {
    state.value = 'failed';
  }
}

const describedBy = (id: string, hint?: string) =>
  [hint && `${id}-hint`, errors[id.replace('request-', '')] && `${id}-error`]
    .filter(Boolean)
    .join(' ') || undefined;

const mailto = () =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Meridiana license request: ${form.plan || 'plan'}`)}`;
</script>

<!-- The request of a key or a license: shown only when CONTACT_ENDPOINT is set (contact.ts) -->
<template>
  <section v-if="CONTACT_ENDPOINT" :id="CONTACT_ANCHOR" class="request vp-raw">
    <h2>Request a key or a license</h2>
    <p class="intro">
      Tell us about your application: we reply by email with the order and, for Community, with your
      free key.
    </p>

    <div v-if="state === 'sent'" class="status success" role="status">
      <strong>Thank you, your request was sent.</strong> We reply to {{ form.email }}.
    </div>

    <form v-else ref="formElement" novalidate @submit.prevent="submit">
      <div class="grid">
        <div class="field">
          <label for="request-name">Name</label>
          <input
            id="request-name"
            v-model="form.name"
            name="name"
            autocomplete="name"
            :aria-invalid="errors.name ? 'true' : 'false'"
            :aria-describedby="describedBy('request-name')"
          />
          <p v-if="errors.name" id="request-name-error" class="error">{{ errors.name }}</p>
        </div>

        <div class="field">
          <label for="request-email">Email</label>
          <input
            id="request-email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            :aria-invalid="errors.email ? 'true' : 'false'"
            :aria-describedby="describedBy('request-email')"
          />
          <p v-if="errors.email" id="request-email-error" class="error">{{ errors.email }}</p>
        </div>

        <div class="field wide">
          <label for="request-plan">Plan</label>
          <select
            id="request-plan"
            v-model="form.plan"
            name="plan"
            :aria-invalid="errors.plan ? 'true' : 'false'"
            :aria-describedby="describedBy('request-plan')"
          >
            <option value="" disabled>Choose a plan</option>
            <option v-for="plan in PLANS" :key="plan" :value="plan">{{ plan }}</option>
          </select>
          <p v-if="errors.plan" id="request-plan-error" class="error">{{ errors.plan }}</p>
        </div>

        <div
          v-for="field in fields"
          :key="field.key"
          class="field"
          :class="{ wide: field.wide || field.type === 'textarea' }"
        >
          <label :for="`request-${field.key}`">
            {{ field.label }}
            <span v-if="!required(field)" class="optional">(optional)</span>
          </label>
          <select
            v-if="field.type === 'select'"
            :id="`request-${field.key}`"
            v-model="values[field.key]"
            :name="field.key"
            :aria-invalid="errors[field.key] ? 'true' : 'false'"
            :aria-describedby="describedBy(`request-${field.key}`, field.hint)"
          >
            <option value="" disabled>Choose one</option>
            <option v-for="option in field.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <textarea
            v-else-if="field.type === 'textarea'"
            :id="`request-${field.key}`"
            v-model="values[field.key]"
            :name="field.key"
            rows="3"
            :autocomplete="field.autocomplete"
            :aria-invalid="errors[field.key] ? 'true' : 'false'"
            :aria-describedby="describedBy(`request-${field.key}`, field.hint)"
          />
          <input
            v-else
            :id="`request-${field.key}`"
            v-model="values[field.key]"
            :name="field.key"
            :type="field.type ?? 'text'"
            :min="field.type === 'number' ? 1 : undefined"
            :placeholder="field.placeholder"
            :autocomplete="field.autocomplete"
            :aria-invalid="errors[field.key] ? 'true' : 'false'"
            :aria-describedby="describedBy(`request-${field.key}`, field.hint)"
          />
          <p v-if="field.hint" :id="`request-${field.key}-hint`" class="hint">{{ field.hint }}</p>
          <p v-if="errors[field.key]" :id="`request-${field.key}-error`" class="error">
            {{ errors[field.key] }}
          </p>
        </div>

        <div class="field wide">
          <label for="request-message">Message <span class="optional">(optional)</span></label>
          <textarea
            id="request-message"
            v-model="form.message"
            name="message"
            rows="4"
            :aria-describedby="MESSAGE_HINT[form.plan] ? 'request-message-hint' : undefined"
          />
          <p v-if="MESSAGE_HINT[form.plan]" id="request-message-hint" class="hint">
            {{ MESSAGE_HINT[form.plan] }}
          </p>
        </div>

        <div v-if="community" class="field wide">
          <label class="check">
            <input
              id="request-confirm"
              v-model="form.confirm"
              name="confirm"
              type="checkbox"
              :aria-invalid="errors.confirm ? 'true' : 'false'"
              :aria-describedby="describedBy('request-confirm')"
            />
            <span>
              We meet this condition, and will move to a paid plan when we no longer do. We need
              only the Angular and React views: React Native is not part of Community.
            </span>
          </label>
          <p v-if="errors.confirm" id="request-confirm-error" class="error">
            {{ errors.confirm }}
          </p>
        </div>
      </div>

      <!-- Left empty by people, filled by bots: the endpoint drops those requests -->
      <div class="trap" aria-hidden="true">
        <label for="request-gotcha">Leave this empty</label>
        <input
          id="request-gotcha"
          v-model="form.gotcha"
          name="_gotcha"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <div v-if="state === 'failed'" class="status failure" role="alert">
        The request could not be sent. Try again, or write to
        <a :href="mailto()">{{ CONTACT_EMAIL }}</a>.
      </div>

      <button type="submit" class="button primary" :disabled="state === 'sending'">
        {{ state === 'sending' ? 'Sending…' : 'Send the request' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.request {
  margin-top: 40px;
  padding: 32px 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  scroll-margin-top: calc(var(--vp-nav-height) + 24px);
}

h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
}
.intro {
  margin: 8px 0 24px;
  color: var(--vp-c-text-2);
  font-size: 15px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.wide {
  grid-column: 1 / -1;
}
@media (max-width: 639px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
label {
  font-size: 14px;
  font-weight: 600;
}
.optional {
  color: var(--vp-c-text-2);
  font-weight: 400;
}
input:not([type='checkbox']),
select,
textarea {
  width: 100%;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 15px;
}
select {
  appearance: auto;
}
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}
[aria-invalid='true'] {
  border-color: var(--vp-c-danger-1);
}
.check {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
}
.check input {
  width: 20px;
  height: 20px;
  margin: 2px 0 0;
  flex: none;
  accent-color: var(--vp-c-brand-1);
}
.error {
  margin: 0;
  color: var(--vp-c-danger-1);
  font-size: 13px;
}
.hint {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.trap {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.status {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
}
.success {
  background: var(--vp-c-tip-soft);
  color: var(--vp-c-text-1);
}
.failure {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-text-1);
}
.failure a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

button {
  align-self: flex-start;
  border: 0;
  cursor: pointer;
}
button:disabled {
  cursor: progress;
  opacity: 0.7;
}
</style>
