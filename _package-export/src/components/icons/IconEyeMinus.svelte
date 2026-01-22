<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 16 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <path
    d="M4.91516 12.7108C4.63794 12.2883 4.63705 11.7565 4.91242 11.3328C5.84146 9.9033 8.30909 6.74994 12 6.74994C15.6909 6.74994 18.1585 9.9033 19.0876 11.3328C19.3629 11.7565 19.3621 12.2883 19.0848 12.7108C18.1537 14.13 15.6873 17.2499 12 17.2499C8.31272 17.2499 5.8463 14.13 4.91516 12.7108Z"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M9 12H15"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
  />
</svg>
