/**
 * 音效管理模块
 * 为命名性失语症患者提供听觉反馈
 */

const SoundManager = {
    /**
     * 是否启用音效
     */
    enabled: true,

    /**
     * 音频上下文（用于生成简单音效）
     */
    audioContext: null,

    /**
     * 从设置加载状态
     */
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('aphasia_math_settings') || '{}');
            // 如果设置了 soundKeypress 或 soundFeedback，任一关闭都视为音效关闭
            if (settings.soundKeypress === false && settings.soundFeedback === false) {
                this.enabled = false;
            } else if (settings.soundKeypress !== undefined || settings.soundFeedback !== undefined) {
                this.enabled = settings.soundKeypress !== false || settings.soundFeedback !== false;
            }
        } catch {
            this.enabled = true;
        }
    },

    /**
     * 设置音效开关
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    },

    /**
     * 初始化音频上下文
     */
    init() {
        // 首次使用时加载设置
        if (!this.audioContext) {
            this.loadSettings();
        }

        // 用户首次交互时初始化
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },

    /**
     * 播放正确音效（愉悦的上升音）
     */
    playCorrect() {
        if (!this.enabled) return;
        this.init();

        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // 双音调（大三度和弦效果）
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    },

    /**
     * 播放错误音效（低沉的下降音）
     */
    playWrong() {
        if (!this.enabled) return;
        this.init();

        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    },

    /**
     * 播放按键音效（短促的点击音）
     */
    playKeyPress() {
        if (!this.enabled) return;
        this.init();

        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    },

    /**
     * 播放提交音效
     */
    playSubmit() {
        if (!this.enabled) return;
        this.init();

        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    },

    /**
     * 播放完成音效（胜利的旋律）
     */
    playComplete() {
        if (!this.enabled) return;
        this.init();

        const ctx = this.audioContext;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const times = [0, 0.15, 0.3, 0.45];

        notes.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, ctx.currentTime + times[index]);

            gainNode.gain.setValueAtTime(0.2, ctx.currentTime + times[index]);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + times[index] + 0.3);

            oscillator.start(ctx.currentTime + times[index]);
            oscillator.stop(ctx.currentTime + times[index] + 0.3);
        });
    },

    /**
     * 开启/关闭音效
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    },

    /**
     * 获取当前状态
     */
    isEnabled() {
        return this.enabled;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}
