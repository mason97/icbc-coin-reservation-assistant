# 工行预约助手 - Chrome Extension

ICBC Coin Reservation Assistant - Chrome Extension

---

## 项目介绍 | Project Description

### 中文

**工行预约助手** 是一个Chrome浏览器扩展插件，专门用于自动化填写工商银行纪念币预约表单。

**解决什么问题？**
- 每次预约纪念币时，需要反复输入相同的个人信息（姓名、身份证号、手机号等）
- 手动填写耗时且容易出错
- 预约高峰期，手动填写速度慢可能错过预约机会

**本项目通过以下方式解决：**
- 在Chrome扩展中配置个人信息
- 在预约页面一键自动填充所有表单字段
- 大幅提高填写速度和准确性

---

### English

**ICBC Coin Reservation Assistant** is a Chrome browser extension designed to automate the form filling process for Industrial and Commercial Bank of China (ICBC) coin reservation.

**What problem does it solve?**
- Each time reserving commemorative coins, you need to repeatedly input the same personal information (name, ID number, phone number, etc.)
- Manual filling is time-consuming and prone to errors
- During peak reservation periods, slow manual filling may cause you to miss reservation opportunities

**This project solves this by:**
- Configuring personal information in the Chrome extension
- One-click auto-fill of all form fields on the reservation page
- Greatly improving filling speed and accuracy

---

## 功能特性 | Features

- ✨ UI界面配置管理
- 💾 数据持久化存储（Chrome Storage）
- 👥 多用户支持
- 🚀 一键自动填充表单
- ⚡ 快速切换用户
- 🎨 简洁直观的界面设计

---

## 安装方法 | Installation

### 中文

1. 下载或克隆项目到本地
   ```bash
   git clone <repository-url>
   ```

2. 打开Chrome浏览器，进入扩展管理页面
   - 地址栏输入：`chrome://extensions/`
   - 或点击菜单 > 更多工具 > 扩展程序

3. 开启右上角的"开发者模式"

4. 点击"加载已解压的扩展程序"

5. 选择项目文件夹 `icbc-coin-reservation-assistant`

6. 扩展安装完成！

### English

1. Download or clone the project to your local machine
   ```bash
   git clone <repository-url>
   ```

2. Open Chrome browser and go to Extensions page
   - Enter in address bar: `chrome://extensions/`
   - Or click Menu > More Tools > Extensions

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked"

5. Select the project folder `icbc-coin-reservation-assistant`

6. Extension installed successfully!

---

## 使用教程 | Usage Guide

### 中文

#### 第一步：配置用户信息

1. **打开配置页面**
   - 右键点击浏览器右上角的扩展图标
   - 选择"选项"或"Options"

2. **填写基础配置**
   - 兑换日期：选择你想要预约的日期
   - 网点关键字：输入你所在地区的关键词（如：孝昌）
   - 预约数量：输入想要预约的数量（如：20）

3. **添加用户信息**
   - 点击"添加用户"按钮
   - 填写用户的姓名、身份证号、手机号
   - 可以添加多个用户（以备不同人使用）

4. **保存配置**
   - 点击"保存配置"按钮
   - 配置会自动保存到浏览器

#### 第二步：使用自动填充

1. 打开工商银行的纪念币预约页面

2. 点击浏览器右上角的扩展图标

3. 在弹出的面板中：
   - 确认显示的网点关键字和兑换日期
   - 从列表中选择要预约的用户（如果有多个）
   - 点击"开始自动填充"按钮

4. 扩展会自动：
   - 填充用户的基本信息（姓名、身份证号、手机号）
   - 填充预约数量
   - 自动搜索并选择网点
   - 选择兑换日期
   - 勾选协议条款

5. 检查表单内容，确认无误后提交

---

### English

#### Step 1: Configure User Information

1. **Open Configuration Page**
   - Right-click the extension icon in the top right corner of the browser
   - Select "Options"

2. **Fill Basic Configuration**
   - Target Date: Select your desired reservation date
   - Branch Keyword: Enter your area keyword (e.g., your city/district name)
   - Quantity: Enter the number of coins you want to reserve (e.g., 20)

3. **Add User Information**
   - Click "Add User" button
   - Fill in user's name, ID number, and phone number
   - You can add multiple users (for different people)

4. **Save Configuration**
   - Click "Save Configuration" button
   - Configuration will be automatically saved to browser

#### Step 2: Use Auto-Fill

1. Open ICBC commemorative coin reservation page

2. Click the extension icon in the top right corner

3. In the popup panel:
   - Confirm displayed branch keyword and target date
   - Select the user from the list (if multiple users)
   - Click "Start Auto-Fill" button

4. The extension will automatically:
   - Fill in user's basic information (name, ID number, phone number)
   - Fill in reservation quantity
   - Search and select branch
   - Select exchange date
   - Check agreement checkbox

5. Review the form content and submit after confirming it's correct

---

## 项目结构 | Project Structure

```
icbc-coin-reservation-assistant/
├── manifest.json          # Chrome扩展配置文件
├── popup.html             # 扩展弹窗界面
├── popup.js               # 弹窗逻辑（注入主程序）
├── options.html           # 配置页面
├── options.js             # 配置页面逻辑
├── config/
│   └── defaults.json      # 默认配置
└── README.md              # 本文档
```

---

## 技术说明 | Technical Notes

- **Manifest Version**: Chrome Extension Manifest V3
- **Storage**: Chrome Storage API (chrome.storage.sync)
- **Script Injection**: chrome.scripting.executeScript
- **Permissions**: activeTab, scripting, storage

---

## 注意事项 | Important Notes

### 中文

- ⚠️ 本工具仅用于自动化填写表单，不绕过任何验证机制
- ⚠️ 请确保填写的信息准确无误
- ⚠️ 使用前请在配置页面正确设置所有必填信息
- ⚠️ 建议在正式预约前先进行测试

### English

- ⚠️ This tool is for automating form filling only and does not bypass any verification mechanisms
- ⚠️ Please ensure all information entered is accurate
- ⚠️ Make sure to properly set all required information in the configuration page before use
- ⚠️ Testing before the actual reservation is recommended

---

## 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!

---

## 许可证 | License

本项目仅供学习和个人使用。

This project is for educational and personal use only.

---

## 更新日志 | Changelog

### v1.0
- ✨ 初始版本
- ✨ UI界面配置管理
- ✨ 多用户支持
- ✨ 一键自动填充

---

## 联系方式 | Contact

如有问题，请提交 Issue。

If you have any questions, please submit an Issue.

---

**免责声明 | Disclaimer**

本工具旨在提高用户填写表单的效率，请合理使用并遵守相关网站的使用条款。使用者应自行承担使用本工具的责任。

This tool is designed to improve efficiency in filling out forms. Please use it reasonably and comply with the terms of use of the relevant websites. Users should bear their own responsibility for using this tool.
