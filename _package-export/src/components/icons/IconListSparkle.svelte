<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    size?: number;
    style?: string;
  }
  let { size = 24, style = '' }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" {style}>
  <g clip-path="url(#clip0_list_sparkle)">
    <path
      d="M11.5 12L5.5 12"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M18.5 6.75L5.5 6.75"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.25 17.25L5.5 17.25"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
  </g>
  <defs>
    <clipPath id="clip0_list_sparkle">
      <rect width="24" height="24" fill="white" />
    </clipPath>
  </defs>
</svg>
