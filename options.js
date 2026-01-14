// 配置管理
let currentConfig = {
  targetDate: "",
  branchKeyword: "",
  quantity: "",
  users: []
};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();

  // 绑定事件
  document.getElementById('addUserBtn').addEventListener('click', addUser);
  document.getElementById('saveBtn').addEventListener('click', saveConfig);
  document.getElementById('resetBtn').addEventListener('click', resetConfig);
});

// 加载配置
async function loadConfig() {
  try {
    const result = await chrome.storage.sync.get(['icbcConfig']);

    if (result.icbcConfig) {
      currentConfig = result.icbcConfig;
    } else {
      const response = await fetch('config/defaults.json');
      currentConfig = await response.json();
    }

    // 显示配置
    document.getElementById('targetDate').value = currentConfig.targetDate || '';
    document.getElementById('branchKeyword').value = currentConfig.branchKeyword || '';
    document.getElementById('quantity').value = currentConfig.quantity || '';

    renderUsers();
  } catch (error) {
    console.error('加载配置失败:', error);
    showStatus('加载配置失败', 'error');
  }
}

// 渲染用户列表
function renderUsers() {
  const container = document.getElementById('usersContainer');
  container.innerHTML = '';

  if (!currentConfig.users || currentConfig.users.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:#999;padding:20px;">暂无用户，请点击"添加用户"按钮</div>';
    return;
  }

  currentConfig.users.forEach((user, index) => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <div class="user-card-header">
        <div class="user-name">${user.name || '未命名'}</div>
        <button class="btn btn-danger" data-index="${index}">删除</button>
      </div>
      <div class="user-fields">
        <div class="user-field">
          <label>姓名</label>
          <input type="text" value="${user.name || ''}" placeholder="姓名" data-index="${index}" data-field="name">
        </div>
        <div class="user-field">
          <label>身份证号</label>
          <input type="text" value="${user.id || ''}" placeholder="身份证号" data-index="${index}" data-field="id">
        </div>
        <div class="user-field">
          <label>手机号</label>
          <input type="text" value="${user.phone || ''}" placeholder="手机号" data-index="${index}" data-field="phone">
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // 绑定删除和编辑事件
  bindUserEvents();
}

// 绑定用户卡片事件
function bindUserEvents() {
  // 删除按钮
  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      deleteUser(index);
    });
  });

  // 输入框修改
  document.querySelectorAll('.user-field input').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      const field = e.target.dataset.field;
      currentConfig.users[index][field] = e.target.value;
    });
  });
}

// 删除用户
function deleteUser(index) {
  if (!confirm('确定要删除这个用户吗？')) return;

  currentConfig.users.splice(index, 1);
  renderUsers();
  showStatus('用户已删除', 'success');
}

// 添加用户
function addUser() {
  const newUser = { name: '', id: '', phone: '' };
  currentConfig.users.push(newUser);
  renderUsers();
  showStatus('已添加新用户', 'success');

  // 滚动到新用户
  setTimeout(() => {
    const cards = document.querySelectorAll('.user-card');
    if (cards.length > 0) {
      cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

// 保存配置
async function saveConfig() {
  // 收集基础配置
  currentConfig.targetDate = document.getElementById('targetDate').value;
  currentConfig.branchKeyword = document.getElementById('branchKeyword').value;
  currentConfig.quantity = document.getElementById('quantity').value;

  // 验证
  if (!currentConfig.targetDate || !currentConfig.branchKeyword || !currentConfig.quantity) {
    showStatus('请填写完整的基础配置', 'error');
    return;
  }

  if (currentConfig.users.length === 0) {
    showStatus('请至少添加一个用户', 'error');
    return;
  }

  for (let i = 0; i < currentConfig.users.length; i++) {
    const user = currentConfig.users[i];
    if (!user.name) {
      showStatus(`第${i+1}个用户的姓名不能为空`, 'error');
      return;
    }
  }

  try {
    await chrome.storage.sync.set({ icbcConfig: currentConfig });
    showStatus('配置保存成功', 'success');
  } catch (error) {
    showStatus('保存失败', 'error');
  }
}

// 恢复默认配置
async function resetConfig() {
  if (!confirm('确定要恢复默认配置吗？')) return;

  try {
    const response = await fetch('config/defaults.json');
    currentConfig = await response.json();

    await chrome.storage.sync.set({ icbcConfig: currentConfig });

    document.getElementById('targetDate').value = currentConfig.targetDate;
    document.getElementById('branchKeyword').value = currentConfig.branchKeyword;
    document.getElementById('quantity').value = currentConfig.quantity;

    renderUsers();
    showStatus('已恢复默认配置', 'success');
  } catch (error) {
    showStatus('恢复失败', 'error');
  }
}

// 显示状态消息
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
  status.style.display = 'block';

  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}
