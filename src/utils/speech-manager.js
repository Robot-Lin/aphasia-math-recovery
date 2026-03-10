/**
 * 语音朗读管理模块
 * 为命名性失语症患者提供听觉辅助
 */

const SpeechManager = {
    /**
     * 是否启用语音
     */
    enabled: true,

    /**
     * 语音合成实例
     */
    synthesis: null,

    /**
     * 当前正在播放的 utterance
     */
    currentUtterance: null,

    /**
     * 中文数字映射表
     */
    numberToChinese: {
        0: '零', 1: '一', 2: '二', 3: '三', 4: '四',
        5: '五', 6: '六', 7: '七', 8: '八', 9: '九',
        10: '十', 100: '百'
    },

    /**
     * 初始化
     */
    init() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            this.loadSettings();
            console.log('语音朗读模块已初始化');
        } else {
            console.warn('浏览器不支持语音朗读功能');
            this.enabled = false;
        }
    },

    /**
     * 从设置加载语音开关状态
     */
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('aphasia_math_settings') || '{}');
            this.enabled = settings.speechEnabled !== false;
        } catch {
            this.enabled = true;
        }
    },

    /**
     * 设置语音开关
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        // 保存到设置
        try {
            const settings = JSON.parse(localStorage.getItem('aphasia_math_settings') || '{}');
            settings.speechEnabled = enabled;
            localStorage.setItem('aphasia_math_settings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存语音设置失败:', error);
        }
    },

    /**
     * 获取语音开关状态
     */
    isEnabled() {
        return this.enabled && 'speechSynthesis' in window;
    },

    /**
     * 朗读文本
     * @param {string} text - 要朗读的文本
     * @param {Object} options - 朗读选项
     */
    speak(text, options = {}) {
        if (!this.isEnabled() || !this.synthesis) return;

        // 停止当前播放
        this.stop();

        // 使用 try-catch 防止语音合成异常导致页面卡死
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = options.rate || 0.9; // 稍慢语速，适合康复训练
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;

            // 选择中文语音（添加错误保护）
            try {
                const voices = this.synthesis.getVoices();
                if (voices && voices.length > 0) {
                    const chineseVoice = voices.find(v => v.lang && v.lang.includes('zh'));
                    if (chineseVoice) {
                        utterance.voice = chineseVoice;
                    }
                }
            } catch (e) {
                console.warn('获取语音列表失败:', e);
            }

            // 事件回调
            if (options.onstart) utterance.onstart = options.onstart;
            if (options.onend) utterance.onend = options.onend;

            // 添加默认错误处理，防止未捕获的异常（同时保留用户传入的回调）
            const userOnError = options.onerror;
            utterance.onerror = (e) => {
                // 忽略 'interrupted' 和 'canceled' 错误（这些是正常的中断情况）
                if (e.error === 'interrupted' || e.error === 'canceled') {
                    console.log('语音播放被中断:', e.error);
                } else {
                    console.warn('语音播放错误:', e.error);
                }
                this.currentUtterance = null;
                // 执行用户指定的错误回调
                if (userOnError) {
                    try {
                        userOnError(e);
                    } catch (err) {
                        console.error('语音错误回调异常:', err);
                    }
                }
            };

            this.currentUtterance = utterance;
            this.synthesis.speak(utterance);
        } catch (e) {
            console.error('语音合成异常:', e);
            this.currentUtterance = null;
        }
    },

    /**
     * 朗读数字（优化读法）n     * @param {number} num - 要朗读的数字
     */
    speakNumber(num) {
        const text = this.convertNumberToChinese(num);
        this.speak(text);
    },

    /**
     * 将数字转换为中文读法
     * 15 → "十五" 而非 "一十五"
     * 56 → "五十六"
     * 100 → "一百"
     */
    convertNumberToChinese(num) {
        if (num < 0 || num > 999) return num.toString();

        if (num <= 10) {
            return this.numberToChinese[num];
        }

        if (num < 20) {
            // 11-19: 十一、十二...
            return '十' + this.numberToChinese[num % 10];
        }

        if (num < 100) {
            // 21-99: 二十一、五十六...
            const tens = Math.floor(num / 10);
            const ones = num % 10;
            if (ones === 0) {
                return this.numberToChinese[tens] + '十';
            }
            return this.numberToChinese[tens] + '十' + this.numberToChinese[ones];
        }

        // 100-999
        const hundreds = Math.floor(num / 100);
        const remainder = num % 100;
        if (remainder === 0) {
            return this.numberToChinese[hundreds] + '百';
        }
        return this.numberToChinese[hundreds] + '百' + this.convertNumberToChinese(remainder);
    },

    /**
     * 朗读算术表达式
     * @param {string} expression - 表达式，如 "7 + 8"
     */
    speakExpression(expression) {
        // 替换运算符为中文
        const chineseExpr = expression
            .replace(/\+/g, '加')
            .replace(/-/g, '减')
            .replace(/×/g, '乘')
            .replace(/\*/g, '乘')
            .replace(/÷/g, '除以')
            .replace(/\//g, '除以')
            .replace(/=/g, '等于');

        // 将数字转换为中文
        const parts = chineseExpr.split(/(\d+)/);
        let result = '';
        for (const part of parts) {
            if (/^\d+$/.test(part)) {
                result += this.convertNumberToChinese(parseInt(part));
            } else {
                result += part;
            }
        }

        this.speak(result);
    },

    /**
     * 朗读完整题目（带答案）
     * @param {string} expression - 表达式
     * @param {number} answer - 答案
     */
    speakQuestionWithAnswer(expression, answer) {
        const expressionText = this.convertExpressionToText(expression);
        const answerText = this.convertNumberToChinese(answer);
        this.speak(`${expressionText}等于${answerText}`);
    },

    /**
     * 将表达式转换为文本
     */
    convertExpressionToText(expression) {
        return expression
            .replace(/\+/g, '加')
            .replace(/-/g, '减')
            .replace(/×/g, '乘')
            .replace(/\*/g, '乘')
            .replace(/÷/g, '除以')
            .replace(/\//g, '除以');
    },

    /**
     * 停止朗读
     */
    stop() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        this.currentUtterance = null;
    },

    /**
     * 暂停朗读
     */
    pause() {
        if (this.synthesis) {
            this.synthesis.pause();
        }
    },

    /**
     * 恢复朗读
     */
    resume() {
        if (this.synthesis) {
            this.synthesis.resume();
        }
    },

    /**
     * 朗读反馈（正确/错误）
     */
    speakFeedback(isCorrect) {
        if (!this.isEnabled()) return;

        const messages = isCorrect
            ? ['正确！', '答对了！', '真棒！', '很好！']
            : ['再想想', '不对哦', '加油'];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.speak(randomMessage);
    },

    /**
     * 预加载语音（解决首次播放延迟问题）
     */
    preload() {
        if (!this.synthesis) return;

        // 获取语音列表（某些浏览器需要延迟加载）
        if (this.synthesis.getVoices().length === 0) {
            this.synthesis.onvoiceschanged = () => {
                console.log('语音列表已加载:', this.synthesis.getVoices().length, '种语音');
            };
        }

        // 播放一个无声的 utterance 来初始化
        const silentUtterance = new SpeechSynthesisUtterance('');
        silentUtterance.volume = 0;
        this.synthesis.speak(silentUtterance);
    }
};

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SpeechManager.init());
} else {
    SpeechManager.init();
}

// 导出（兼容 CommonJS 和浏览器环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeechManager;
}
