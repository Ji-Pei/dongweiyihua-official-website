/* ============================================
   东巍益华 (DongWeiYiHua) 官网交互脚本
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initHeroSlider();
  initCategoryScroll();
  initScrollEffects();
  initProductFilter();
  initCart();
  initContactForm();
  initQuantitySelectors();
  initToastSystem();
  initAuth();
});

/* ---- 导航栏 ---- */
function initNavigation() {
  let hamburger = document.querySelector('.hamburger');
  let mobileNav = document.querySelector('.mobile-nav');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  let mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // 关闭移动导航的点击外部
  document.addEventListener('click', function(e) {
    if (mobileNav.classList.contains('active') &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ---- 全局配置 ---- */
var API_BASE = 'http://101.43.99.228';

/* ---- Hero轮播（CRMEB API） ---- */
function initHeroSlider() {
  var slider = document.getElementById('heroSlider');
  var dotsEl = document.getElementById('heroDots');
  if (!slider || !dotsEl) return;

  var slides = [];
  var dots = [];
  var current = 0;
  var timer = null;

  // 从CRMEB API获取轮播图数据
  fetch(API_BASE + '/api/pc/get_banner')
    .then(function (r) { return r.json(); })
    .then(function (res) {
      var list = (res.data && res.data.list) || [];
      if (list.length === 0) return;
      renderSlides(list);
      start();
    })
    .catch(function () {
      // API失败时用内置默认图
      renderSlides([{ image: 'images/banner_1.jpg' }, { image: 'images/banner_2.jpg' }]);
      start();
    });

  function renderSlides(list) {
    list.forEach(function (item, i) {
      var slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
      var img = document.createElement('img');
      img.src = item.image || item.img;
      img.alt = item.title || '';
      img.className = 'hero-image';
      slide.appendChild(img);

      // 包裹点击跳转链接
      if (item.url) {
        var link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.className = 'hero-link';
        img.parentNode.insertBefore(link, img);
        link.appendChild(img);
      }
      slider.insertBefore(slide, dotsEl);

      var dot = document.createElement('span');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function () { goTo(i); start(); });
      dotsEl.appendChild(dot);

      slides.push(slide);
      dots.push(dot);
    });
  }

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function start() {
    stop();
    timer = setInterval(function () { goTo(current + 1); }, 3000);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // 触摸滑动
  var startX = 0;
  slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stop(); });
  slider.addEventListener('touchend', function (e) {
    var endX = e.changedTouches[0].clientX;
    if (startX - endX > 40) goTo(current + 1);
    if (endX - startX > 40) goTo(current - 1);
    start();
  });
}

/* ---- 产品分类横向滚动（CRMEB API） ---- */
function initCategoryScroll() {
  var track = document.getElementById('catScrollTrack');
  if (!track) return;

  // 精美图标SVG（红色hover通过CSS stroke变色实现）
  function getCategoryIcon(name) {
    var icons = {
      'RTK测绘仪': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8 L32 16"/><path d="M20 12 L20 20 L44 20 L44 12"/><rect x="18" y="20" width="28" height="32" rx="4"/><path d="M24 36 L40 36"/><circle cx="32" cy="28" r="3"/><path d="M18 44 L14 48"/><path d="M46 44 L50 48"/></svg>',
      
      '全站仪': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 48 L20 20 L28 12 L36 12 L44 20 L44 48"/><path d="M20 20 L44 20"/><circle cx="32" cy="32" r="6"/><path d="M32 26 L32 20"/><path d="M28 16 L36 16"/><path d="M24 48 L18 54"/><path d="M40 48 L46 54"/></svg>',
      
      '工程测量': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8 L32 16"/><circle cx="32" cy="24" r="8"/><path d="M32 32 L32 56"/><path d="M24 56 L40 56"/><path d="M16 24 L8 20"/><path d="M48 24 L56 20"/></svg>',
      
      '三维智能': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="32" height="36" rx="4"/><circle cx="32" cy="34" r="6"/><path d="M16 22 L48 22"/><path d="M32 8 L32 16"/><path d="M24 8 L40 8"/></svg>',
      
      '无人机航测': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 12 L32 20"/><path d="M16 20 L48 20"/><path d="M20 20 L24 28 L40 28 L44 20"/><path d="M28 28 L28 40"/><path d="M36 28 L36 40"/><path d="M24 40 L40 40"/><circle cx="32" cy="24" r="2"/><path d="M8 24 L12 24"/><path d="M52 24 L56 24"/></svg>',
      
      '海洋测绘': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 40 Q16 36 24 40 Q32 44 40 40 Q48 36 56 40"/><path d="M8 48 Q16 44 24 48 Q32 52 40 48 Q48 44 56 48"/><path d="M28 32 L28 16 L36 16 L36 32"/><path d="M32 8 L32 16"/><circle cx="32" cy="12" r="2"/><path d="M24 24 L40 24"/></svg>',
      
      '测绘配件': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="28" r="10"/><path d="M22 28 L18 28"/><path d="M46 28 L42 28"/><path d="M28 48 L28 56"/><path d="M36 48 L36 56"/><path d="M22 56 L42 56"/></svg>'
    };
    return icons[name] || icons['测绘配件'];
  }

  function renderCard(cate_name) {
    var card = document.createElement('a');
    card.className = 'category-card';
    card.href = 'products.html?category=' + encodeURIComponent(cate_name);
    card.innerHTML = '<div class="category-icon">' + getCategoryIcon(cate_name) + '</div><h4>' + cate_name + '</h4>';
    track.appendChild(card);
  }

  // API 加载（仅取分类名称）
  fetch(API_BASE + '/api/category')
    .then(function (r) { return r.json(); })
    .then(function (res) {
      var cats = (res.data) || [];
      if (cats.length === 0) return;
      track.innerHTML = '';
      cats.forEach(function (c) { renderCard(c.cate_name); });
    })
    .catch(function () {
      var defaults = ['RTK测绘仪','全站仪','工程测量','三维智能','无人机航测','海洋测绘','测绘配件'];
      track.innerHTML = '';
      defaults.forEach(function (n) { renderCard(n); });
    });

  // 鼠标拖动滚动
  var isDown = false, startX = 0, scrollLeft0 = 0;
  track.addEventListener('mousedown', function (e) {
    isDown = true;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft0 = track.scrollLeft;
  });
  track.addEventListener('mouseleave', function () { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mouseup', function () { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    e.preventDefault();
    var x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft0 - (x - startX) * 1.5;
  });
}

/* ---- 滚动效果 ---- */
function initScrollEffects() {
  let nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* ---- Toast提示 ---- */
function initToastSystem() {
  window.showToast = function(message, duration) {
    duration = duration || 2000;
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
      toast.classList.remove('show');
    }, duration);
  };
}

/* ---- 产品数据 ---- */
let productData = [
  {
    id: 1,
    name: '华测RTK天骄X6',
    model: 'CHC-X6',
    brand: '华测',
    category: 'RTK测量系统',
    price: 45000,
    priceRange: '¥38,000 - ¥52,000',
    params: ['精度: 8mm+1ppm', '通道: 800+', '续航: 12h'],
    image: '华测CHC-X6',
  },
  {
    id: 2,
    name: '南方测绘RTK银河6',
    model: 'Galaxy G6',
    brand: '南方测绘',
    category: 'RTK测量系统',
    price: 42000,
    priceRange: '¥35,000 - ¥48,000',
    params: ['精度: 8mm+1ppm', '通道: 965', '续航: 15h'],
    image: '南方GalaxyG6',
  },
  {
    id: 3,
    name: '南方测绘全站仪NTS-342R10A',
    model: 'NTS-342R10A',
    brand: '南方测绘',
    category: '全站仪',
    price: 28000,
    priceRange: '¥25,000 - ¥32,000',
    params: ['测角: 2"', '测距: 1000m', '免棱镜: 500m'],
    image: '南方NTS342',
  },
  {
    id: 4,
    name: '科力达全站仪KTS-442R10LCN',
    model: 'KTS-442R10LCN',
    brand: '科力达',
    category: '全站仪',
    price: 22000,
    priceRange: '¥18,000 - ¥26,000',
    params: ['测角: 2"', '测距: 1000m', '补偿: 双轴'],
    image: '科力达KTS442',
  },
  {
    id: 5,
    name: '北斗中移无人机航测系统',
    model: 'BD-SKY V2',
    brand: '北斗中移',
    category: '无人机航测系统',
    price: 88000,
    priceRange: '¥75,000 - ¥95,000',
    params: ['飞行: 45min', '载重: 2.5kg', '精度: 5cm'],
    image: '北斗BDSKYV2',
  },
  {
    id: 6,
    name: '华测水准仪DINI03',
    model: 'DINI03',
    brand: '华测',
    category: '水准仪',
    price: 18000,
    priceRange: '¥15,000 - ¥22,000',
    params: ['精度: 0.3mm/km', '范围: 100m', '补偿: ±15\''],
    image: '华测DINI03',
  },
  {
    id: 7,
    name: '南方测绘测绘配件套装',
    model: 'ACC-PRO',
    brand: '南方测绘',
    category: '测绘配件',
    price: 3500,
    priceRange: '¥2,800 - ¥5,000',
    params: ['三脚架', '棱镜组', '对中杆'],
    image: '南方ACCPRO',
  },
  {
    id: 8,
    name: '科力达GPS手持机K9',
    model: 'K9 Pro',
    brand: '科力达',
    category: 'RTK测量系统',
    price: 12800,
    priceRange: '¥10,000 - ¥15,000',
    params: ['精度: 1-3m', '防护: IP67', '系统: Android'],
    image: '科力达K9',
  },
];

/* ---- 产品中心（API驱动） ---- */
function initProductFilter() {
  var catTrack = document.getElementById('prodCatTrack');
  var productSections = document.getElementById('productSections');
  if (!catTrack || !productSections) return;

  var allProducts = [];
  var activeBrand = 'all';

  function getCatIcon(name) {
    var icons = {
      'RTK测绘仪': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8 L32 16"/><path d="M20 12 L20 20 L44 20 L44 12"/><rect x="18" y="20" width="28" height="32" rx="4"/><path d="M24 36 L40 36"/><circle cx="32" cy="28" r="3"/></svg>',
      '全站仪': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 48 L20 20 L28 12 L36 12 L44 20 L44 48"/><path d="M20 20 L44 20"/><circle cx="32" cy="32" r="6"/><path d="M32 26 L32 20"/></svg>',
      '工程测量': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="24" r="8"/><path d="M32 32 L32 56"/><path d="M24 56 L40 56"/></svg>',
      '三维智能': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="16" y="16" width="32" height="36" rx="4"/><circle cx="32" cy="34" r="6"/><path d="M16 22 L48 22"/></svg>',
      '无人机航测': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M32 12 L32 20"/><path d="M16 20 L48 20"/><path d="M20 20 L24 28 L40 28 L44 20"/></svg>',
      '海洋测绘': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 40 Q16 36 24 40 Q32 44 40 40 Q48 36 56 40"/><path d="M28 32 L28 16 L36 16 L36 32"/></svg>',
      '测绘配件': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="28" r="10"/><path d="M28 48 L28 56"/><path d="M36 48 L36 56"/></svg>'
    };
    return icons[name] || icons['测绘配件'];
  }

  // 1. 加载分类并渲染图标条
  fetch(API_BASE + '/api/category')
    .then(function(r){return r.json();})
    .then(function(res){
      var cats = res.data || [];
      catTrack.innerHTML = '';
      cats.forEach(function(c){
        var card = document.createElement('a');
        card.className = 'category-card';
        card.href = '#cat-' + c.id;
        card.setAttribute('data-cat-id', c.id);
        card.innerHTML = '<div class="category-icon">' + getCatIcon(c.cate_name) + '</div><h4>' + c.cate_name + '</h4>';
        card.addEventListener('click', function(e){
          e.preventDefault();
          var target = document.getElementById('cat-' + c.id);
          if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
          // 高亮当前
          catTrack.querySelectorAll('.category-card').forEach(function(ca){ca.classList.remove('active');});
          card.classList.add('active');
        });
        catTrack.appendChild(card);
      });
    })
    .catch(function(){
      catTrack.innerHTML = '<p style="color:#999;padding:20px;">加载分类失败</p>';
    });

  // 2. 加载产品
  fetch(API_BASE + '/api/pc/get_products')
    .then(function(r){return r.json();})
    .then(function(res){
      allProducts = (res.data && res.data.list) || [];
      if(allProducts.length === 0){ productSections.innerHTML='<p style="text-align:center;color:#999;padding:40px;">暂无产品</p>'; return; }
      renderProductSections();
    })
    .catch(function(){
      productSections.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">加载产品失败</p>';
    });

  function renderProductSections() {
    // 按分类分组
    var groups = {};
    allProducts.forEach(function(p){
      var cat = p.cate_name || p.category || '其他';
      if(!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });

    var filtered = activeBrand === 'all' ? allProducts : allProducts.filter(function(p){
      var b = (p.store_name || p.name || '').toLowerCase();
      return p.brand === activeBrand || b.indexOf(activeBrand.toLowerCase()) !== -1;
    });

    var groups2 = {};
    filtered.forEach(function(p){
      var cat = p.cate_name || p.category || '其他';
      if(!groups2[cat]) groups2[cat] = [];
      groups2[cat].push(p);
    });

    var html = '';
    for(var cat in groups2){
      var products = groups2[cat];
      var firstId = allProducts.indexOf(products[0]);
      html += '<div class="prod-cat-section" id="cat-' + (firstId + 1) + '">';
      html += '<div class="prod-cat-header"><h2>' + cat + '</h2><span>共' + products.length + '款</span></div>';
      html += '<div class="product-grid">';
      products.forEach(function(p){
        var imgSrc = p.image || p.img || '';
        var imgHtml = imgSrc ? '<img src="'+imgSrc+'" alt="'+p.store_name+'" loading="lazy">' : '<span>暂无图片</span>';
        html += '<a href="product-detail.html?id='+(p.id||'')+'" class="product-card">';
        html += '<div class="product-card-img">'+imgHtml+'</div>';
        html += '<div class="product-card-body"><h4>'+(p.store_name||p.name||'')+'</h4>';
        html += '<p class="product-model">'+(p.store_info||p.model||'')+'</p>';
        if(p.price){
          html += '<p class="product-price">&yen;' + p.price + '</p>';
        }
        html += '</div></a>';
      });
      html += '</div></div>';
    }
    productSections.innerHTML = html || '<p style="text-align:center;color:#999;padding:40px;">无匹配产品</p>';
  }

  // 3. 筛选标签事件
  var filterBar = document.getElementById('filterBar');
  if(filterBar){
    filterBar.querySelectorAll('.filter-tag').forEach(function(tag){
      tag.addEventListener('click', function(){
        filterBar.querySelectorAll('.filter-tag').forEach(function(t){t.classList.remove('active');});
        tag.classList.add('active');
        activeBrand = tag.getAttribute('data-brand');
        renderProductSections();
      });
    });
  }

  // 4. 拖动滚动分类条
  var isDown = false, startX = 0, scrollLeft0 = 0;
  catTrack.addEventListener('mousedown', function(e){ isDown=true; catTrack.classList.add('dragging'); startX=e.pageX-catTrack.offsetLeft; scrollLeft0=catTrack.scrollLeft; });
  catTrack.addEventListener('mouseleave', function(){ isDown=false; catTrack.classList.remove('dragging'); });
  catTrack.addEventListener('mouseup', function(){ isDown=false; catTrack.classList.remove('dragging'); });
  catTrack.addEventListener('mousemove', function(e){ if(!isDown) return; e.preventDefault(); var x=e.pageX-catTrack.offsetLeft; catTrack.scrollLeft=scrollLeft0-(x-startX)*1.5; });
}

/* ---- 购物车 ---- */
function initCart() {
  let cartTable = document.querySelector('.cart-table tbody');
  let cartTotal = document.querySelector('.cart-total-price');
  let cartEmpty = document.querySelector('.cart-empty');
  let cartContent = document.querySelector('.cart-content');
  let cartCountDisplay = document.querySelector('.cart-count');

  if (!cartTable && !cartEmpty) return;

  function getCart() {
    try {
      let cart = localStorage.getItem('dwyh_cart');
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('dwyh_cart', JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    let cart = getCart();
    let count = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
    if (cartCountDisplay) {
      cartCountDisplay.textContent = count;
      cartCountDisplay.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  function renderCart() {
    if (!cartTable) return;
    let cart = getCart();

    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.style.display = 'block';
      if (cartContent) cartContent.style.display = 'none';
      return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';

    let totalPrice = 0;
    let html = '';

    cart.forEach(function(item, index) {
      let subtotal = item.price * item.qty;
      totalPrice += subtotal;
      html +=
        '<tr>' +
          '<td>' +
            '<div class="cart-product">' +
              '<div class="cart-product-img"></div>' +
              '<span class="cart-product-name">' + item.name + '</span>' +
            '</div>' +
          '</td>' +
          '<td>¥' + item.price.toLocaleString() + '</td>' +
          '<td>' +
            '<div class="quantity-selector" style="margin:0;">' +
              '<button class="quantity-btn cart-qty-minus" data-index="' + index + '">-</button>' +
              '<input class="quantity-input" type="text" value="' + item.qty + '" readonly>' +
              '<button class="quantity-btn cart-qty-plus" data-index="' + index + '">+</button>' +
            '</div>' +
          '</td>' +
          '<td>¥' + subtotal.toLocaleString() + '</td>' +
          '<td><button class="cart-delete" data-index="' + index + '">&times;</button></td>' +
        '</tr>';
    });

    cartTable.innerHTML = html;
    cartTotal.textContent = '¥' + totalPrice.toLocaleString();

    // 删除事件
    cartTable.querySelectorAll('.cart-delete').forEach(function(btn) {
      btn.addEventListener('click', function() {
        let index = parseInt(this.getAttribute('data-index'));
        let cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        if (window.showToast) showToast('已从购物车移除');
      });
    });

    // 数量增减
    cartTable.querySelectorAll('.cart-qty-minus').forEach(function(btn) {
      btn.addEventListener('click', function() {
        let index = parseInt(this.getAttribute('data-index'));
        let cart = getCart();
        if (cart[index].qty > 1) {
          cart[index].qty--;
          saveCart(cart);
          renderCart();
        }
      });
    });

    cartTable.querySelectorAll('.cart-qty-plus').forEach(function(btn) {
      btn.addEventListener('click', function() {
        let index = parseInt(this.getAttribute('data-index'));
        let cart = getCart();
        cart[index].qty++;
        saveCart(cart);
        renderCart();
      });
    });
  }

  // 加入购物车全局方法
  window.addToCart = function(product) {
    let cart = getCart();
    let existing = cart.find(function(item) { return item.id === product.id; });

    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: product.qty || 1,
      });
    }

    saveCart(cart);
    if (window.showToast) showToast('已加入购物车');
  };

  // 初始渲染
  renderCart();
  updateCartCount();

  // 结算按钮 - 始终显示 "立即购买"
}

/* ---- 数量选择器 ---- */
function initQuantitySelectors() {
  document.querySelectorAll('.quantity-btn').forEach(function(btn) {
    if (btn.classList.contains('cart-qty-minus') || btn.classList.contains('cart-qty-plus')) return;

    btn.addEventListener('click', function() {
      let container = this.closest('.quantity-selector');
      let input = container.querySelector('.quantity-input');
      let val = parseInt(input.value) || 1;

      if (this.classList.contains('qty-minus') || this.textContent.trim() === '-') {
        val = Math.max(1, val - 1);
      } else if (this.classList.contains('qty-plus') || this.textContent.trim() === '+') {
        val = Math.min(99, val + 1);
      }

      input.value = val;
    });
  });
}

/* ---- 联系表单验证 ---- */
function initContactForm() {
  let form = document.getElementById('contact-form');
  let success = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    let valid = true;
    let fields = [
      { id: 'contact-name', msg: '请输入您的姓名' },
      { id: 'contact-phone', msg: '请输入您的联系电话' },
      { id: 'contact-message', msg: '请输入您的留言内容' },
    ];

    fields.forEach(function(field) {
      let el = document.getElementById(field.id);
      let group = el.closest('.form-group');
      if (!el.value.trim()) {
        group.classList.add('error');
        group.querySelector('.error-msg').textContent = field.msg;
        valid = false;
      } else {
        group.classList.remove('error');
      }
    });

    // 电话格式验证
    let phoneEl = document.getElementById('contact-phone');
    if (phoneEl && phoneEl.value.trim()) {
      let phonePattern = /^1[3-9]\d{9}$/;
      if (!phonePattern.test(phoneEl.value.trim())) {
        let group = phoneEl.closest('.form-group');
        group.classList.add('error');
        group.querySelector('.error-msg').textContent = '请输入正确的手机号码';
        valid = false;
      }
    }

    if (valid) {
      if (success) {
        success.style.display = 'block';
        form.reset();
        setTimeout(function() {
          success.style.display = 'none';
        }, 3000);
      }
      if (window.showToast) showToast('留言已提交，我们会尽快与您联系！');
    }
  });

  // 实时清除错误状态
  form.querySelectorAll('input, textarea').forEach(function(el) {
    el.addEventListener('input', function() {
      let group = this.closest('.form-group');
      if (this.value.trim()) {
        group.classList.remove('error');
      }
    });
  });
}

/* ---- 产品详情加载 ---- */
(function loadProductDetail() {
  let detailContainer = document.getElementById('product-detail-content');
  if (!detailContainer) return;

  let urlParams = new URLSearchParams(window.location.search);
  let productId = parseInt(urlParams.get('id')) || 1;

  let product = productData.find(function(p) { return p.id === productId; });
  if (!product) product = productData[0];

  document.title = product.name + ' - 东巍益华';

  // 更新页面内容（如果页面上有对应元素）
  let els = {
    'detail-name': product.name,
    'detail-model': '型号: ' + product.model,
    'detail-brand': product.brand,
    'detail-price': product.priceRange,
  };

  Object.keys(els).forEach(function(id) {
    let el = document.getElementById(id);
    if (el) el.textContent = els[id];
  });

  // 加入购物车按钮
  let addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      let qtyInput = document.querySelector('#product-detail-content .quantity-input');
      let qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      window.addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: qty,
      });
    });
  }

  // 立即购买按钮（先加购再跳转，带防护）
  let buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      let qtyInput = document.querySelector('#product-detail-content .quantity-input');
      let qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      if (typeof window.addToCart === 'function') {
        window.addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          qty: qty,
        });
      }
      setTimeout(function() {
        window.location.href = 'cart.html';
      }, 150);
    });
  }
})();

/* ---- 页面加载时初始化购物车显示 ---- */
updateAllCartCounts();

function updateAllCartCounts() {
  try {
    let cart = localStorage.getItem('dwyh_cart');
    cart = cart ? JSON.parse(cart) : [];
    let count = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);

    document.querySelectorAll('.cart-count').forEach(function(el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  } catch (e) {}
}

/* ---- 登录/注册 (Item 3) ---- */
function initAuth() {
  var authTabs = document.getElementById('auth-tabs');
  var loginForm = document.getElementById('login-form');
  var registerForm = document.getElementById('register-form');

  if (!authTabs || !loginForm || !registerForm) return;

  // Tab切换
  authTabs.querySelectorAll('.auth-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var targetTab = this.getAttribute('data-tab');
      authTabs.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');

      loginForm.classList.remove('active');
      registerForm.classList.remove('active');
      if (targetTab === 'login') {
        loginForm.classList.add('active');
      } else {
        registerForm.classList.add('active');
      }
    });
  });

  // 手机号验证函数
  function validatePhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone);
  }

  // 登录表单提交
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var valid = true;
    var phoneEl = document.getElementById('login-phone');
    var passwordEl = document.getElementById('login-password');

    // 验证手机号
    var phoneGroup = phoneEl.closest('.form-group');
    if (!validatePhone(phoneEl.value.trim())) {
      phoneGroup.classList.add('error');
      phoneGroup.querySelector('.error-msg').textContent = '请输入正确的手机号码';
      valid = false;
    } else {
      phoneGroup.classList.remove('error');
    }

    // 验证密码
    var pwdGroup = passwordEl.closest('.form-group');
    if (passwordEl.value.length < 6) {
      pwdGroup.classList.add('error');
      pwdGroup.querySelector('.error-msg').textContent = '密码长度不少于6位';
      valid = false;
    } else {
      pwdGroup.classList.remove('error');
    }

    if (valid) {
      // CRMEB 登录API对接点: POST /api/pc/login
      if (window.showToast) showToast('登录成功！（演示状态）');
    }
  });

  // 注册表单提交
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var valid = true;
    var phoneEl = document.getElementById('reg-phone');
    var smsEl = document.getElementById('reg-sms');
    var passwordEl = document.getElementById('reg-password');
    var confirmEl = document.getElementById('reg-password-confirm');

    // 验证手机号
    var phoneGroup = phoneEl.closest('.form-group');
    if (!validatePhone(phoneEl.value.trim())) {
      phoneGroup.classList.add('error');
      valid = false;
    } else {
      phoneGroup.classList.remove('error');
    }

    // 验证验证码
    var smsGroup = smsEl.closest('.form-group');
    if (!smsEl.value.trim()) {
      smsGroup.classList.add('error');
      smsGroup.querySelector('.error-msg').style.display = 'block';
      valid = false;
    } else {
      smsGroup.classList.remove('error');
      smsGroup.querySelector('.error-msg').style.display = 'none';
    }

    // 验证密码
    var pwdGroup = passwordEl.closest('.form-group');
    if (passwordEl.value.length < 6) {
      pwdGroup.classList.add('error');
      valid = false;
    } else {
      pwdGroup.classList.remove('error');
    }

    // 验证确认密码
    var cfmGroup = confirmEl.closest('.form-group');
    if (passwordEl.value !== confirmEl.value) {
      cfmGroup.classList.add('error');
      valid = false;
    } else {
      cfmGroup.classList.remove('error');
    }

    if (valid) {
      // CRMEB 注册API对接点: POST /api/pc/register
      if (window.showToast) showToast('注册成功！（演示状态）');
    }
  });

  // 发送验证码按钮
  var smsBtn = document.getElementById('btn-send-sms');
  if (smsBtn) {
    smsBtn.addEventListener('click', function() {
      var phoneEl = document.getElementById('reg-phone');
      if (!validatePhone(phoneEl.value.trim())) {
        phoneEl.closest('.form-group').classList.add('error');
        if (window.showToast) showToast('请先输入正确的手机号');
        return;
      }
      var countdown = 60;
      smsBtn.disabled = true;
      smsBtn.textContent = countdown + 's';
      var timer = setInterval(function() {
        countdown--;
        if (countdown <= 0) {
          clearInterval(timer);
          smsBtn.disabled = false;
          smsBtn.textContent = '发送验证码';
        } else {
          smsBtn.textContent = countdown + 's';
        }
      }, 1000);
      if (window.showToast) showToast('验证码已发送（演示状态）');
    });
  }

  // 实时清除错误状态
  document.querySelectorAll('.auth-form input').forEach(function(el) {
    el.addEventListener('input', function() {
      var group = this.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });
}
