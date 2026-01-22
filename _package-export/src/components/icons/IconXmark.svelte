<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 16 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_2_53)">
    <path
      d="M16.25 16.25L7.75 7.75"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7.75 16.25L16.25 7.75"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <defs>
    <clipPath id="clip0_2_53">
      <rect width="24" height="24" fill="white" />
    </clipPath>
  </defs>
</svg>
