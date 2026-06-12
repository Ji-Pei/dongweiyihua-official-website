/* ============================================
   东巍益华 (DongWeiYiHua) 官网交互脚本
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initHeroSlider();
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

/* ---- Hero轮播 ---- */
function initHeroSlider() {
  let slides = document.querySelectorAll('.hero-slide');
  let dots = document.querySelectorAll('.hero-dot');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval = null;
  let intervalTime = 3000;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (dots.length > 0) dots[currentSlide].classList.remove('active');

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    if (dots.length > 0) dots[currentSlide].classList.add('active');
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(function() {
      goToSlide(currentSlide + 1);
    }, intervalTime);
  }

  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  // 指示点点击
  if (dots.length > 0) {
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        goToSlide(i);
        startAutoPlay();
      });
    });
  }

  // 触摸滑动
  let slider = document.querySelector('.hero-slider');
  if (slider) {
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    });

    slider.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        goToSlide(currentSlide + 1);
      } else if (touchEndX - touchStartX > 50) {
        goToSlide(currentSlide - 1);
      }
      startAutoPlay();
    });
  }

  // 启动
  slides[currentSlide].classList.add('active');
  if (dots.length > 0) dots[currentSlide].classList.add('active');
  startAutoPlay();
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

/* ---- 产品筛选 ---- */
function initProductFilter() {
  let filterForm = document.getElementById('filter-form');
  let productGrid = document.getElementById('product-grid');
  let noResults = document.getElementById('no-results');
  let resultCount = document.getElementById('result-count');
  let pagination = document.getElementById('pagination');

  if (!filterForm || !productGrid) return;

  let itemsPerPage = 6;
  let currentPage = 1;

  function filterProducts() {
    let checkedBrands = [];
    let checkedCategories = [];

    filterForm.querySelectorAll('input[name="brand"]:checked').forEach(function(cb) {
      checkedBrands.push(cb.value);
    });

    filterForm.querySelectorAll('input[name="category"]:checked').forEach(function(cb) {
      checkedCategories.push(cb.value);
    });

    let minPrice = parseInt(filterForm.querySelector('#price-min').value) || 0;
    let maxPrice = parseInt(filterForm.querySelector('#price-max').value) || 999999;

    return productData.filter(function(product) {
      let brandMatch = checkedBrands.length === 0 || checkedBrands.indexOf(product.brand) !== -1;
      let catMatch = checkedCategories.length === 0 || checkedCategories.indexOf(product.category) !== -1;
      let priceMatch = product.price >= minPrice && product.price <= maxPrice;
      return brandMatch && catMatch && priceMatch;
    });
  }

  function renderProducts(page) {
    let filtered = filterProducts();
    let totalPages = Math.ceil(filtered.length / itemsPerPage);
    let start = (page - 1) * itemsPerPage;
    let pageItems = filtered.slice(start, start + itemsPerPage);

    // 更新数量
    if (resultCount) {
      resultCount.textContent = '共 ' + filtered.length + ' 个产品';
    }

    // 清空
    productGrid.innerHTML = '';

    if (pageItems.length === 0) {
      if (noResults) noResults.style.display = 'block';
      if (pagination) pagination.style.display = 'none';
      productGrid.innerHTML = '';
      return;
    }

    if (noResults) noResults.style.display = 'none';

    pageItems.forEach(function(product) {
      let card = document.createElement('a');
      card.className = 'product-card';
      card.href = 'product-detail.html?id=' + product.id;
      card.innerHTML =
        '<div class="product-card-img" style="background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:0.75rem;">产品图片</div>' +
        '<div class="product-card-body">' +
          '<span class="brand-tag brand-tag-sm">' + product.brand + '</span>' +
          '<h4>' + product.name + '</h4>' +
          '<p class="product-model">' + product.model + '</p>' +
        '</div>';
      productGrid.appendChild(card);
    });

    // 分页
    if (pagination) {
      if (totalPages <= 1) {
        pagination.style.display = 'none';
      } else {
        pagination.style.display = 'flex';
        renderPagination(totalPages, page);
      }
    }
  }

  function renderPagination(totalPages, currentPage) {
    let html = '';

    if (currentPage > 1) {
      html += '<a href="#" data-page="' + (currentPage - 1) + '">&laquo;</a>';
    }

    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        html += '<a href="#" class="active" data-page="' + i + '">' + i + '</a>';
      } else {
        html += '<a href="#" data-page="' + i + '">' + i + '</a>';
      }
    }

    if (currentPage < totalPages) {
      html += '<a href="#" data-page="' + (currentPage + 1) + '">&raquo;</a>';
    }

    pagination.innerHTML = html;

    pagination.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        let page = parseInt(this.getAttribute('data-page'));
        if (page) {
          currentPage = page;
          renderProducts(currentPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // 筛选事件
  filterForm.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('change', function() {
      currentPage = 1;
      renderProducts(currentPage);
    });
    input.addEventListener('input', function() {
      currentPage = 1;
      renderProducts(currentPage);
    });
  });

  // 初始渲染
  renderProducts(1);
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
