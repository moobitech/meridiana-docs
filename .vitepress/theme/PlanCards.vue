<script setup lang="ts">
import { CONTACT_ANCHOR, CONTACT_ENDPOINT, requestedPlan } from './contact';
import { type Plan, plans } from './plans';

// With the endpoint of the form, a button leads to the form with its plan chosen; without it, it
// opens an email
const href = (plan: Plan) => (CONTACT_ENDPOINT ? `#${CONTACT_ANCHOR}` : plan.href);

function choose(plan: Plan) {
  if (CONTACT_ENDPOINT) requestedPlan.value = plan.name;
}
</script>

<template>
  <div class="plans">
    <div v-for="plan in plans" :key="plan.name" class="plan" :class="{ featured: plan.featured }">
      <p v-if="plan.featured" class="badge">Most complete</p>
      <h3>{{ plan.name }}</h3>
      <p class="price">{{ plan.price }}</p>
      <p class="unit">{{ plan.unit }}</p>
      <p class="summary">{{ plan.summary }}</p>
      <ul>
        <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
      </ul>
      <a class="action" :href="href(plan)" @click="choose(plan)">{{ plan.action }}</a>
    </div>
  </div>
  <p class="note">
    Per application, with unlimited developers. Prices in euro, VAT excluded. Renewals up to 50%
    off.
  </p>
</template>

<style scoped>
.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
  margin: 24px 0 8px;
}
.plan {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}
.plan.featured {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 30px -12px var(--vp-c-brand-1);
}
.badge {
  position: absolute;
  top: -11px;
  left: 20px;
  margin: 0;
  padding: 0 10px;
  border-radius: 999px;
  /* the filled colour of the buttons: white text above 4.5:1 in the dark theme too (the brand is lighter there) */
  background: var(--landing-button-bg);
  color: var(--vp-c-white);
  font-size: 12px;
  font-weight: 600;
  line-height: 22px;
}
.plan h3 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 18px;
}
.price {
  margin: 12px 0 0;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.1;
}
.unit {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.summary {
  margin: 14px 0 0;
  font-size: 14px;
}
.plan ul {
  flex: 1;
  margin: 14px 0 20px;
  padding-left: 18px;
  font-size: 14px;
}
.plan li + li {
  margin-top: 6px;
}
.action {
  display: block;
  padding: 9px 14px;
  border-radius: 20px;
  background: var(--landing-button-bg);
  color: var(--vp-c-white) !important;
  font-weight: 600;
  text-align: center;
  text-decoration: none !important;
}
.action:hover {
  background: var(--landing-button-bg-hover);
}
.note {
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>
