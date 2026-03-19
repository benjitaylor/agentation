'use client';

import * as React from 'react';
import { useActiveScrollElement } from '../hooks/useActiveScrollElement';

type Heading = {
  id: string;
  level: number;
  text: string;
};

type TableOfContentsProps = React.HTMLAttributes<HTMLElement> & {
  headings: Heading[];
  title?: string;
};

/** Table of Contents with scrollspy and animated indicator */
export const TOC: React.FC<TableOfContentsProps> = ({
  headings,
  title = 'On This Page',
  ...props
}) => {
  const activeLink = React.useRef<HTMLAnchorElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const ids = React.useMemo(() => headings.map((h) => h.id), [headings]);
  const activeHeading = useActiveScrollElement(ids);

  React.useEffect(() => {
    if (activeLink.current) {
      setStyle({
        top: activeLink.current.offsetTop + 'px',
        height: activeLink.current.offsetHeight + 'px',
      });
    }
  }, [activeHeading]);

  return (
    <aside data-toc="" {...props}>
      {title && <span data-toc-title="">{title}</span>}

      <ul
        data-toc-list=""
        style={{
          ['--active-top' as string]: style.top,
          ['--active-height' as string]: style.height,
        }}
      >
        {headings.map(({ id, text, level }, i) => {
          const isActive = activeHeading === id;

          return (
            <li key={i} data-toc-item="" data-level={level}>
              <a
                href={`#${id}`}
                ref={isActive ? activeLink : null}
                aria-current={isActive || undefined}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
