// The license request form (LicenseRequest.vue) of the plan cards.
import { ref } from 'vue';

/**
 * The URL the form posts to: a Formspree-style endpoint that takes a JSON POST and answers 2xx,
 * e.g. `https://formspree.io/f/abcdwxyz`. Empty: the form is hidden and the buttons of the plans
 * open an email, as before.
 */
export const CONTACT_ENDPOINT = 'https://formspree.io/f/xbggbany';

/** Where the requests go when the endpoint is not set or does not answer. */
export const CONTACT_EMAIL = 'michele.bombardi@moobitech.it';

/** The anchor of the form, where the buttons of the plans lead. */
export const CONTACT_ANCHOR = 'request';

/** The plan of the last button clicked, preselected in the form. */
export const requestedPlan = ref('');
