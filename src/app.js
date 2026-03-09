/**
 * 主应用模块 - 路由管理
 * 命名性失语症算术康复练习工具
 */

const router = {
    /**
     * 当前页面
     */
    currentPage: 'home',

    /**
     * 路由表
     */
    routes: {
        'home': () => HomePage.init(),
        'practice-settings': () => PracticeSettingsPage.init(),
        'practice-keypad': () => PracticeKeypadPage.init(),
        'practice-choice': () => PracticeChoicePage.init(),
        'result': () => ResultPage.init()
    },

    /**
     * 导航到指定页面
     * @param {string} page - 页面名称
     */
    navigate(page) {
        if (this.routes[page]) {
            this.currentPage = page;
            this.updateNavStyles();
            this.routes[page]();
        } else {
            console.error(`Page not found: ${page}`);
            this.navigate('home');
        }
    },

    /**
     * 更新侧边栏导航样式
     */
    updateNavStyles() {
        const navHome = document.getElementById('nav-home');
        const navPractice = document.getElementById('nav-practice');

        if (!navHome || !navPractice) return;

        // 重置样式
        const inactiveStyle = {
            background: 'transparent',
            color: '#3C3C43',
            boxShadow: 'none'
        };

        const activeStyle = {
            background: '#007AFF',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)'
        };

        // 根据当前页面设置样式
        if (this.currentPage === 'home') {
            Object.assign(navHome.style, activeStyle);
            Object.assign(navPractice.style, inactiveStyle);
        } else if (['practice-settings', 'practice-keypad', 'practice-choice'].includes(this.currentPage)) {
            Object.assign(navHome.style, inactiveStyle);
            Object.assign(navPractice.style, activeStyle);
        } else {
            // 其他页面（如 result）默认都不高亮，或者保持原样
            Object.assign(navHome.style, inactiveStyle);
            Object.assign(navPractice.style, inactiveStyle);
        }
    },

    /**
     * 返回上一页
     */
    back() {
        history.back();
    }
};

/**
 * 应用初始化
 */
function initApp() {
    // 检查是否有用户数据，没有则初始化
    const userData = Storage.getUserData();
    console.log('用户数据已加载:', userData.name);

    // 加载首页
    router.navigate('home');

    // 添加全局错误处理
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('Error: ' + msg);
        return false;
    };

    // 监听存储变化（多标签页同步）
    window.addEventListener('storage', (e) => {
        if (e.key === Storage.KEYS.USER_DATA) {
            console.log('用户数据已更新');
            // 如果当前在首页，刷新统计数据
            if (router.currentPage === 'home') {
                HomePage.init();
            }
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);
