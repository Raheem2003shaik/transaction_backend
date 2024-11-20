const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://raheem:raheemshaik@cluster0.jyupv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const transactionSchema = new mongoose.Schema({
    transaction_id: {
        type: Number,
        unique: true 
    },
    amount: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    transaction_type: {
        type: String,
        enum: ['DEPOSIT', 'WITHDRAWAL'],
        required: true
    },
    user: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    }
});

transactionSchema.pre('save', async function (next) {
    const transaction = this;

    if (transaction.isNew) {
        const lastTransaction = await mongoose.model('Transaction').findOne().sort({ transaction_id: -1 });
        transaction.transaction_id = lastTransaction ? lastTransaction.transaction_id + 1 : 1;
    }
    next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
