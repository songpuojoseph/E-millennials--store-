const Cart = {
    items: [],

    add(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
    },

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
    },

    increase(productId) {
        const item = this.find(productId);

        if (item) {
            item.quantity += 1;
        }
    },

    decrease(productId) {
        const item = this.find(productId);

        if (!item) {
            return;
        }

        item.quantity -= 1;

        if (item.quantity <= 0) {
            this.remove(productId);
        }
    },

    find(productId) {
        return this.items.find(item => item.id === productId);
    },

    itemCount() {
        return this.items.length;
    },

    totalQuantity() {
        return this.items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
    },

    total() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },

    clear() {
        this.items = [];
    }
};
