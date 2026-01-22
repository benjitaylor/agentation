<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 24 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_checkmark_circle)">
    <path
      d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15 10L11 14.25L9.25 12.25"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <defs>
    <clipPath id="clip0_checkmark_circle">
      <rect width="24" height="24" fill="white" />
    </clipPath>
  </defs>
</svg>
