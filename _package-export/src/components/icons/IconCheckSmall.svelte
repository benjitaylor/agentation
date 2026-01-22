<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 14 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 14 14" fill="none">
  <path
    d="M3.9375 7L6.125 9.1875L10.5 4.8125"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
