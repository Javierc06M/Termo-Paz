// Declare global variables from CDN libraries
const AOS = window.AOS
const bootstrap = window.bootstrap

// Wait for DOM and libraries to load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Animate On Scroll) if available
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })
  }

  // Initialize cart modal if Bootstrap is available
  let cartModal
  if (typeof bootstrap !== "undefined") {
    cartModal = new bootstrap.Modal(document.getElementById("cartModal"))
  }

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("mainNav")
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)"
        navbar.style.boxShadow = "0 2px 25px rgba(0, 0, 0, 0.15)"
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)"
        navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
      }
    }
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Shopping Cart Functionality
  let cart = []

  const products = {
    estandar: { name: "Cojín Estándar", price: 25.0 },
    infantil: { name: "Cojín Infantil", price: 20.0 },
    personalizado: { name: "Cojín Personalizado", price: 35.0 },
  }

  window.addToCart = (productId) => {
    const product = products[productId]
    if (product) {
      const existingItem = cart.find((item) => item.id === productId)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({
          id: productId,
          name: product.name,
          price: product.price,
          quantity: 1,
        })
      }
      updateCartDisplay()
      showCartNotification(product.name)
    }
  }

  window.removeFromCart = (productId) => {
    cart = cart.filter((item) => item.id !== productId)
    updateCartDisplay()
  }

  window.updateQuantity = (productId, newQuantity) => {
    const item = cart.find((item) => item.id === productId)
    if (item) {
      if (newQuantity <= 0) {
        window.removeFromCart(productId)
      } else {
        item.quantity = newQuantity
        updateCartDisplay()
      }
    }
  }

  function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems")
    const cartTotal = document.getElementById("cartTotal")

    if (!cartItems || !cartTotal) return

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío</p>'
      cartTotal.textContent = "0.00"
      return
    }

    let html = ""
    let total = 0

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      total += itemTotal

      html += `
                <div class="cart-item">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">S/ ${item.price.toFixed(2)} c/u</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary me-3" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <strong>S/ ${itemTotal.toFixed(2)}</strong>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `
    })

    cartItems.innerHTML = html
    cartTotal.textContent = total.toFixed(2)
  }

  function showCartNotification(productName) {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = "alert alert-success position-fixed"
    notification.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `
    notification.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${productName} agregado al carrito
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.remove()"></button>
        `

    document.body.appendChild(notification)

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 3000)
  }

  window.checkout = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío")
      return
    }

    // Simulate checkout process
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const message = `¡Hola! Me interesa comprar:\n\n${cart
      .map((item) => `• ${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}`)
      .join("\n")}\n\nTotal: S/ ${total.toFixed(2)}\n\n¿Podrían ayudarme con el proceso de compra?`

    const whatsappUrl = `https://wa.me/51987654321?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    if (cartModal) {
      cartModal.hide()
    }
  }

  // Contact form handling
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const name = this.querySelector('input[type="text"]').value
      const email = this.querySelector('input[type="email"]').value
      const phone = this.querySelector('input[type="tel"]').value
      const message = this.querySelector("textarea").value

      // Simulate form submission
      const whatsappMessage = `Nuevo contacto desde la web:\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nMensaje: ${message}`
      const whatsappUrl = `https://wa.me/51987654321?text=${encodeURIComponent(whatsappMessage)}`

      window.open(whatsappUrl, "_blank")

      // Reset form
      this.reset()

      // Show success message
      showNotification("Mensaje enviado correctamente. Te contactaremos pronto.", "success")
    })
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `alert alert-${type} position-fixed`
    notification.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `
    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.remove()"></button>
        `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 5000)
  }

  // Add CSS animation for notifications
  const style = document.createElement("style")
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `
  document.head.appendChild(style)

  // Lazy loading for images
  const images = document.querySelectorAll("img")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.classList.add("loaded")
        observer.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    img.classList.add("loading")
    imageObserver.observe(img)
  })

  // Add floating cart button
  function createFloatingCartButton() {
    const cartButton = document.createElement("button")
    cartButton.className = "btn btn-primary position-fixed"
    cartButton.style.cssText = `
            bottom: 30px;
            right: 30px;
            z-index: 1000;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            box-shadow: 0 4px 20px rgba(139, 69, 19, 0.3);
            transition: all 0.3s ease;
        `
    cartButton.innerHTML = '<i class="fas fa-shopping-cart"></i>'
    cartButton.onclick = () => {
      if (cartModal) {
        cartModal.show()
      }
    }

    cartButton.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)"
    })

    cartButton.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)"
    })

    document.body.appendChild(cartButton)
  }

  // Initialize floating cart button
  createFloatingCartButton()

  // Add scroll to top functionality
  function createScrollToTopButton() {
    const scrollButton = document.createElement("button")
    scrollButton.className = "btn btn-outline-primary position-fixed"
    scrollButton.style.cssText = `
            bottom: 100px;
            right: 30px;
            z-index: 1000;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            opacity: 0;
            transition: all 0.3s ease;
            background: white;
        `
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>'
    scrollButton.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" })

    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        scrollButton.style.opacity = "1"
        scrollButton.style.transform = "translateY(0)"
      } else {
        scrollButton.style.opacity = "0"
        scrollButton.style.transform = "translateY(20px)"
      }
    })

    document.body.appendChild(scrollButton)
  }

  // Initialize scroll to top button
  createScrollToTopButton()

  // Performance optimization: Debounce scroll events
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Apply debounce to scroll events
  const debouncedScrollHandler = debounce(() => {
    const navbar = document.getElementById("mainNav")
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)"
        navbar.style.boxShadow = "0 2px 25px rgba(0, 0, 0, 0.15)"
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)"
        navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
      }
    }
  }, 10)

  window.addEventListener("scroll", debouncedScrollHandler)

  console.log("Termo Paz website loaded successfully! 🌿")
})

// Add loading screen handler
window.addEventListener("load", () => {
  document.body.classList.add("loaded")

  // Remove any existing loading screens
  const loadingScreens = document.querySelectorAll(".loading-screen")
  loadingScreens.forEach((screen) => screen.remove())
})
