// Função para verificar se o elemento está visível na tela
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Elemento está no viewport se a parte superior estiver abaixo do topo da janela
    // e a parte inferior estiver acima do fundo da janela
    return (
      rect.top <= windowHeight * 0.85 &&
      rect.bottom >= 0
    );
  }
  
  // Função para animar elementos quando visíveis
  function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate');
    
    animatedElements.forEach(element => {
      if (isElementInViewport(element) && !element.classList.contains('animated')) {
        element.classList.add('animated');
      }
    });
  }
  
  // Efeito especial para a seção de upload
  function setupSpecialUploadEffect() {
    const uploadCard = document.getElementById('uploadCard');
    
    uploadCard.addEventListener('mouseenter', () => {
      uploadCard.classList.add('pulsing');
    });
    
    uploadCard.addEventListener('mouseleave', () => {
      uploadCard.classList.remove('pulsing');
    });
  }
  
  // Função para aplicar classes de animação de forma criativa e variada
  function setupAnimations() {
    // Hero Section - Animação suave de entrada
    document.querySelector('.hero h1').classList.add('animate', 'zoom');
    document.querySelector('.hero p').classList.add('animate', 'fade-up', 'delay-200');
    document.querySelector('.hero .btn').classList.add('animate', 'bounce', 'delay-400');
    
   
    
    // Steps Section - Efeito de flip para destacar o processo
    document.querySelector('.steps h2').classList.add('animate', 'fade-up');
    
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      step.classList.add('animate', 'flip', `delay-${(index + 1) * 100}`);
    });

    
    // Examples Section - Cartões que entram da esquerda e direita alternadamente
    document.querySelector('.examples h2').classList.add('animate', 'fade-up');
    
    const examples = document.querySelectorAll('.example-card');
    examples.forEach((example, index) => {
      if (index % 2 === 0) {
        example.classList.add('animate', 'slide-left', `delay-${(index + 1) * 100}`);
      } else {
        example.classList.add('animate', 'slide-right', `delay-${(index + 1) * 100}`);
      }
    });
    
    // Benefits Section - Efeito de bounce para chamar atenção
    document.querySelector('.benefits h2').classList.add('animate', 'fade-up');
    
    const benefits = document.querySelectorAll('.benefit-card');
    benefits.forEach((benefit, index) => {
      benefit.classList.add('animate', 'bounce', `delay-${(index + 1) * 100}`);
      
      // Adicionar efeito flutuante ao ícone dentro do benefício
      const icon = benefit.querySelector('.benefit-icon');
      if (icon) {
        icon.classList.add('animate', 'floating');
      }
    });
    
    // FAQ Section - Efeito de rotação para despertar interesse
    document.querySelector('.faq h2').classList.add('animate', 'fade-up');
    
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach((faq, index) => {
      faq.classList.add('animate', 'rotate-in', `delay-${(index + 1) * 100}`);
    });
    
    // Contact Section - Formulário de contato com aparição suave dos campos
    document.querySelector('.contact h2').classList.add('animate', 'fade-up');
    document.querySelector('.contact p').classList.add('animate', 'fade-up', 'delay-100');
    
    const formElements = document.querySelectorAll('#contactForm .form-row');
    formElements.forEach((element, index) => {
      element.classList.add('animate', 'slide-left', `delay-${(index + 2) * 100}`);
    });
    
    document.querySelector('#contactForm button').classList.add('animate', 'bounce', 'delay-500');
  }
  
  // Adicionar efeito de paralaxe leve na seção hero
  function setupParallaxEffect() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const hero = document.querySelector('.hero');
      
      if (scrollTop < hero.offsetHeight) {
        hero.style.backgroundPositionY = `${scrollTop * 0.5}px`;
      }
    });
  }
  
  // Inicializar tudo quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', function() {
    // Configurar todas as animações
    setupAnimations();
    
    // Configurar efeitos especiais
    setupSpecialUploadEffect();
    setupParallaxEffect();
    
    // Iniciar verificação de elementos visíveis
    animateOnScroll();
    
    // Adicionar evento de scroll
    window.addEventListener('scroll', animateOnScroll);
  });
  
  // Adicionar efeito de surpresa na interação com botões
  document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Criar efeito de onda ao clicar (se não for um link que navega para outro lugar)
        if (!this.getAttribute('href') || this.getAttribute('href').startsWith('#')) {
          const circle = document.createElement('div');
          const diameter = Math.max(this.offsetWidth, this.offsetHeight);
          
          circle.style.width = circle.style.height = `${diameter}px`;
          circle.style.left = `${e.clientX - this.getBoundingClientRect().left - diameter/2}px`;
          circle.style.top = `${e.clientY - this.getBoundingClientRect().top - diameter/2}px`;
          circle.classList.add('ripple');
          
          // Remover qualquer onda existente
          const ripple = this.querySelector('.ripple');
          if (ripple) {
            ripple.remove();
          }
          
          this.appendChild(circle);
        }
      });
    });
  });