import { createApp } from 'vue'
import App from './App.vue'

// 重置样式
import 'normalize.css/normalize.css'

// ElementUI 函数式组件样式
// import 'element-plus/theme-chalk/el-message.css'
// import 'element-plus/theme-chalk/el-message-box.css'
// import 'element-plus/theme-chalk/el-notification.css'
// import 'element-plus/theme-chalk/el-loading.css'

// SvgIcon 组件
import 'virtual:svg-icons-register'

// 样式
import '@/styles/index.sass'

createApp(App).mount('#app')
