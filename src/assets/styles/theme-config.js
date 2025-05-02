import TinyThemeTool from '@opentiny/vue-theme/theme-tool'

const themeTool = new TinyThemeTool()
const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
};
const theme = (color) => {
    console.log('color', color)
    return {
        id: 'custom-dialog-theme',
        name: 'custom-dialog-theme',
        data: {
            // 可以在这里覆盖全局CSS变量
            'tv-DialogBox-bg-color': 'green', // 使用你的primaryColor
        },
        css:`
        .tiny-dialog-box{
        background: ${hexToRgb(color)};
        }
        `
    }
}

// 自定义对话框样式
export const changeTheme = (color)=>{themeTool.changeTheme(theme(color))}