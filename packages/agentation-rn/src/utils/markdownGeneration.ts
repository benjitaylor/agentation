import type { Annotation, MarkdownOutput, OutputDetailLevel } from '../types';

export function generateMarkdown(
  annotations: Annotation[],
  detailLevel: OutputDetailLevel = 'standard'
): MarkdownOutput {
  const timestamp = Date.now();
  const sorted = [...annotations].sort((a, b) => a.y - b.y);

  const firstAnnotation = sorted[0];
  const platform = firstAnnotation?.platform;
  const routeName = firstAnnotation?.routeName;
  const navigationPath = firstAnnotation?.navigationPath;
  const screenDims = firstAnnotation?.screenDimensions;
  const pixelRatio = firstAnnotation?.pixelRatio;

  const pageTitle = routeName || 'App';

  if (annotations.length === 0) {
    return {
      content: `# Page Feedback: ${pageTitle}\n\nNo annotations yet.`,
      count: 0,
      screen: pageTitle,
      timestamp,
    };
  }

  let content = '';

  switch (detailLevel) {
    case 'compact':
      content = generateCompactOutput(sorted, pageTitle);
      break;
    case 'detailed':
      content = generateDetailedOutput(sorted, pageTitle, {
        routeName, navigationPath, platform, screenDims, timestamp,
      });
      break;
    case 'forensic':
      content = generateForensicOutput(sorted, pageTitle, {
        routeName, navigationPath, platform, screenDims, pixelRatio, timestamp,
      });
      break;
    case 'standard':
    default:
      content = generateStandardOutput(sorted, pageTitle, {
        routeName, platform, screenDims, timestamp,
      });
      break;
  }

  return {
    content,
    count: annotations.length,
    screen: pageTitle,
    timestamp,
  };
}

function generateCompactOutput(
  annotations: Annotation[],
  pageTitle: string
): string {
  let content = `## Feedback: ${pageTitle}\n\n`;

  annotations.forEach((annotation, index) => {
    const elementDisplay = annotation.element || 'Component';
    content += `${index + 1}. **${annotation.elementPath}** (${elementDisplay})\n`;
    content += `   ${annotation.comment}\n\n`;
  });

  return content;
}

function generateStandardOutput(
  annotations: Annotation[],
  pageTitle: string,
  context: {
    routeName?: string;
    platform?: string;
    screenDims?: { width: number; height: number };
    timestamp: number;
  }
): string {
  let content = `## Page Feedback: ${pageTitle}\n`;

  if (context.screenDims) {
    content += `**Screen:** ${context.screenDims.width}x${context.screenDims.height}\n`;
  }
  if (context.platform) {
    content += `**Platform:** ${context.platform}\n`;
  }

  content += `\n`;

  annotations.forEach((annotation, index) => {
    content += `### ${index + 1}. ${annotation.element || 'Component'}\n`;
    content += `**Location:** \`${annotation.elementPath}\`\n`;

    if (annotation.componentType) {
      content += `**Component:** ${annotation.componentType}\n`;
    }

    if (annotation.boundingBox) {
      content += `**Position:** ${Math.round(annotation.boundingBox.x)}, ${Math.round(annotation.boundingBox.y)} (${Math.round(annotation.boundingBox.width)}x${Math.round(annotation.boundingBox.height)})\n`;
    }

    content += `**Feedback:** ${annotation.comment}\n\n`;
  });

  return content;
}

function generateDetailedOutput(
  annotations: Annotation[],
  pageTitle: string,
  context: {
    routeName?: string;
    navigationPath?: string;
    platform?: string;
    screenDims?: { width: number; height: number };
    timestamp: number;
  }
): string {
  let content = `## Page Feedback: ${pageTitle}\n`;

  if (context.screenDims) {
    content += `**Screen:** ${context.screenDims.width}x${context.screenDims.height}\n`;
  }
  if (context.routeName) {
    content += `**Route:** ${context.routeName}\n`;
  }
  if (context.navigationPath) {
    content += `**Navigation Path:** ${context.navigationPath}\n`;
  }
  if (context.platform) {
    content += `**Platform:** ${context.platform}\n`;
  }

  content += `\n---\n\n`;

  annotations.forEach((annotation, index) => {
    content += `### ${index + 1}. ${annotation.element || 'Component'}\n\n`;
    content += `**Location:** \`${annotation.elementPath}\`\n`;

    if (annotation.componentType) {
      content += `**Component:** ${annotation.componentType}\n`;
    }

    if (annotation.parentComponents && annotation.parentComponents.length > 0) {
      content += `**Parent Components:** ${annotation.parentComponents.join(' > ')}\n`;
    }

    if (annotation.boundingBox) {
      content += `**Bounding box:** x:${Math.round(annotation.boundingBox.x)}, y:${Math.round(annotation.boundingBox.y)}, ${Math.round(annotation.boundingBox.width)}x${Math.round(annotation.boundingBox.height)}px\n`;
    }

    if (annotation.nearbyText) {
      content += `**Nearby text:** "${annotation.nearbyText}"\n`;
    }

    if (annotation.selectedText) {
      content += `**Selected text:** "${annotation.selectedText}"\n`;
    }

    if (annotation.accessibility) {
      content += `**Accessibility:** ${annotation.accessibility}\n`;
    }

    content += `\n**Issue:** ${annotation.comment}\n\n`;
    content += `---\n\n`;
  });

  content += `**Search tips:** Use the file paths above to find components. `;
  content += `Try \`grep -r "ComponentName"\` or search for the nearby text.\n`;

  return content;
}

function generateForensicOutput(
  annotations: Annotation[],
  pageTitle: string,
  context: {
    routeName?: string;
    navigationPath?: string;
    platform?: string;
    screenDims?: { width: number; height: number };
    pixelRatio?: number;
    timestamp: number;
  }
): string {
  let content = `## Page Feedback: ${pageTitle}\n\n`;

  content += `**Environment:**\n`;
  if (context.routeName) {
    content += `- Route: ${context.routeName}\n`;
  }
  if (context.navigationPath) {
    content += `- Navigation Path: ${context.navigationPath}\n`;
  }
  if (context.platform) {
    content += `- Platform: ${context.platform}\n`;
  }
  if (context.screenDims) {
    content += `- Screen: ${context.screenDims.width}x${context.screenDims.height}\n`;
  }
  if (context.pixelRatio) {
    content += `- Pixel Ratio: ${context.pixelRatio}\n`;
  }
  content += `- Timestamp: ${new Date(context.timestamp).toISOString()}\n`;

  content += `\n---\n\n`;

  annotations.forEach((annotation, index) => {
    content += `### ${index + 1}. ${annotation.element || 'Component'}\n\n`;

    if (annotation.columnNumber) {
      content += `**Source:** ${annotation.elementPath}:${annotation.columnNumber}\n`;
    } else {
      content += `**Source:** ${annotation.elementPath}\n`;
    }

    if (annotation.componentType) {
      content += `**Component Type:** ${annotation.componentType}\n`;
    }

    if (annotation.fullPath) {
      content += `**Full Hierarchy:** ${annotation.fullPath}\n`;
    } else if (annotation.parentComponents && annotation.parentComponents.length > 0) {
      content += `**Full Hierarchy:** ${annotation.parentComponents.join(' > ')} > ${annotation.element}\n`;
    }

    if (annotation.testID) {
      content += `**TestID:** ${annotation.testID}\n`;
    }

    content += `\n**Position:**\n`;
    if (annotation.boundingBox) {
      content += `- Bounding box: x:${Math.round(annotation.boundingBox.x)}, y:${Math.round(annotation.boundingBox.y)}\n`;
      content += `- Dimensions: ${Math.round(annotation.boundingBox.width)}x${Math.round(annotation.boundingBox.height)}px\n`;
    }
    content += `- Annotation at: ${Math.round(annotation.x)}px, ${Math.round(annotation.y)}px\n`;

    if (annotation.selectedText) {
      content += `\n**Selected text:** "${annotation.selectedText}"\n`;
    }
    if (annotation.nearbyText) {
      content += `**Nearby text:** "${annotation.nearbyText}"\n`;
    }
    if (annotation.nearbyElements) {
      content += `**Nearby elements:** ${annotation.nearbyElements}\n`;
    }

    if (annotation.accessibility) {
      content += `**Accessibility:** ${annotation.accessibility}\n`;
    }

    content += `\n**Issue:** ${annotation.comment}\n\n`;
    content += `---\n\n`;
  });

  return content;
}
