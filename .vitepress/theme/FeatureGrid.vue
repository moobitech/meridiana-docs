<script setup lang="ts">
import { withBase } from 'vitepress';

// What a booking app gets, each with a screenshot of the React demo and the page that explains it
const features = [
  {
    title: 'Every view a booking app needs',
    text: 'Agenda, Day, 3 days, Week with excluded days, and Month with “+N more”. One API for all five.',
    image: '/landing/feature-views.png',
    width: 968,
    height: 740,
    alt: 'The month view, with the events of each day and “+1 more”',
    link: '/docs/events-and-interactions#navigation',
    more: 'Views and navigation',
  },
  {
    title: 'Drag, resize, validate',
    text: 'Move and resize with snapping and auto-scroll, by mouse, touch or keyboard. Your rule accepts the change, your app saves it.',
    image: '/landing/feature-interactions.png',
    width: 968,
    height: 620,
    alt: 'The week view with the context menu of an event open: Open, Duplicate next day, Delete',
    link: '/docs/events-and-interactions#move-and-resize',
    more: 'Events and interactions',
  },
  {
    title: 'Your design system, in Tailwind',
    text: 'Every element takes its classes from a named slot and its colors from CSS variables. Dark mode included.',
    image: '/landing/feature-theming.png',
    width: 968,
    height: 857,
    alt: 'The agenda view in dark mode, with times, colored dots and rooms',
    link: '/docs/theming',
    more: 'Theming',
  },
  {
    title: 'Made for phones',
    text: 'The week folds to three days on tablets and one on phones. React Native adds long press and bottom-sheet menus.',
    image: '/landing/feature-phone.png',
    width: 358,
    height: 618,
    alt: 'One day on a phone, with overlapping events side by side',
    link: '/docs/react-native',
    more: 'React Native',
  },
];
</script>

<template>
  <div class="features vp-raw">
    <a
      v-for="feature in features"
      :key="feature.title"
      class="feature"
      :href="withBase(feature.link)"
    >
      <div class="picture">
        <img
          :src="withBase(feature.image)"
          :width="feature.width"
          :height="feature.height"
          :alt="feature.alt"
          loading="lazy"
        />
      </div>
      <h3>{{ feature.title }}</h3>
      <p>{{ feature.text }}</p>
      <span class="more">{{ feature.more }} →</span>
    </a>
  </div>
</template>

<style scoped>
.features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 24px;
}
@media (max-width: 767px) {
  .features {
    grid-template-columns: 1fr;
  }
}

.feature {
  display: flex;
  flex-direction: column;
  padding: 12px 12px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.2s;
}
.feature:hover {
  border-color: var(--vp-c-brand-1);
}

/* The screenshots differ in shape: each sits at the top of the same frame */
.picture {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
}
.picture img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
}
/* The phone shows whole, centered */
.feature:last-child .picture img {
  width: auto;
  margin: 0 auto;
  object-fit: contain;
  object-position: top;
}

h3 {
  margin: 20px 8px 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}
p {
  flex: 1;
  margin: 8px 8px 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.6;
}
.more {
  margin: 16px 8px 0;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
}
</style>
