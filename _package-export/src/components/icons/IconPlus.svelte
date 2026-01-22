<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 16 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 16 16" fill="none">
  <path
    d="M8 3v10M3 8h10"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
  />
</svg>
