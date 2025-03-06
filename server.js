
// Rota principal para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname));

app.get('/templates', (req, res) => {
    res.json({
        templates: [
            { id: 'minimal', name: 'Minimalista', description: 'Design limpo e profissional' },
            { id: 'creative', name: 'Criativo', description: 'Perfeito para áreas criativas' },
            { id: 'corporate', name: 'Corporativo', description: 'Ideal para ambientes tradicionais' }
        ]
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Acesse: http://localhost:${port}`);
});