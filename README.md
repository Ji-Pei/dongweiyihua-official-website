# 东巍益华官方网站

> 贵州东巍益华商贸有限公司 | 测绘仪器多品牌授权代理商  
> www.dongweiyihua.com

---

## 项目概况

基于 **NVIDIA 设计系统 + #CC0000 东巍红定制** 的企业官网，HTML5 响应式，适配 PC / 平板 / 手机三端。

### 技术栈
- 纯 HTML5 + CSS3 + 原生 JavaScript（零框架依赖）
- CSS 变量体系（`--dhwy-*`）支持全局主题切换
- 购物车数据 localStorage 持久化

---

## 文件清单

```
dongweiyihua-website/
├── index.html              ← 首页（Hero轮播/品牌矩阵/产品分类/方案/关于/新闻）
├── products.html           ← 产品中心（品牌+分类筛选/产品网格/分页）
├── product-detail.html     ← 产品详情（参数表/加购/立即购买）
├── solutions.html          ← 解决方案（5大行业交替图文布局）
├── brands.html             ← 品牌授权（4品牌详细介绍+授权声明）
├── about.html              ← 关于我们（简介/时间轴/数据亮点）
├── news.html               ← 新闻动态（文章列表/分页）
├── contact.html            ← 联系我们（联系信息/留言表单）
├── cart.html               ← 购物车（增删改/合计/localStorage）
├── style.css               ← 全局样式（NVIDIA红黑设计系统）
├── script.js               ← 全局交互（轮播/筛选/购物车/表单/Toast）
└── images/                 ← 图片资源目录
```

---

## 部署步骤

### 单域名方案（推荐）

将全部文件放入 CRMEB-v6.0.0 的 `public/home/` 目录：

```bash
# 1. 创建 home 目录（如果不存在）
mkdir -p /path/to/crmeb/public/home/

# 2. 复制所有文件
cp -r dongweiyihua-website/* /path/to/crmeb/public/home/

# 3. CRMEB 路由自动生效
# 访问 www.dongweiyihua.com → 自动展示 PC 官网
# 访问 www.dongweiyihua.com/admin → CRMEB 管理后台
```

### Nginx 配置参考

```nginx
server {
    listen 80;
    server_name www.dongweiyihua.com;
    root /path/to/crmeb/public;
    index index.html index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

## CRMEB API 对接点

以下模块已预留 API 调用位置，接入 CRMEB 后直接替换即可：

| 页面 | 数据区域 | 建议 API |
|------|---------|---------|
| 首页 Hero | 轮播图 | `GET /api/pc/get_banner` |
| 首页品牌矩阵 | 品牌信息 | 静态内容 |
| 产品列表 | 产品数据 | `GET /api/pc/get_products` |
| 产品详情 | 参数+价格 | `GET /api/v1/product/detail/:id` |
| 购物车 | 购物车CRUD | `POST /api/v1/cart/add` 等 |
| 新闻列表 | 文章数据 | `GET /api/pc/get_news_list` |
| 公司信息 | 关于我们 | `GET /api/pc/get_company_info` |

购物车 `localStorage` key：`dwyh_cart`

---

## 开发建议

1. **导航/页脚模板化**：当前 9 个 HTML 文件中 nav/footer 重复，建议用构建工具提取为公共模板
2. **图片替换**：产品图/banner/logo 目前为 CSS 占位符，上传真实图片后替换
3. **API 接入**：将 `script.js` 中的 `productData` 硬编码替换为 CRMEB API 动态获取
4. **可访问性**：后续迭代添加 `aria-*` 属性和键盘导航支持

---

## 联系方式

- 电话：19112456894
- 地址：重庆市巴南区东城大道2376号附3号4楼
- 邮箱：info@dongweiyihua.com
