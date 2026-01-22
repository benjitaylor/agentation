<script lang="ts">
  interface Props {
    size?: number;
  }
  let { size = 14 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 14 14" fill="none">
  <style>
    @keyframes checkDraw {
      0% {
        stroke-dashoffset: 12;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    @keyframes checkBounce {
      0% {
        transform: scale(0.5);
        opacity: 0;
      }
      50% {
        transform: scale(1.12);
        opacity: 1;
      }
      75% {
        transform: scale(0.95);
      }
      100% {
        transform: scale(1);
      }
    }
    .check-path-animated {
      stroke-dasharray: 12;
      stroke-dashoffset: 0;
      transform-origin: center;
      animation: checkDraw 0.18s ease-out, checkBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  </style>
  <path
    class="check-path-animated"
    d="M3.9375 7L6.125 9.1875L10.5 4.8125"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
