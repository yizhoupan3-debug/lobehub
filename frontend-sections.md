# LobeHub 前端侧边栏板块结构

> 文件来源：`src/routes/(main)/home/_layout/`\
> 当前版本根据截图（Home 选中）梳理，适用于后续调整。

---

## 整体布局三层结构

```
SidebarContent
├── Header（顶部）
│   ├── SideBarHeaderLayout（用户行 + 新建按钮）
│   └── Nav（顶部导航菜单项）
│
├── Body（中间可滚动区域）
│   ├── Agent 折叠组 (AccordionItem)
│   └── BottomMenu（底部固定菜单项）
│
└── Footer（底部工具栏）
    ├── Help 帮助菜单（下拉）
    ├── GitHub 图标（可选隐藏）
    ├── Evaluation Lab 图标（可选显示）
    └── ThemeButton（切换主题）
```

---

## 一、Header 区域

**文件路径：** `src/routes/(main)/home/_layout/Header/`

### 1.1 用户行（User 区域）

- **组件：** `Header/components/User.tsx`
- **内容：**
  - 用户头像（Avatar，点击弹出 UserPanel）
  - 用户名称（"Local User" 或登录账号名）
  - 消息 / 同步图标（右侧操作按钮）

### 1.2 新建按钮（AddButton）

- **组件：** `Header/components/AddButton.tsx`
- **位置：** 用户行右侧
- **功能：** 点击新建 Agent / 对话

### 1.3 顶部导航菜单（Nav）

- **组件：** `Header/components/Nav.tsx`
- **数据钩子：** `useNavLayout().topNavItems`
- **当前菜单项（共 4 项）：**

| 顺序 | Key         | 图标            | 标题              | 路由                | 说明                       |
| -- | ----------- | ------------- | --------------- | ----------------- | ------------------------ |
| 1  | `search`    | SearchIcon    | Search（搜索）      | 无（触发 CommandMenu） | 点击时弹出全局搜索面板，不跳转路由        |
| 2  | `home`      | HomeIcon      | Home（主页）        | `/`               | 主页，Agent 列表所在位置          |
| 3  | `pages`     | PagesIcon     | Pages（页面）       | `/page`           | 多功能编辑页面区域                |
| 4  | `community` | CommunityIcon | Marketplace（市场） | `/community`      | 可通过服务端配置 `showMarket` 隐藏 |

---

## 二、Body 区域

**文件路径：** `src/routes/(main)/home/_layout/Body/`

### 2.1 Agent 折叠组

- **组件：** `Body/Agent/index.tsx`
- **容器：** `AccordionItem`（可展开 / 收起，默认展开）
- **标题：** "Agent"（i18n key: `navPanel.agent`）
- **标题行操作：**
  - 右键菜单（ContextMenuTrigger）：配置分组、新建等操作
  - Actions 按钮（省略号 /・・・下拉菜单，加载中时显示 loading）
- **内容：** `Body/Agent/List/` 列表，包含以下子项：

#### 2.1.1 Inbox（收件箱）

- **组件：** `List/InboxItem.tsx`
- **说明：** 系统默认入口，所有未分组对话的汇聚点

#### 2.1.2 Agent 列表项（AgentItem）

- **组件：** `List/AgentItem/`
- **说明：** 单个 Agent（助手）入口，点击进入该 Agent 对话

#### 2.1.3 Agent 分组（Group）

- **组件：** `List/Group/`
- **说明：** 多个 Agent 归入同一分组，支持折叠展开

#### 2.1.4 分组内 Agent（AgentGroupItem）

- **组件：** `List/AgentGroupItem/`
- **说明：** 分组内的单个 Agent 子项

#### 2.1.5 会话 Item

- **组件：** `List/Item/`
- **说明：** 某个 Agent 下的单条对话记录（Session）

### 2.2 BottomMenu（底部固定菜单）

- **组件：** `Body/BottomMenu/index.tsx`
- **数据钩子：** `useNavLayout().bottomMenuItems`
- **当前菜单项（共 1 项）：**

| Key        | 图标               | 标题             | 路由          |
| ---------- | ---------------- | -------------- | ----------- |
| `resource` | ResourceIcon（书架） | Resources（资源库） | `/resource` |

---

## 三、Footer 区域

**文件路径：** `src/routes/(main)/home/_layout/Footer/index.tsx`

Footer 有两种布局模式：

- **expanded**：Help + GitHub + Eval + ThemeButton 全部显示
- **compact**（当前默认）：仅显示 Help 图标（GitHub 等收进 Help 下拉菜单）

### 3.1 Help 帮助菜单（下拉 DropdownMenu）

- **图标：** CircleHelp（?）
- **触发：** 点击图标弹出下拉菜单
- **菜单项：**

| Key           | 图标            | 内容                     | 说明                             |
| ------------- | ------------- | ---------------------- | ------------------------------ |
| `setting`     | Settings2     | Settings → `/settings` | 仅在非 DevMode 下显示（compact 模式中出现） |
| ——            | ——            | 分割线                    | ——                             |
| `docs`        | Book          | Docs 文档                | 跳转官方文档（新标签页）                   |
| `feedback`    | Feather       | Feedback 反馈            | 触发 FeedbackModal               |
| `discord`     | DiscordIcon   | Discord                | 跳转 Discord 社区（新标签页）            |
| ——            | ——            | 分割线                    | ——                             |
| `changelog`   | FileClockIcon | Changelog 更新日志         | 打开 ChangelogModal              |
| `github`      | Github        | GitHub                 | compact 模式且未隐藏时显示              |
| `eval`        | FlaskConical  | Evaluation Lab         | compact + showEvalEntry 时显示    |
| `productHunt` | Rocket        | Product Hunt           | 活动窗口期内限时显示                     |

### 3.2 Settings 入口（DevMode）

- **组件：** `<Link to="/settings">`
- **条件：** `isDevMode === true` 且当前不在 `/settings` 页

### 3.3 ThemeButton（主题切换）

- **组件：** `User/UserPanel/ThemeButton`
- **仅在 expanded 模式下单独显示**

---

## 四、全局特殊功能

### 4.1 CommandMenu（全局搜索）

- **触发：** 点击 Search 菜单 / 快捷键
- **组件：** `features/CommandMenu/`
- **功能：** 全局检索 Agent、对话、指令

### 4.2 User Panel（用户面板）

- **触发：** 点击头像
- **组件：** `features/User/UserPanel/`
- **内容：**
  - 用户信息
  - Memory（记忆）入口（`showMemory: true`）
  - 主题切换（expanded footer 模式下）
  - Settings 入口

### 4.3 ChangelogModal（更新日志弹窗）

- **触发：** Help 菜单 → Changelog
- **特性：** 懒加载 (`shouldLoad` 标志控制)

### 4.4 HighlightNotification（Product Hunt 通知卡片）

- **触发：** 活动时间窗口内自动弹出 / Help 菜单手动触发
- **到期：** 2026-02-01 后不再显示

---

## 五、路由对应关系

| 路由           | 板块 Key      | 对应页面                  |
| ------------ | ----------- | --------------------- |
| `/`          | `home`      | 主页（Home），默认 Agent 选中页 |
| `/page`      | `pages`     | Pages 多功能页面           |
| `/community` | `community` | Marketplace 市场        |
| `/resource`  | `resource`  | Resources 资源库         |
| `/agent/:id` | —           | 单个 Agent 对话页          |
| `/settings`  | —           | 设置页                   |
| `/eval`      | —           | Evaluation Lab 评测页    |

---

## 六、可调整方向建议（待填写）

> 请在下方标注你期望调整的板块及调整意图，完成后告知 AI 执行。

- [ ] **Search**：*（例如：改为始终显示搜索框，而非图标点击）*
- [ ] **Nav 顶部菜单项**：*（例如：新增 / 删除菜单项，调整顺序）*
- [ ] **Agent 折叠区**：*（例如：默认折叠 / 展开，标题改名）*
- [ ] **BottomMenu**：*（例如：新增 Item，或移除 Resources）*
- [ ] **Footer**：*（例如：切换为 expanded 模式，显示主题按钮）*
- [ ] **User Panel**：*（例如：调整显示项目）*
- [ ] **其他**：*（自由填写）*
