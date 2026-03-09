/**
 * Apple 风格设计系统
 * 毛玻璃、平滑动画、软件质感
 */

const DesignSystem = {
    /**
     * 颜色系统
     */
    colors: {
        // 主色
        primary: '#007AFF',
        primaryLight: '#5AC8FA',
        primaryDark: '#0051D5',

        // 成功/错误
        success: '#34C759',
        successLight: '#E8F5E9',
        error: '#FF3B30',
        errorLight: '#FFEBEE',

        // 中性色
        background: '#F5F5F7',
        surface: 'rgba(255, 255, 255, 0.72)',
        surfaceSolid: '#FFFFFF',

        // 文字
        textPrimary: '#1C1C1E',
        textSecondary: '#8E8E93',
        textTertiary: '#C7C7CC',

        // 边框
        border: 'rgba(120, 120, 128, 0.16)',
        borderHover: 'rgba(120, 120, 128, 0.24)',

        // 玻璃效果
        glass: 'rgba(255, 255, 255, 0.85)',
        glassBorder: 'rgba(255, 255, 255, 0.3)'
    },

    /**
     * 阴影系统
     */
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
        md: '0 4px 16px rgba(0, 0, 0, 0.08)',
        lg: '0 8px 32px rgba(0, 0, 0, 0.12)',
        xl: '0 16px 48px rgba(0, 0, 0, 0.16)',
        inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)'
    },

    /**
     * 动画系统
     */
    animations: {
        // 弹簧动画
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

        // 时长
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',

        // 延迟
        stagger: (index) => `${index * 50}ms`
    },

    /**
     * 添加全局样式
     */
    init() {
        if (document.getElementById('design-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'design-system-styles';
        style.textContent = `
            /* 基础设置 */
            * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            /* 滚动条美化 */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.15);
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.25);
            }

            /* 选中文字颜色 */
            ::selection {
                background: rgba(0, 122, 255, 0.2);
                color: #007AFF;
            }

            /* 页面切换动画 */
            @keyframes pageEnter {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.98);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes pageExit {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.98);
                }
            }

            .page-enter {
                animation: pageEnter 350ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }

            /* 按钮点击效果 */
            @keyframes buttonPress {
                0% { transform: scale(1); }
                50% { transform: scale(0.96); }
                100% { transform: scale(1); }
            }

            .btn-press:active {
                animation: buttonPress 150ms ease;
            }

            /* 卡片悬停效果 */
            .card-hover {
                transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
            }
            .card-hover:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            }

            /* 玻璃拟态 */
            .glass {
                background: rgba(255, 255, 255, 0.72);
                backdrop-filter: saturate(180%) blur(20px);
                -webkit-backdrop-filter: saturate(180%) blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .glass-dark {
                background: rgba(28, 28, 30, 0.72);
                backdrop-filter: saturate(180%) blur(20px);
                -webkit-backdrop-filter: saturate(180%) blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            /* 脉冲动画（用于下一题按钮） */
            @keyframes gentlePulse {
                0%, 100% { transform: scale(1); box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3); }
                50% { transform: scale(1.02); box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4); }
            }

            .pulse-gentle {
                animation: gentlePulse 2s ease-in-out infinite;
            }

            /* 摇晃动画（错误时） */
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
            }

            .shake {
                animation: shake 400ms cubic-bezier(0.36, 0, 0.66, -0.56);
            }

            /* 弹跳动画（正确时） */
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }

            .bounce {
                animation: bounce 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            /* 淡入上移动画 */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .fade-in-up {
                animation: fadeInUp 400ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
            }

            /* 渐进显示（用于列表项） */
            .stagger-item {
                opacity: 0;
                animation: fadeInUp 350ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
            }

            /* 圆形进度条 */
            .circular-progress {
                transition: stroke-dashoffset 800ms cubic-bezier(0.4, 0.0, 0.2, 1);
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * 创建玻璃卡片
     */
    createCard(content, options = {}) {
        const { padding = '24px', borderRadius = '20px', hover = true } = options;

        const div = document.createElement('div');
        div.className = `glass ${hover ? 'card-hover' : ''}`;
        div.style.cssText = `
            padding: ${padding};
            border-radius: ${borderRadius};
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        `;
        div.innerHTML = content;
        return div;
    },

    /**
     * 创建主按钮
     */
    createPrimaryButton(text, onClick, options = {}) {
        const { icon = '', fullWidth = true, size = 'large' } = options;

        const sizes = {
            small: { padding: '8px 16px', fontSize: '14px' },
            medium: { padding: '12px 24px', fontSize: '16px' },
            large: { padding: '16px 32px', fontSize: '18px' }
        };

        const btn = document.createElement('button');
        btn.className = 'btn-press';
        btn.style.cssText = `
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
            transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
            ${fullWidth ? 'width: 100%;' : ''}
            padding: ${sizes[size].padding};
            font-size: ${sizes[size].fontSize};
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        `;
        btn.innerHTML = icon ? `<span>${icon}</span><span>${text}</span>` : text;
        btn.onclick = onClick;

        btn.addEventListener('mouseenter', () => {
            btn.style.boxShadow = '0 8px 32px rgba(0, 122, 255, 0.4)';
            btn.style.transform = 'translateY(-1px)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.boxShadow = '0 4px 16px rgba(0, 122, 255, 0.3)';
            btn.style.transform = 'translateY(0)';
        });

        return btn;
    },

    /**
     * 创建选项按钮（设置页用）
     */
    createOptionButton(text, icon, isActive, onClick) {
        const btn = document.createElement('button');
        btn.className = 'btn-press';
        btn.style.cssText = `
            padding: 16px;
            border-radius: 16px;
            border: 2px solid ${isActive ? '#007AFF' : 'rgba(120, 120, 128, 0.16)'};
            background: ${isActive ? 'rgba(0, 122, 255, 0.08)' : 'white'};
            cursor: pointer;
            transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            min-width: 80px;
        `;

        btn.innerHTML = `
            <span style="font-size: 28px;">${icon}</span>
            <span style="font-weight: 600; color: ${isActive ? '#007AFF' : '#1C1C1E'};">${text}</span>
        `;

        btn.onclick = onClick;

        btn.addEventListener('mouseenter', () => {
            if (!isActive) {
                btn.style.borderColor = 'rgba(120, 120, 128, 0.24)';
                btn.style.background = 'rgba(120, 120, 128, 0.04)';
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (!isActive) {
                btn.style.borderColor = 'rgba(120, 120, 128, 0.16)';
                btn.style.background = 'white';
            }
        });

        return btn;
    },

    /**
     * 创建数字键盘按钮
     */
    createKeypadButton(num, onClick, disabled = false) {
        const btn = document.createElement('button');
        btn.className = 'btn-press';
        btn.style.cssText = `
            width: 100%;
            aspect-ratio: 1;
            border-radius: 20px;
            border: none;
            background: rgba(255, 255, 255, 0.9);
            font-size: 32px;
            font-weight: 600;
            color: #1C1C1E;
            cursor: ${disabled ? 'default' : 'pointer'};
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transition: all 150ms ease;
            opacity: ${disabled ? '0.5' : '1'};
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        btn.textContent = num;

        if (!disabled) {
            btn.onclick = onClick;

            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(0, 122, 255, 0.1)';
                btn.style.transform = 'scale(1.02)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(255, 255, 255, 0.9)';
                btn.style.transform = 'scale(1)';
            });
        }

        return btn;
    }
};

// 初始化设计系统
DesignSystem.init();
