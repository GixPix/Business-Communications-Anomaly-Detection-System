async function generateEmbedding(text) {
    let { pipeline } = await import('@xenova/transformers');
    try {
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        const embedding = await extractor(text, { pooling: 'mean', normalize: true });        
        return Array.from(embedding["data"]);  
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error('Embedding generation failed');
    }
}

module.exports = { generateEmbedding };
