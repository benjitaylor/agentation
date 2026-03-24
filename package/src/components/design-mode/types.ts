// =============================================================================
// Layout Mode Types
// =============================================================================

export type ComponentType =
  | "navigation"
  | "hero"
  | "card"
  | "button"
  | "sidebar"
  | "table"
  | "form"
  | "input"
  | "modal"
  | "footer"
  | "avatar"
  | "badge"
  | "text"
  | "image"
  | "list"
  | "tabs"
  | "header"
  | "section"
  | "grid"
  | "dropdown"
  | "toggle"
  | "breadcrumb"
  | "pagination"
  | "progress"
  | "divider"
  | "accordion"
  | "carousel"
  | "chart"
  | "video"
  | "search"
  | "toast"
  | "tooltip"
  | "pricing"
  | "testimonial"
  | "cta"
  | "alert"
  | "banner"
  | "stat"
  | "stepper"
  | "tag"
  | "rating"
  | "map"
  | "timeline"
  | "fileUpload"
  | "codeBlock"
  | "calendar"
  | "notification"
  | "productCard"
  | "profile"
  | "drawer"
  | "popover"
  | "logo"
  | "faq"
  | "gallery"
  | "checkbox"
  | "radio"
  | "slider"
  | "datePicker"
  | "skeleton"
  | "chip"
  | "icon"
  | "spinner"
  | "feature"
  | "team"
  | "login"
  | "contact";

export type DesignPlacement = {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  scrollY: number;
  timestamp: number;
  text?: string;
};

export type ComponentDefinition = {
  type: ComponentType;
  label: string;
  width: number;
  height: number;
};

export type ComponentSection = {
  section: string;
  items: ComponentDefinition[];
};

// Default sizes for each component type
export const DEFAULT_SIZES: Record<ComponentType, { width: number; height: number }> = {
  navigation: { width: 800, height: 56 },
  hero: { width: 800, height: 320 },
  header: { width: 800, height: 80 },
  section: { width: 800, height: 400 },
  sidebar: { width: 240, height: 400 },
  footer: { width: 800, height: 160 },
  modal: { width: 480, height: 300 },
  card: { width: 280, height: 240 },
  text: { width: 400, height: 120 },
  image: { width: 320, height: 200 },
  video: { width: 480, height: 270 },
  table: { width: 560, height: 220 },
  grid: { width: 600, height: 300 },
  list: { width: 300, height: 180 },
  chart: { width: 400, height: 240 },
  button: { width: 140, height: 40 },
  input: { width: 280, height: 56 },
  form: { width: 360, height: 320 },
  tabs: { width: 480, height: 240 },
  dropdown: { width: 200, height: 200 },
  toggle: { width: 44, height: 24 },
  search: { width: 320, height: 44 },
  avatar: { width: 48, height: 48 },
  badge: { width: 80, height: 28 },
  breadcrumb: { width: 300, height: 24 },
  pagination: { width: 300, height: 36 },
  progress: { width: 240, height: 8 },
  divider: { width: 600, height: 1 },
  accordion: { width: 400, height: 200 },
  carousel: { width: 600, height: 300 },
  toast: { width: 320, height: 64 },
  tooltip: { width: 180, height: 40 },
  pricing: { width: 300, height: 360 },
  testimonial: { width: 360, height: 200 },
  cta: { width: 600, height: 160 },
  alert: { width: 400, height: 56 },
  banner: { width: 800, height: 48 },
  stat: { width: 200, height: 120 },
  stepper: { width: 480, height: 48 },
  tag: { width: 72, height: 28 },
  rating: { width: 160, height: 28 },
  map: { width: 480, height: 300 },
  timeline: { width: 360, height: 320 },
  fileUpload: { width: 360, height: 180 },
  codeBlock: { width: 480, height: 200 },
  calendar: { width: 300, height: 300 },
  notification: { width: 360, height: 72 },
  productCard: { width: 280, height: 360 },
  profile: { width: 280, height: 200 },
  drawer: { width: 320, height: 400 },
  popover: { width: 240, height: 160 },
  logo: { width: 120, height: 40 },
  faq: { width: 560, height: 320 },
  gallery: { width: 560, height: 360 },
  checkbox: { width: 20, height: 20 },
  radio: { width: 20, height: 20 },
  slider: { width: 240, height: 32 },
  datePicker: { width: 300, height: 320 },
  skeleton: { width: 320, height: 120 },
  chip: { width: 96, height: 32 },
  icon: { width: 24, height: 24 },
  spinner: { width: 32, height: 32 },
  feature: { width: 360, height: 200 },
  team: { width: 560, height: 280 },
  login: { width: 360, height: 360 },
  contact: { width: 400, height: 320 },
};

// Component registry with sections and labels
export const COMPONENT_REGISTRY: ComponentSection[] = [
  {
    section: "Layout",
    items: [
      { type: "navigation", label: "Navigation", ...DEFAULT_SIZES.navigation },
      { type: "header", label: "Header", ...DEFAULT_SIZES.header },
      { type: "hero", label: "Hero", ...DEFAULT_SIZES.hero },
      { type: "section", label: "Section", ...DEFAULT_SIZES.section },
      { type: "sidebar", label: "Sidebar", ...DEFAULT_SIZES.sidebar },
      { type: "footer", label: "Footer", ...DEFAULT_SIZES.footer },
      { type: "modal", label: "Modal", ...DEFAULT_SIZES.modal },
      { type: "banner", label: "Banner", ...DEFAULT_SIZES.banner },
      { type: "drawer", label: "Drawer", ...DEFAULT_SIZES.drawer },
      { type: "popover", label: "Popover", ...DEFAULT_SIZES.popover },
      { type: "divider", label: "Divider", ...DEFAULT_SIZES.divider },
    ],
  },
  {
    section: "Content",
    items: [
      { type: "card", label: "Card", ...DEFAULT_SIZES.card },
      { type: "text", label: "Text", ...DEFAULT_SIZES.text },
      { type: "image", label: "Image", ...DEFAULT_SIZES.image },
      { type: "video", label: "Video", ...DEFAULT_SIZES.video },
      { type: "table", label: "Table", ...DEFAULT_SIZES.table },
      { type: "grid", label: "Grid", ...DEFAULT_SIZES.grid },
      { type: "list", label: "List", ...DEFAULT_SIZES.list },
      { type: "chart", label: "Chart", ...DEFAULT_SIZES.chart },
      { type: "codeBlock", label: "Code Block", ...DEFAULT_SIZES.codeBlock },
      { type: "map", label: "Map", ...DEFAULT_SIZES.map },
      { type: "timeline", label: "Timeline", ...DEFAULT_SIZES.timeline },
      { type: "calendar", label: "Calendar", ...DEFAULT_SIZES.calendar },
      { type: "accordion", label: "Accordion", ...DEFAULT_SIZES.accordion },
      { type: "carousel", label: "Carousel", ...DEFAULT_SIZES.carousel },
      { type: "logo", label: "Logo", ...DEFAULT_SIZES.logo },
      { type: "faq", label: "FAQ", ...DEFAULT_SIZES.faq },
      { type: "gallery", label: "Gallery", ...DEFAULT_SIZES.gallery },
    ],
  },
  {
    section: "Controls",
    items: [
      { type: "button", label: "Button", ...DEFAULT_SIZES.button },
      { type: "input", label: "Input", ...DEFAULT_SIZES.input },
      { type: "search", label: "Search", ...DEFAULT_SIZES.search },
      { type: "form", label: "Form", ...DEFAULT_SIZES.form },
      { type: "tabs", label: "Tabs", ...DEFAULT_SIZES.tabs },
      { type: "dropdown", label: "Dropdown", ...DEFAULT_SIZES.dropdown },
      { type: "toggle", label: "Toggle", ...DEFAULT_SIZES.toggle },
      { type: "stepper", label: "Stepper", ...DEFAULT_SIZES.stepper },
      { type: "rating", label: "Rating", ...DEFAULT_SIZES.rating },
      { type: "fileUpload", label: "File Upload", ...DEFAULT_SIZES.fileUpload },
      { type: "checkbox", label: "Checkbox", ...DEFAULT_SIZES.checkbox },
      { type: "radio", label: "Radio", ...DEFAULT_SIZES.radio },
      { type: "slider", label: "Slider", ...DEFAULT_SIZES.slider },
      { type: "datePicker", label: "Date Picker", ...DEFAULT_SIZES.datePicker },
    ],
  },
  {
    section: "Elements",
    items: [
      { type: "avatar", label: "Avatar", ...DEFAULT_SIZES.avatar },
      { type: "badge", label: "Badge", ...DEFAULT_SIZES.badge },
      { type: "tag", label: "Tag", ...DEFAULT_SIZES.tag },
      { type: "breadcrumb", label: "Breadcrumb", ...DEFAULT_SIZES.breadcrumb },
      { type: "pagination", label: "Pagination", ...DEFAULT_SIZES.pagination },
      { type: "progress", label: "Progress", ...DEFAULT_SIZES.progress },
      { type: "alert", label: "Alert", ...DEFAULT_SIZES.alert },
      { type: "toast", label: "Toast", ...DEFAULT_SIZES.toast },
      { type: "notification", label: "Notification", ...DEFAULT_SIZES.notification },
      { type: "tooltip", label: "Tooltip", ...DEFAULT_SIZES.tooltip },
      { type: "stat", label: "Stat", ...DEFAULT_SIZES.stat },
      { type: "skeleton", label: "Skeleton", ...DEFAULT_SIZES.skeleton },
      { type: "chip", label: "Chip", ...DEFAULT_SIZES.chip },
      { type: "icon", label: "Icon", ...DEFAULT_SIZES.icon },
      { type: "spinner", label: "Spinner", ...DEFAULT_SIZES.spinner },
    ],
  },
  {
    section: "Blocks",
    items: [
      { type: "pricing", label: "Pricing", ...DEFAULT_SIZES.pricing },
      { type: "testimonial", label: "Testimonial", ...DEFAULT_SIZES.testimonial },
      { type: "cta", label: "CTA", ...DEFAULT_SIZES.cta },
      { type: "productCard", label: "Product Card", ...DEFAULT_SIZES.productCard },
      { type: "profile", label: "Profile", ...DEFAULT_SIZES.profile },
      { type: "feature", label: "Feature", ...DEFAULT_SIZES.feature },
      { type: "team", label: "Team", ...DEFAULT_SIZES.team },
      { type: "login", label: "Login", ...DEFAULT_SIZES.login },
      { type: "contact", label: "Contact", ...DEFAULT_SIZES.contact },
    ],
  },
];

// Flat lookup map
export const COMPONENT_MAP: Record<string, ComponentDefinition> = {};
for (const section of COMPONENT_REGISTRY) {
  for (const item of section.items) {
    COMPONENT_MAP[item.type] = item;
  }
}

// =============================================================================
// Blank Canvas Types
// =============================================================================

export type CanvasPurpose = "new-page" | "replace-current";

export type WireframeOptions = {
  wireframePurpose?: string;
};

// =============================================================================
// Rearrange Mode Types
// =============================================================================

export type SectionRect = { x: number; y: number; width: number; height: number };

export type DetectedSection = {
  id: string;
  label: string;
  tagName: string;
  selector: string;
  role: string | null;
  className: string | null;
  textSnippet: string | null;
  originalRect: SectionRect;
  currentRect: SectionRect;
  originalIndex: number;
  isFixed?: boolean;
  note?: string;
};

export type RearrangeState = {
  sections: DetectedSection[];
  originalOrder: string[];
  detectedAt: number;
};

