// Inicialize o Stripe com sua chave pública (substitua 'pk_test_SUA_CHAVE_PUBLICA' pela sua chave)
const stripe = Stripe('pk_test_51R0nddFk363XDBOSNOtbivLEYyZKgpboh2MTPjzAqN7xPXeLLlagnuXyJhjl04PyWJK6TttQ40MKVdA1awGUBepa00prsx3Tr5');

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
confirmPlanButton.addEventListener('click', async () => {
  if (selectedPlan && selectedPrice) {
    // Armazena a seleção se necessário
    localStorage.setItem('selectedPlan', selectedPlan);
    localStorage.setItem('selectedPrice', selectedPrice);
    
    const userEmail = localStorage.getItem('userEmail') || "";

    try {
      // Cria uma sessão de checkout no backend
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: selectedPlan,
          // Converta o valor para centavos se necessário; 
          // neste exemplo, multiplica o valor (string) por 100. 
          // Certifique-se de que o backend esteja alinhado com essa conversão.
          price: parseFloat(selectedPrice) * 100, 
          email: userEmail
        })
      });
      
      const data = await response.json();
      
      if (data.id) {
        // Redireciona para o Stripe Checkout usando o session id retornado
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        if (result.error) {
          alert(result.error.message);
        }
      } else {
        alert('Ocorreu um erro ao criar a sessão de pagamento.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro. Tente novamente.');
    }
  }
});
