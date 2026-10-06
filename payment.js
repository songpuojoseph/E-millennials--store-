const PAYSTACK_CONFIG = {
    publicKey: "pk_test_cb92c13c7f1778bfc4d7540ff9b3dbbe7c088b07",
    currency: "GHS"
};

const Payment = {

    start(customer, amount, onSuccess) {

        if (!PAYSTACK_CONFIG.publicKey) {
            showToast("Add your Paystack public test key first.");
            return false;
        }

        if (typeof PaystackPop === "undefined") {
            showToast("Paystack could not be loaded. Check your internet connection.");
            return false;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            showToast("Your order total is invalid.");
            return false;
        }

        const paystack = new PaystackPop();

        paystack.newTransaction({
            key: PAYSTACK_CONFIG.publicKey,

            email: customer.email,

            amount: Math.round(amount * 100),

            currency: PAYSTACK_CONFIG.currency,

            metadata: {
                custom_fields: [
                    {
                        display_name: "Customer name",
                        variable_name: "customer_name",
                        value: customer.name
                    },
                    {
                        display_name: "Phone number",
                        variable_name: "phone_number",
                        value: customer.phone
                    }
                ]
            },

            onSuccess: function(transaction) {
                onSuccess(transaction);
            },

            onCancel: function() {
                showToast("Payment was cancelled.");
            },

            onError: function(error) {
                console.error(error);
                showToast("Payment could not be completed.");
            }
        });

        return true;
    }
};
