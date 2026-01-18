"use client";

export default function LogicPage() {
  return (
    <article className="article">
      <header>
        <h1>Agentation Logic</h1>
        <p className="tagline">Detailed documentation of animation and interaction decisions</p>
      </header>

      {/* ========================================================================= */}
      <section>
        <h2>Animation System Overview</h2>
        <p>
          The CSS-only version uses pure CSS animations instead of framer-motion. All animations use
          <code>transform</code> and <code>opacity</code> properties for GPU acceleration.
        </p>

        <h3>Animation Timing</h3>
        <ul>
          <li><strong>Enter animations:</strong> 0.2s with <code>cubic-bezier(0.34, 1.56, 0.64, 1)</code> (spring-like overshoot)</li>
          <li><strong>Exit animations:</strong> 0.15s with <code>ease-in</code> (quick fade out)</li>
          <li><strong>Shake animation:</strong> 0.25s with <code>ease-out</code></li>
          <li><strong>Hover transitions:</strong> 0.1-0.15s with <code>ease</code></li>
        </ul>

        <h3>Animation States</h3>
        <p>Components track animation state to prevent conflicts:</p>
        <ul>
          <li><strong>Popup states:</strong> <code>initial</code> → <code>enter</code> → <code>entered</code> → <code>exit</code></li>
          <li><strong>Marker states:</strong> Track via <code>animatedMarkers</code> Set and <code>exitingMarkers</code> Set</li>
          <li><strong>Why "entered" state:</strong> After enter animation completes, we set explicit transform/opacity to prevent flash when shake animation runs</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Marker Animations</h2>

        <h3>Enter Animation (markerIn)</h3>
        <ul>
          <li>Scale from 0 → 1.1 → 1 (overshoot effect)</li>
          <li>Fade in during first 70% of animation</li>
          <li>Uses <code>animation-fill-mode: both</code> to hold initial and final states</li>
          <li>Markers track "animated" state - once animated in, they don't replay enter animation</li>
        </ul>

        <h3>Exit Animation (markerOut)</h3>
        <ul>
          <li>Scale from 1 → 0 with fade out</li>
          <li>Markers turn red with X icon before animating out</li>
          <li>Track via <code>exitingMarkers</code> Set to keep marker in DOM during animation</li>
        </ul>

        <h3>Clear All Animation</h3>
        <ul>
          <li>Uses <code>animation-delay</code> for staggered effect (30ms per marker)</li>
          <li>Total animation time calculated as: <code>count * 30 + 200</code>ms</li>
          <li>All markers removed from state after animation completes</li>
        </ul>

        <h3>Hover Effect</h3>
        <ul>
          <li>Scale to 1.1 on hover</li>
          <li>Only applies when NOT animating: <code>:not(.enter):not(.exit):not(.clearing):hover</code></li>
          <li>Background turns red, number changes to X icon</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Popup Animations</h2>

        <h3>Enter Animation (popupEnter)</h3>
        <ul>
          <li>Scale from 0.95 → 1, translate up 4px, fade in</li>
          <li>Maintains <code>translateX(-50%)</code> for centering throughout</li>
          <li>After 200ms, state changes to "entered" with explicit transform values</li>
        </ul>

        <h3>Exit Animation (popupExit)</h3>
        <ul>
          <li>Reverse of enter: scale down, translate down, fade out</li>
          <li>Triggered by <code>handleCancel</code> which sets exit state, waits 150ms, then calls <code>onCancel</code></li>
          <li>Pending marker also animates out simultaneously</li>
        </ul>

        <h3>Shake Animation</h3>
        <ul>
          <li>Horizontal shake: 0 → -3px → 3px → -2px → 2px → 0</li>
          <li>Only runs when in "entered" state (prevents flash issue)</li>
          <li>Maintains all other transform values during shake</li>
          <li>Triggered when user clicks outside popup while it's open</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Interaction Logic</h2>

        <h3>Click Handling</h3>
        <ul>
          <li>Uses <strong>capture phase</strong> (<code>addEventListener(..., true)</code>) to intercept before element handlers</li>
          <li>Ignores clicks on: toolbar, popup, markers</li>
          <li>When popup is open and user clicks interactive element:
            <ul>
              <li>If <code>blockInteractions</code> is ON: prevent default, create annotation</li>
              <li>If <code>blockInteractions</code> is OFF: let click through, shake popup</li>
            </ul>
          </li>
        </ul>

        <h3>Text Selection vs Drag Selection</h3>
        <ul>
          <li><strong>Starting on text element:</strong> Native text selection works, drag-to-select disabled</li>
          <li><strong>Starting on non-text element:</strong> Drag-to-select enabled</li>
          <li>Text elements defined as: P, SPAN, H1-H6, LI, TD, TH, LABEL, BLOCKQUOTE, PRE, CODE, A, EM, STRONG, etc.</li>
          <li>Cursor shows <code>text</code> for text elements, <code>crosshair</code> for others</li>
        </ul>

        <h3>Drag Selection (Multi-Select)</h3>
        <ul>
          <li><strong>Threshold:</strong> 8px movement before drag starts</li>
          <li><strong>Element detection throttle:</strong> 50ms (no React overhead)</li>
          <li><strong>Final count:</strong> Uses <code>querySelectorAll</code> on mouseup for accurate count</li>
          <li><strong>Meaningful elements:</strong> BUTTON, A, INPUT, IMG, P, H1-H6, LI, LABEL, TD, TH</li>
          <li><strong>Filtering:</strong> Removes parent elements that contain other matched elements</li>
          <li><strong>Size limits:</strong> Ignores elements larger than 80% viewport width AND 50% viewport height</li>
        </ul>

        <h3>Area Selection (Empty Space)</h3>
        <ul>
          <li>If drag completes with no elements selected, creates an "Area selection" annotation</li>
          <li>Requires minimum drag size (20×20px) to avoid accidental creations</li>
          <li>Stores bounding box of the selected region</li>
          <li>Uses special placeholder: "What should change in this area?"</li>
          <li>Treated as multi-select (green marker, dashed outline on hover)</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Marker Hover Outlines</h2>
        <p>When hovering over an annotation marker, a subtle outline shows the target element's bounding box.</p>

        <h3>Single Annotations (Blue)</h3>
        <ul>
          <li>Uses <code>singleSelectOutline</code> class</li>
          <li>Solid border using the user's selected accent color</li>
          <li>Color applied via inline styles: <code>borderColor</code> and <code>backgroundColor</code></li>
        </ul>

        <h3>Multi-Select Annotations (Green)</h3>
        <ul>
          <li>Uses <code>multiSelectOutline</code> class</li>
          <li>Dashed border in green (#34C759)</li>
          <li>Shows the combined bounding box of all selected elements</li>
        </ul>

        <h3>Implementation</h3>
        <ul>
          <li>Only shown when <code>hoveredMarkerId</code> is set and <code>pendingAnnotation</code> is null</li>
          <li>Position uses stored <code>boundingBox</code> from annotation, adjusted for scroll</li>
          <li>Animates in with <code>fadeIn</code> keyframes</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Fixed Element Handling</h2>

        <h3>Detection</h3>
        <ul>
          <li>Walks up DOM tree checking <code>position: fixed</code> or <code>position: sticky</code></li>
          <li>Stores <code>isFixed</code> boolean on annotation</li>
        </ul>

        <h3>Marker Positioning</h3>
        <ul>
          <li><strong>Fixed elements:</strong> Rendered in <code>.fixedMarkersLayer</code> (position: fixed)</li>
          <li><strong>Normal elements:</strong> Rendered in <code>.markersLayer</code> (position: absolute)</li>
          <li>Fixed markers use <code>clientY</code> for Y position</li>
          <li>Normal markers use <code>clientY + scrollY</code> for Y position</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Cursor System</h2>

        <h3>Dynamic Cursor Injection</h3>
        <ul>
          <li>Injects <code>&lt;style&gt;</code> element with ID <code>feedback-cursor-styles</code></li>
          <li>Removed when toolbar deactivates</li>
        </ul>

        <h3>Cursor Rules (in order of specificity)</h3>
        <ol>
          <li><code>body *</code> → crosshair (base rule)</li>
          <li>Text elements and their children → text cursor</li>
          <li><code>[data-feedback-toolbar]</code> → default cursor</li>
          <li><code>[data-annotation-marker]</code> → pointer cursor</li>
        </ol>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Scroll Behavior</h2>

        <h3>Scroll State Tracking</h3>
        <ul>
          <li>Sets <code>isScrolling</code> to true on scroll event</li>
          <li>Clears after 150ms of no scrolling (via timeout)</li>
          <li>Uses passive event listener for performance</li>
        </ul>

        <h3>UI During Scroll</h3>
        <ul>
          <li>Hover highlight hidden during scroll</li>
          <li>Hover tooltip hidden during scroll</li>
          <li>Markers remain visible (fixed markers stay in place)</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Settings Panel</h2>

        <h3>Visibility Logic</h3>
        <ul>
          <li>Uses two states: <code>showSettings</code> (desired) and <code>showSettingsVisible</code> (for animation)</li>
          <li>When closing: <code>showSettings</code> → false immediately, <code>showSettingsVisible</code> → false after 150ms</li>
          <li>Auto-closes when toolbar closes</li>
        </ul>

        <h3>Styling</h3>
        <ul>
          <li>Always uses dark theme (matches toolbar aesthetic)</li>
          <li>Position: absolute, anchored to bottom of toolbar</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Performance Optimizations</h2>

        <h3>CSS Performance</h3>
        <ul>
          <li><code>will-change: transform, opacity</code> on animated elements</li>
          <li><code>contain: layout style</code> for layout isolation</li>
          <li>Specific transition properties instead of <code>transition: all</code></li>
          <li><code>pointer-events: none</code> on overlay, re-enabled on children</li>
        </ul>

        <h3>JavaScript Performance</h3>
        <ul>
          <li><strong>Zero React re-renders during drag:</strong> All drag visuals use refs and direct DOM updates</li>
          <li><strong>Throttled element detection:</strong> 50ms during drag (no React overhead)</li>
          <li><strong>Passive event listeners:</strong> scroll, mousemove</li>
          <li><strong>Squared distance comparison:</strong> Skip sqrt calculation for threshold checks</li>
          <li><strong>Set for tag lookup:</strong> O(1) instead of array includes O(n)</li>
          <li><strong>Ref-based tracking:</strong> mouseDownPosRef, dragStartRef, dragRectRef, highlightsContainerRef</li>
          <li><strong>Pooled highlight divs:</strong> Reuse DOM elements instead of creating/destroying</li>
        </ul>

        <h3>Element Detection Strategy</h3>
        <ul>
          <li><strong>During drag (throttled):</strong> Sample 9 points (corners, edges, center) with elementsFromPoint</li>
          <li><strong>On mouseup (accurate):</strong> querySelectorAll for all meaningful elements, check bounding box intersection</li>
        </ul>

        <h3>Drag Selection Architecture</h3>
        <ul>
          <li><strong>Drag rectangle:</strong> <code>dragRectRef</code> updated via <code>style.transform</code> and <code>style.width/height</code></li>
          <li><strong>Element highlights:</strong> <code>highlightsContainerRef</code> contains pooled divs updated directly</li>
          <li><strong>React state only:</strong> <code>isDragging</code> boolean for conditional rendering</li>
          <li><strong>No state during drag:</strong> mousemove handler never calls setState for visual updates</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>State Management</h2>

        <h3>Core States</h3>
        <ul>
          <li><code>isActive</code> / <code>isActiveVisible</code> - toolbar open state with exit animation</li>
          <li><code>annotations</code> - array of saved annotations</li>
          <li><code>pendingAnnotation</code> - annotation being created (popup open)</li>
          <li><code>pendingExiting</code> - tracks when pending annotation is animating out</li>
          <li><code>showMarkers</code> - user's visibility toggle preference</li>
          <li><code>isFrozen</code> - animation pause state</li>
        </ul>

        <h3>Unified Marker Visibility</h3>
        <p>
          Marker visibility is controlled by a <strong>single computed value</strong> that handles both toolbar and eye toggle:
        </p>
        <ul>
          <li><code>shouldShowMarkers = isActive && showMarkers</code> - computed from both states</li>
          <li><code>markersVisible</code> - whether markers are currently rendered</li>
          <li><code>markersExiting</code> - whether markers are animating out</li>
        </ul>
        <p>
          This replaces the previous approach with separate <code>isToolbarExiting</code>, <code>showMarkersVisible</code>,
          and <code>isMarkersHiding</code> states. Now there's one effect that handles all marker show/hide:
        </p>
        <ul>
          <li><strong>Toolbar opens:</strong> <code>shouldShowMarkers</code> → true → markers animate in</li>
          <li><strong>Toolbar closes:</strong> <code>shouldShowMarkers</code> → false → markers animate out</li>
          <li><strong>Eye toggle off:</strong> <code>shouldShowMarkers</code> → false → markers animate out</li>
          <li><strong>Eye toggle on:</strong> <code>shouldShowMarkers</code> → true → markers animate in</li>
        </ul>

        <h3>Animation States</h3>
        <ul>
          <li><code>animatedMarkers</code> - Set of marker IDs that have completed enter animation</li>
          <li><code>exitingMarkers</code> - Set of marker IDs currently animating out (individual delete)</li>
          <li><code>hoveredMarkerId</code> / <code>deletingMarkerId</code> - for hover/delete states</li>
          <li><code>isClearing</code> - clear all animation in progress</li>
        </ul>

        <h3>Drag States (Refs Only)</h3>
        <ul>
          <li><code>isDragging</code> - only React state needed (for conditional rendering)</li>
          <li><code>mouseDownPosRef</code> - initial mouse position</li>
          <li><code>dragStartRef</code> - confirmed drag start position (after threshold)</li>
          <li><code>dragRectRef</code> - DOM ref for selection rectangle</li>
          <li><code>highlightsContainerRef</code> - DOM ref for element highlights container</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Z-Index Hierarchy</h2>
        <ul>
          <li><code>100000</code> - Toolbar</li>
          <li><code>99999</code> - Overlay (hover highlight, popup, pending marker)</li>
          <li><code>99998</code> - Markers layers (both fixed and absolute)</li>
          <li><code>99997</code> - Drag selection rectangle</li>
          <li><code>99996</code> - Selected element highlights</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>Data Attributes</h2>
        <ul>
          <li><code>data-feedback-toolbar</code> - Main toolbar container, markers layers (for click exclusion)</li>
          <li><code>data-annotation-popup</code> - Popup container (for click exclusion)</li>
          <li><code>data-annotation-marker</code> - Individual markers (for cursor and click handling)</li>
        </ul>
      </section>

      {/* ========================================================================= */}
      <section>
        <h2>LocalStorage</h2>

        <h3>Annotations Storage</h3>
        <ul>
          <li>Key: <code>feedback-annotations-[pathname]</code></li>
          <li>Stores: Array of annotation objects</li>
          <li>Expiry: 7 days (checked on load)</li>
        </ul>

        <h3>Settings Storage</h3>
        <ul>
          <li>Key: <code>feedback-toolbar-settings</code></li>
          <li>Stores: outputDetail, autoClearAfterCopy, annotationColor, blockInteractions</li>
          <li>No expiry</li>
        </ul>
      </section>
    </article>
  );
}
