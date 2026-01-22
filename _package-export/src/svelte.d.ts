/// <reference types="svelte" />

declare module '*.svelte' {
  import type { ComponentType, SvelteComponent } from 'svelte';
  const component: ComponentType<SvelteComponent>;
  export default component;
}
