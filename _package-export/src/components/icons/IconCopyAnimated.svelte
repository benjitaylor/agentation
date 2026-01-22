<script lang="ts">
  interface Props {
    size?: number;
    copied?: boolean;
  }
  let { size = 24, copied = false }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <style>
    .copy-icon, .check-icon {
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
  </style>
  <!-- Copy icon -->
  <g class="copy-icon" style="opacity: {copied ? 0 : 1}; transform: {copied ? 'scale(0.8)' : 'scale(1)'}; transform-origin: center;">
    <path
      d="M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <path
      d="M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </g>
  <!-- Checkmark circle -->
  <g class="check-icon" style="opacity: {copied ? 1 : 0}; transform: {copied ? 'scale(1)' : 'scale(0.8)'}; transform-origin: center;">
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
</svg>
