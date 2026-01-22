<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 16 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_2_45)">
    <path
      d="M16.25 8.75L10 15.25L7.25 12.25"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <defs>
    <clipPath id="clip0_2_45">
      <rect width="24" height="24" fill="white" />
    </clipPath>
  </defs>
</svg>
