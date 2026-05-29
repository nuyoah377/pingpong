// 搜索功能
function searchDestination() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchInput)) {
            card.style.display = 'block';
            card.style.animation = 'slideIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });

    if (searchInput) {
        alert(`搜索结果：找到与 "${searchInput}" 相关的目的地`);
    }
}

// 查看详情按钮点击事件
document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const cardTitle = this.parentElement.querySelector('h3').textContent;
            alert(`您已选择：${cardTitle}\n\n联系我们获取更多信息！`);
        });
    });

    // 联系表单提交
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的消息！我们会尽快与您联系。');
            this.reset();
        });
    }

    // 页面滚动时的导航高亮
    const navLinks = document.querySelectorAll('.nav-menu a');
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
});

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .nav-menu a.active {
        color: #0066cc;
        border-bottom: 3px solid #0066cc;
        padding-bottom: 5px;
    }
`;
document.head.appendChild(style);

// 平滑滚动到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 价格过滤功能示例
function filterByPrice(maxPrice) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        
        if (price <= maxPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 控制台欢迎信息
console.log('%c欢迎来到遨游世界旅游平台！', 'color: #0066cc; font-size: 20px; font-weight: bold;');
console.log('%c💡 提示：您可以使用以下功能：', 'color: #00a8ff; font-size: 14px;');
console.log('searchDestination() - 搜索目的地');
console.log('filterByPrice(5000) - 按价格过滤（参数为最高价格）');
console.log('scrollToTop() - 回到页面顶部');
