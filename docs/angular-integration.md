# Hướng dẫn Tích hợp Agentation MCP vào Dự án Angular Khác

Tài liệu này hướng dẫn bạn cách mang bộ công cụ phản hồi giao diện **Agentation** (dùng React) tích hợp mượt mà vào bất kỳ một source code Angular (v16+) nào khác thông qua kỹ thuật Web Component Wrapper.

## Bước 1: Cài đặt Dependencies
Agentation được xây dựng bằng React, do đó dự án Angular của bạn cần cài đặt các thư viện React làm dependency cùng với agentation.
Chạy lệnh sau tại thư mục gốc của project:

```bash
npm install agentation react react-dom
npm install --save-dev @types/react @types/react-dom
```

## Bước 2: Cấu hình TypeScript (tsconfig.json)
Để Angular (sử dụng TypeScript) hiểu được cú pháp JSX/TSX và các package React, bạn cần thêm/sửa các thuộc tính sau trong file `tsconfig.json` (hoặc `tsconfig.app.json`):

```json
{
  "compilerOptions": {
    "jsx": "react",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## Bước 3: Import CSS của Agentation
Thư viện `agentation` không cấu hình export CSS công khai. Nếu bạn bỏ file CSS của nó vào `angular.json` sẽ gây lỗi.
Cách xử lý tốt nhất là bypass bộ module resolver bằng cách dùng **đường dẫn tương đối tuyệt đối** bên trong file `src/styles.scss` (hoặc `styles.css`) của dự án.

Mở `styles.scss` và thêm dòng sau lên đầu:
```scss
/* Thay đổi số lượng ../ cho đúng với cấu trúc thư mục từ file scss ra tới thư mục gốc chứa node_modules */
@import '../../../node_modules/agentation/dist/index.css';
```

## Bước 4: Tạo Component Wrapper
Tạo một file có tên `agentation-wrapper.ts` (ví dụ ở `src/app/shared/components/agentation-wrapper.ts`) để bọc (wrap) React component thành Angular Component:

```typescript
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import * as React from 'react';
import { Agentation } from 'agentation';

@Component({
  selector: 'app-agentation',
  template: `<div #reactContainer></div>`,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class AgentationWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('reactContainer', { static: true }) container!: ElementRef;
  private root!: Root;

  ngOnInit() {
    this.root = createRoot(this.container.nativeElement);
    this.root.render(React.createElement(Agentation as any, {
      endpoint: "http://localhost:4747" // Cổng mặc định của Agentation MCP
    }));
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }
}
```

## Bước 5: Kích hoạt trên toàn ứng dụng
Cuối cùng, bạn chỉ cần import Component này vào Root (thường là `app.component.ts` hoặc `app.ts` nếu dùng Standalone API) và đặt nó vào template gốc.

**Trong app.component.ts:**
```typescript
import { AgentationWrapperComponent } from './shared/components/agentation-wrapper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AgentationWrapperComponent],
  template: `
    <router-outlet></router-outlet>
    <!-- Nhúng agentation vào cuối body -->
    <app-agentation></app-agentation>
  `
})
export class AppComponent {}
```

---
**🎉 Hoàn tất!** Giờ đây bạn có thể mở ứng dụng Angular trên trình duyệt và để lại comment (annotations). Các AI Agent (như tôi) có thể đọc được các comment đó thông qua giao thức MCP (Model Context Protocol).