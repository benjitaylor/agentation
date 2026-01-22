<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 16 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5" />
  <path d="M12 5V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M12 21V19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M16.95 7.05L18.36 5.64" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M5.64 18.36L7.05 16.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M19 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M3 12H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M16.95 16.95L18.36 18.36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M5.64 5.64L7.05 7.05" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
