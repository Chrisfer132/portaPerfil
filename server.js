const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const stripe = require('stripe')('sk_test_51R0nddFk363XDBOSy4Gs1h2hNkuxCbNJyv8GB6gbWzmypFygiSMmybZRJYQPpelYioYapwDMbhjyN8u9C2PA17W100SlQzr47S'); // Sua chave secreta real
const app = express();

// Configuração do Multer para upload
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Endpoint para upload do currículo
app.post('/upload-curriculo', upload.single('curriculo'), (req, res) => {
  console.log('Arquivo recebido:', req.file);
  // Aqui você pode salvar o caminho do arquivo e o email se necessário
  res.json({ filePath: req.file.path });
});

// Endpoint para criar a sessão do Stripe, incluindo metadata com o caminho do currículo
app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('Requisição recebida em /create-checkout-session:', req.body);
    const { plan, price, email, curriculoPath } = req.body;
    const productName = plan === 'normal'
      ? 'Plano Normal (24 horas)'
      : 'Plano Express (2 horas)';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: productName,
          },
          unit_amount: price,
        },
        quantity: 1,
      }],
      success_url: 'http://127.0.0.1:5500/sucesso.html',
      cancel_url: 'http://127.0.0.1:5500/cancelado.html',
      metadata: {
        curriculoPath,  // armazena o caminho do arquivo do currículo
        userEmail: email
      }
    });
    console.log('Sessão criada com sucesso:', session.id);
    return res.json({ id: session.id });
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint para o webhook do Stripe
// Use express.raw para ler o corpo como buffer
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_SEU_WEBHOOK_SECRET'; // Seu secret do webhook
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Erro na verificação do webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { curriculoPath, userEmail } = session.metadata;
    // Envie o e-mail com o currículo anexado
    sendEmail(userEmail, curriculoPath);
  }

  res.json({ received: true });
});

function sendEmail(userEmail, curriculoPath) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.seudominio.com', // seu host SMTP
    port: 587,
    secure: false,
    auth: {
      user: 'seu-email@seudominio.com',
      pass: 'sua-senha'
    }
  });

  const mailOptions = {
    from: '"Seu Nome" <seu-email@seudominio.com>',
    to: 'seu-email@seudominio.com',  // para onde você quer receber o e-mail
    subject: 'Novo pagamento confirmado e currículo recebido',
    text: `Pagamento confirmado do usuário ${userEmail}. Veja o currículo anexado.`,
    attachments: [{
      filename: 'curriculo.pdf', // você pode usar o nome original do arquivo
      path: curriculoPath
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Erro ao enviar e-mail:', error);
    }
    console.log('E-mail enviado:', info.messageId);
  });
}

app.listen(4242, () => {
  console.log('Servidor rodando na porta 4242');
});
