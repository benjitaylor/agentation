<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 16 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <path
    d="M10 11.5L10.125 15.5"
    stroke="currentColor"
    stroke-opacity="1"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M14 11.5L13.87 15.5"
    stroke="currentColor"
    stroke-opacity="1"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M9 7.5V6.25C9 5.42157 9.67157 4.75 10.5 4.75H13.5C14.3284 4.75 15 5.42157 15 6.25V7.5"
    stroke="currentColor"
    stroke-opacity="1"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M5.5 7.75H18.5"
    stroke="currentColor"
    stroke-opacity="1"
    stroke-width="1.5"
    stroke-linecap="round"
  />
  <path
    d="M6.75 7.75L7.11691 16.189C7.16369 17.2649 7.18708 17.8028 7.41136 18.2118C7.60875 18.5717 7.91211 18.8621 8.28026 19.0437C8.69854 19.25 9.23699 19.25 10.3139 19.25H13.6861C14.763 19.25 15.3015 19.25 15.7197 19.0437C16.0879 18.8621 16.3912 18.5717 16.5886 18.2118C16.8129 17.8028 16.8363 17.2649 16.8831 16.189L17.25 7.75"
    stroke="currentColor"
    stroke-opacity="1"
    stroke-width="1.5"
    stroke-linecap="round"
  />
</svg>
