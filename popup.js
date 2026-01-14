// ==========================================
// 配置加载模块
// =========================================
async function loadConfiguration() {
  try {
    const result = await chrome.storage.sync.get(['icbcConfig']);
    if (result.icbcConfig) {
      return result.icbcConfig;
    } else {
      const response = await fetch(chrome.runtime.getURL('config/defaults.json'));
      const defaultConfig = await response.json();
      // 如果defaults.json是空的，不要保存到storage，让用户下次重新加载
      if (!defaultConfig || !defaultConfig.users || defaultConfig.users.length === 0) {
        console.log('默认配置为空，不保存到storage');
        return { targetDate: "", branchKeyword: "", quantity: "", users: [] };
      }
      await chrome.storage.sync.set({ icbcConfig: defaultConfig });
      return defaultConfig;
    }
  } catch (error) {
    console.error('加载配置失败:', error);
    return { targetDate: "", branchKeyword: "", quantity: "", users: [] };
  }
}

// ==========================================
// 主程序入口
// =========================================
document.getElementById('pinBtn').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 加载配置
  const config = await loadConfiguration();

  // 注入脚本
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: injectFormAssistant,
    args: [config.users, config]
  });

  // 关闭弹窗
  window.close();
});

// ==========================================
// 表单助手核心逻辑（注入到页面）- 原始精确版本
// =========================================
function injectFormAssistant(users, config) {
  if (document.getElementById('stable-icbc-panel')) return;

  const panel = document.createElement('div');
  panel.id = 'stable-icbc-panel';
  panel.innerHTML = `
    <div style="background:#c10d0d;color:white;padding:8px;font-weight:bold;display:flex;justify-content:space-between;font-size:13px;border-radius:8px 8px 0 0;">
      <span>工行预约助手</span>
      <span id="close-p" style="cursor:pointer">×</span>
    </div>
    <div style="padding:10px;background:white;border:2px solid #c10d0d;border-radius:0 0 8px 8px;">
      <div style="font-size:11px;color:#666;margin-bottom:5px;">网点搜：${config.branchKeyword}</div>
      <div style="font-size:11px;color:#c10d0d;margin-bottom:10px;font-weight:bold;">日期选：${config.targetDate}</div>
      <div style="max-height:180px;overflow-y:auto;margin-bottom:10px;border-bottom:1px solid #eee;">
        ${users.map((u, i) => `
          <div style="display:flex;align-items:center;margin-bottom:8px;font-size:13px;">
            <input type="radio" name="icbc_u" value="${i}" id="s_${i}" ${i === 0 ? 'checked' : ''}>
            <label for="s_${i}" style="margin-left:8px;cursor:pointer;">${u.name}</label>
          </div>
        `).join('')}
      </div>
      <button id="do_fill_all" style="width:100%;padding:10px;background:#c10d0d;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">开始自动填充</button>
    </div>
  `;
  panel.style.cssText = "position:fixed;top:100px;right:20px;width:180px;z-index:2147483647;font-family:sans-serif;box-shadow:0 4px 15px rgba(0,0,0,0.3);";
  document.body.appendChild(panel);

  document.getElementById('close-p').onclick = () => panel.remove();

  document.getElementById('do_fill_all').onclick = (e) => {
    e.preventDefault();

    // 验证用户列表不为空
    if (!users || users.length === 0) {
      alert('错误：没有可用的用户数据，请在扩展选项中配置用户信息');
      return;
    }

    const index = parseInt(document.querySelector('input[name="icbc_u"]:checked').value);
    const user = users[index];

    // 验证选中的用户存在
    if (!user) {
      alert('错误：未找到选中的用户信息');
      return;
    }

    const fillInput = (labelText, value) => {
      const xpath = `//div[contains(., '${labelText}')]/following-sibling::div//input | //label[contains(., '${labelText}')]/following-sibling::div//input`;
      const input = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    // 1. 填充个人基本信息
    fillInput("客户姓名", user.name);
    fillInput("证件号码", user.id);
    fillInput("手机号码", user.phone);
    fillInput("预约数量", config.quantity);

    // 2. 处理网点搜索框
    const btnKeyword = Array.from(document.querySelectorAll('span, a, button'))
      .find(el => el.innerText.trim() === '按关键字查询');
    if (btnKeyword) {
      btnKeyword.click();
      setTimeout(() => {
        const searchInput = document.querySelector('input[placeholder*="关键字"], input[placeholder*="网点"]');
        if (searchInput) {
          searchInput.focus();
          searchInput.value = config.branchKeyword;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 500);
    }

    // 3. 自动完成剩余步骤
    const autoFinish = () => {
      const timer = setInterval(() => {
        const timeInput = document.evaluate(`//div[contains(., '兑换时间')]/following-sibling::div//input`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (timeInput && !timeInput.disabled) {
          timeInput.click();
          const opts = Array.from(document.querySelectorAll('.el-select-dropdown__item, li'));
          const targetDate = opts.find(o => o.innerText.trim().includes(config.targetDate));
          if (targetDate) {
            targetDate.click();
            console.log("✅ 日期已选择");

            setTimeout(() => {
              const checkbox = document.querySelector('.el-checkbox__input, .el-checkbox, input[type="checkbox"]');
              if (checkbox && !checkbox.classList.contains('is-checked') && !checkbox.checked) {
                checkbox.click();
                console.log("✅ 协议已勾选");
              }
            }, 300);

            clearInterval(timer);
          }
        }
      }, 500);

      setTimeout(() => clearInterval(timer), 15000);
    };

    autoFinish();
  };
}
