const selectPlanButtons = document.querySelectorAll('.select-plan');
    const selectedPlanMessage = document.getElementById('selectedPlanMessage');
    const selectedPlanNameSpan = document.getElementById('selectedPlanName');
    let selectedPlan = null;
    let selectedPrice = null;
    
    selectPlanButtons.forEach(button => {
      button.addEventListener('click', () => {
        selectedPlan = button.getAttribute('data-plan');
        selectedPrice = button.getAttribute('data-price');
        selectedPlanNameSpan.textContent = selectedPlan === 'normal' 
          ? 'Normal (24 horas - R$29,90)' 
          : 'Express (2 horas - R$49,90)';
        selectedPlanMessage.style.display = 'block';
      });
    });

    const confirmPlanButton = document.getElementById('confirmPlan');
    confirmPlanButton.addEventListener('click', () => {
      if (selectedPlan && selectedPrice) {
        localStorage.setItem('selectedPlan', selectedPlan);
        localStorage.setItem('selectedPrice', selectedPrice);
        const userEmail = localStorage.getItem('userEmail') || "";
        const planText = selectedPlan === 'normal'
          ? "Normal (Entrega em até 24 horas)"
          : "Express (Entrega em até 2 horas)";
        const message = `Olá, gostaria de confirmar o pagamento do plano ${planText} no valor de R$${selectedPrice}. Meu e-mail é ${userEmail}. Por favor, me envie os dados do PIX para efetuar o pagamento.`;
        const encodedMessage = encodeURIComponent(message);
        // Atualize o número de WhatsApp com seu número completo (ex: 5511999999999)
        const phoneNumber = "5511999999999";
        const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
        window.location.href = whatsappURL;
      }
    });