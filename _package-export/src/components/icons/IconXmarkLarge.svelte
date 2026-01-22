<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 24 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_1_660)">
    <path
      d="M17.25 17.25L6.75 6.75"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.75 17.25L17.25 6.75"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <defs>
    <clipPath id="clip0_1_660">
      <rect width="24" height="24" fill="white" />
    </clipPath>
  </defs>
</svg>
