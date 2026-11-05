<script setup lang="ts">
import { withBase } from 'vitepress';
</script>

<!-- Under every doc page: the legal texts, out of the sidebar (VitePress hides its footer on pages
     with a sidebar) -->
<template>
  <footer class="doc-legal">
    <span>Made by Moobi Tech</span>
    <a :href="withBase('/LICENSE')">License agreement</a>
    <a :href="withBase('/THIRD_PARTY_NOTICES')">Third-party notices</a>
    <a href="https://github.com/moobitech/meridiana-docs">Docs on GitHub</a>
  </footer>
</template>
