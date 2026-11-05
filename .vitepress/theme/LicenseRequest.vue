<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import { CONTACT_ANCHOR, CONTACT_EMAIL, CONTACT_ENDPOINT, requestedPlan } from './contact';
import { plans } from './plans';

type Field = 'name' | 'email' | 'app' | 'plan';

const PLANS = [...plans.map((plan) => plan.name), 'Not sure yet'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const form = reactive({ name: '', email: '', app: '', plan: '', message: '', gotcha: '' });
const errors = reactive<Partial<Record<Field, string>>>({});
const state = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle');
const formElement = ref<HTMLFormElement>();

// A button of the plans chooses the plan here
watch(requestedPlan, (plan) => {
  if (plan) form.plan = plan;
});

function validate(): boolean {
  errors.name = form.name.trim() ? undefined : 'Enter your name.';
  errors.email = !form.email.trim()
    ? 'Enter your email address.'
    : EMAIL.test(form.email.trim())
      ? undefined
      : 'Enter an email address like name@example.com.';
  errors.app = form.app.trim() ? undefined : 'Enter the application or project.';
  errors.plan = form.plan ? undefined : 'Choose a plan.';

  return !Object.values(errors).some(Boolean);
}

async function submit() {
  // The first field in error takes the focus, so a screen reader reads its message
  if (!validate()) {
    await nextTick();
    formElement.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }

  state.value = 'sending';
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        app: form.app.trim(),
        plan: form.plan,
        message: form.message.trim(),
        _subject: `Meridiana license request: ${form.plan}`,
        _gotcha: form.gotcha,
      }),
    });
    state.value = response.ok ? 'sent' : 'failed';
  } catch {
    state.value = 'failed';
  }
}

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
      <div class="row">
        <div class="field">
          <label for="request-name">Name</label>
          <input
            id="request-name"
            v-model="form.name"
            name="name"
            autocomplete="name"
            :aria-invalid="errors.name ? 'true' : 'false'"
            :aria-describedby="errors.name ? 'request-name-error' : undefined"
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
            :aria-describedby="errors.email ? 'request-email-error' : undefined"
          />
          <p v-if="errors.email" id="request-email-error" class="error">{{ errors.email }}</p>
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label for="request-app">Application or project</label>
          <input
            id="request-app"
            v-model="form.app"
            name="app"
            placeholder="e.g. Acme Booking, app.acme.com"
            :aria-invalid="errors.app ? 'true' : 'false'"
            :aria-describedby="errors.app ? 'request-app-error' : undefined"
          />
          <p v-if="errors.app" id="request-app-error" class="error">{{ errors.app }}</p>
        </div>

        <div class="field">
          <label for="request-plan">Plan</label>
          <select
            id="request-plan"
            v-model="form.plan"
            name="plan"
            :aria-invalid="errors.plan ? 'true' : 'false'"
            :aria-describedby="errors.plan ? 'request-plan-error' : undefined"
          >
            <option value="" disabled>Choose a plan</option>
            <option v-for="plan in PLANS" :key="plan" :value="plan">{{ plan }}</option>
          </select>
          <p v-if="errors.plan" id="request-plan-error" class="error">{{ errors.plan }}</p>
        </div>
      </div>

      <div class="field">
        <label for="request-message">Message <span class="optional">(optional)</span></label>
        <textarea
          id="request-message"
          v-model="form.message"
          name="message"
          rows="4"
          aria-describedby="request-message-hint"
        />
        <p id="request-message-hint" class="hint">
          The web hosts and mobile bundle ids of the application, your company and VAT number, or a
          question.
        </p>
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
        <a :href="mailto()">{{ CONTACT_EMAIL }}</a
        >.
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
.row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 639px) {
  .row {
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
input,
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
