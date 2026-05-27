# 代码审查与文档优化记录

> 每 5 分钟自动审查，只审查和提交文档，不修改业务代码。

---

## 审查 #16 — 2026-05-27 23:00

**分支**: master (ahead of origin by 17 commits)
**未提交业务变更** (10 files, +113/-115):

### 新增变更（相对审查 #15）

- `components/blog/CommentSection.tsx` — `<img>` → `<Image>` (2 处)
- `next.config.ts` — 添加 `images.remotePatterns` for `avatars.githubusercontent.com`
- `__tests__/MarkdownRenderer.test.tsx` — 移除多余 eslint-disable 注释

### 审查结论

**本次新增变更合理，无问题。**

- CommentSection.tsx: 与 CommentForm.tsx 一致，`<img>` → `<Image>`，好改进
- next.config.ts: `remotePatterns` 配置正确，为 GitHub avatar CDN 添加白名单
- MarkdownRenderer.test.tsx: 移除不必要的 eslint-disable 注释，好
- **ESLint: 0 errors, 0 warnings** — 全部清理完毕

### 遗留问题

- Header.tsx 缩进问题（#14 已报告）仍未修复
- KnowledgeGraph.tsx `mounted` 守卫移除（#15 已报告）

---

## 审查 #15 — 2026-05-27 22:45

**分支**: master (ahead of origin by 16 commits)
**未提交业务变更** (7 files, +88/-110):

### 发现的问题

**[中] KnowledgeGraph.tsx:73 移除 `mounted` 守卫，可能 hydration 不匹配**

- 问题: 原 `isDark = mounted && resolvedTheme === "dark"` 防止 SSR/client 主题不一致。现改为 `isDark = resolvedTheme === "dark"`，SSR 时 `resolvedTheme` 为 `undefined`，首次渲染 `isDark = false`，客户端 hydration 后可能变为 `true`
- 修复: 恢复 `mounted` 状态守卫，或确认 next-themes 已配置 `suppressHydrationWarning`

**[低] Header.tsx:12-14 缩进问题仍未修复**

- 审查 #14 已报告，`<Link>` 标签缩进从 8 空格变为 0

**[低] CommentForm.tsx 移除两处 sign-out 按钮**

- 有意的功能简化？需确认是否影响用户登出流程

### 正面改进

- **ESLint 从 17 → 3 问题**（9 个 error 消除），大幅改善
- KnowledgeGraph.tsx: 5 处 `any` → 正确类型（`GraphNode`、`GraphLink`），移除 5 个 eslint-disable 注释
- SearchDialog.tsx: 提取 `handleOpenChange` callback，状态管理更清晰
- CommentForm.tsx: `<img>` → `<Image>` (next/image)，移除 `signOut` import
- `fgRef` 从 `any` → `{ zoomToFit(duration?: number): void } | null`

---

## 审查 #14 — 2026-05-27 22:30

**分支**: master (ahead of origin by 15 commits)
**未提交业务变更** (7 files, +75/-75):

- 新增: `CommentForm.tsx`, `Header.tsx`, `SearchDialog.tsx`, `lib/auth.ts`
- 沿用: `Backlinks.tsx`, `KnowledgeGraph.tsx`, `ThemeToggle.tsx`

### 本次变更问题

**[高] Header.tsx:12-14 缩进损坏**

- 文件: `components/layout/Header.tsx`
- 问题: `<Link>` 标签缩进从 8 空格变为 0，文本内容和 `</Link>` 缩进也错位
- 与周围 `<div>`（缩进 6 空格）和 `<nav>`（缩进 8 空格）不一致
- 修复: 恢复 `<Link>` 行缩进为 8 空格，文本和 `</Link>` 对齐

**[低] Header.tsx:13 `'` → `&apos;` 实体变更**

- `sayliks's blog` → `sayliks&apos;s blog`，JSX 中两者均可接受

### 无问题变更

- CommentForm.tsx: 添加 eslint-disable 注释（`react-hooks/exhaustive-deps`），合理
- SearchDialog.tsx: 添加 eslint-disable 注释，合理
- lib/auth.ts: 添加 eslint-disable 注释（`@typescript-eslint/no-explicit-any`），合理
- Backlinks/KnowledgeGraph/ThemeToggle: 与此前审查结论一致
