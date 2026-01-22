<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 20 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none">
  <path
    d="M10 16.0417C6.66328 16.0417 3.95834 13.3367 3.95834 10C3.95834 6.66328 6.66328 3.95833 10 3.95833C13.3367 3.95833 16.0417 6.66328 16.0417 10C16.0417 13.3367 13.3367 16.0417 10 16.0417Z"
    stroke="currentColor"
    stroke-opacity="0.2"
    stroke-width="1.25"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M8.24188 8.18736C8.38392 7.78357 8.66429 7.44309 9.03331 7.22621C9.40234 7.00933 9.83621 6.93005 10.2581 7.00241C10.68 7.07477 11.0626 7.29411 11.3383 7.62157C11.6139 7.94903 11.7648 8.36348 11.7642 8.79152C11.7642 9.99986 10 10.604 10 10.604V10.8333"
    stroke="currentColor"
    stroke-opacity="0.2"
    stroke-width="1.25"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M10 13.0208H10.006"
    stroke="currentColor"
    stroke-opacity="0.2"
    stroke-width="1.25"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
