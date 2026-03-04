const form = document.getElementById('promptForm');
const output = document.getElementById('output');
const outputEn = document.getElementById('outputEn');
const copyBtn = document.getElementById('copyBtn');
const copyEnBtn = document.getElementById('copyEnBtn');
const randomBtn = document.getElementById('randomBtn');
const clearBtn = document.getElementById('clearBtn');
const speedInput = document.getElementById('speed');
const speedLabel = document.getElementById('speedLabel');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const presetContainer = document.getElementById('presetContainer');

const STORAGE_KEY = 'dance-bg-history-v1';
const MAX_HISTORY = 8;

const presets = [
  {
    name: '月下庭院',
    theme: '月下庭院与回廊',
    timeMood: '月夜银辉',
    style: '电影级写实',
    palette: '月白 + 黛蓝 + 暖金',
    details: '飘落花瓣、薄雾、石阶倒影',
  },
  {
    name: '竹林水榭',
    theme: '竹林水榭与远山云海',
    timeMood: '晨雾初开',
    style: '写意国风',
    palette: '青绿 + 雾白 + 墨色',
    details: '轻雾流动、水波微纹、飞鸟掠影',
  },
  {
    name: '宫灯长廊',
    theme: '宫灯映照的朱墙长廊',
    timeMood: '薄暮微光',
    style: '工笔细腻',
    palette: '朱红 + 金色 + 墨黑',
    details: '灯笼微晃、帷幔轻摆、地面反光',
  },
];

const motionBySpeed = {
  1: '镜头几乎静止，轻微呼吸感',
  2: '镜头缓慢移动，平稳舒展',
  3: '镜头中等幅度流动，节奏自然',
  4: '镜头明显流动，适合舞段高潮',
  5: '镜头动态丰富但保持稳定',
};

const templates = {
  quality: 'ultra detailed, cinematic lighting, depth of field, smooth motion, high texture quality',
  motion: 'background-only shot, no close-up character face, suitable for dance plate compositing',
};

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function setValue(id, value) {
  document.getElementById(id).value = value;
}

function speedText(value) {
  return ['很慢', '较慢', '中等', '较快', '快速'][Number(value) - 1];
}

function buildPrompt() {
  const theme = getValue('theme');
  const timeMood = getValue('timeMood');
  const style = getValue('style');
  const palette = getValue('palette') || '青黛与暖金渐变';
  const camera = getValue('camera');
  const ratio = getValue('ratio');
  const details = getValue('details') || '花瓣、云雾、纱幔、光斑层次';
  const negative = getValue('negative') || '人物特写, 现代元素, logo, 文本, 低清晰度';
  const lightFx = getValue('lightFx');
  const speed = speedInput.value;

  const cn = [
    '【古风舞蹈背景视频提示词】',
    `场景主题：${theme}`,
    `时间氛围：${timeMood}`,
    `视觉风格：${style}`,
    `主色调：${palette}`,
    `镜头运动：${camera}（运动强度：${speedText(speed)}，${motionBySpeed[speed]}）`,
    `动态光效：${lightFx}`,
    `画面比例：${ratio}`,
    `细节元素：${details}`,
    `画面要求：${templates.quality}; ${templates.motion}`,
    `负面提示词：${negative}`,
  ].join('\n');

  const en = [
    'Ancient Chinese dance video background scene, no close-up performer.',
    `Theme: ${theme}.`,
    `Mood and time: ${timeMood}.`,
    `Style: ${style}, palette: ${palette}.`,
    `Camera move: ${camera}, motion intensity: ${speedText(speed)} (${motionBySpeed[speed]}).`,
    `Dynamic lighting effect: ${lightFx}.`,
    `Aspect ratio: ${ratio}.`,
    `Extra details: ${details}.`,
    `${templates.quality}, ${templates.motion}.`,
    `Negative prompt: ${negative}.`,
  ].join(' ');

  return { cn, en, theme, timeMood, style };
}

function saveHistory(item) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const next = [item, ...list].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  renderHistory();
}

function renderHistory() {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  historyList.innerHTML = '';

  if (list.length === 0) {
    historyList.innerHTML = '<li class="empty">暂无记录，先生成一次吧。</li>';
    return;
  }

  list.forEach((item) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `${item.theme} · ${item.style} · ${item.timeMood}`;
    btn.addEventListener('click', () => {
      output.textContent = item.cn;
      outputEn.textContent = item.en;
      copyBtn.disabled = false;
      copyEnBtn.disabled = false;
    });
    li.appendChild(btn);
    historyList.appendChild(li);
  });
}

function applyPreset(preset) {
  setValue('theme', preset.theme);
  setValue('timeMood', preset.timeMood);
  setValue('style', preset.style);
  setValue('palette', preset.palette);
  setValue('details', preset.details);
}

function initPresets() {
  presetContainer.innerHTML = presets
    .map((preset) => `<button type="button" class="chip" data-name="${preset.name}">${preset.name}</button>`)
    .join('');

  presetContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const name = target.dataset.name;
    const preset = presets.find((item) => item.name === name);
    if (preset) {
      applyPreset(preset);
    }
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const prompt = buildPrompt();
  output.textContent = prompt.cn;
  outputEn.textContent = prompt.en;
  copyBtn.disabled = false;
  copyEnBtn.disabled = false;
  saveHistory(prompt);
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    copyBtn.textContent = '已复制';
    setTimeout(() => {
      copyBtn.textContent = '复制';
    }, 1200);
  } catch {
    copyBtn.textContent = '复制失败';
    setTimeout(() => {
      copyBtn.textContent = '复制';
    }, 1200);
  }
});

copyEnBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(outputEn.textContent);
    copyEnBtn.textContent = '已复制';
    setTimeout(() => {
      copyEnBtn.textContent = '复制英文';
    }, 1200);
  } catch {
    copyEnBtn.textContent = '复制失败';
    setTimeout(() => {
      copyEnBtn.textContent = '复制英文';
    }, 1200);
  }
});

randomBtn.addEventListener('click', () => {
  const sample = presets[Math.floor(Math.random() * presets.length)];
  applyPreset(sample);
  setValue('camera', ['缓慢推进', '横向跟随', '环绕旋转'][Math.floor(Math.random() * 3)]);
  setValue('lightFx', ['无', '萤火流光', '烛火摇曳', '水面粼光', '月华粒子'][Math.floor(Math.random() * 5)]);
  speedInput.value = String(Math.floor(Math.random() * 5) + 1);
  speedLabel.textContent = speedText(speedInput.value);
});

clearBtn.addEventListener('click', () => {
  form.reset();
  speedLabel.textContent = speedText(speedInput.value);
});

clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
});

speedInput.addEventListener('input', () => {
  speedLabel.textContent = speedText(speedInput.value);
});

initPresets();
renderHistory();
speedLabel.textContent = speedText(speedInput.value);
