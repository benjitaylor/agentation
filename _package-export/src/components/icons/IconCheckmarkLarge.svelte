<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 16 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_2_37)">
    <path
      d="M17.5962 7.75L9.42308 16.25L6.15385 12.6538"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <defs>
    <clipPath id="clip0_2_37">
      <rect width="24" height="24" fill="white" />
    </clipPath>
  </defs>
</svg>
