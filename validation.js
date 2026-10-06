const Validation = {

    clearErrors() {
        document.getElementById("nameError").textContent = "";
        document.getElementById("emailError").textContent = "";
        document.getElementById("phoneError").textContent = "";

        document.getElementById("customerName").classList.remove("input-error");
        document.getElementById("customerEmail").classList.remove("input-error");
        document.getElementById("customerPhone").classList.remove("input-error");
    },

    showError(inputId, errorId, message) {
        document.getElementById(errorId).textContent = message;
        document.getElementById(inputId).classList.add("input-error");
    },

    validateName(name) {
        return name.trim().length >= 2;
    },

    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email.trim());
    },

    validatePhone(phone) {
        const phonePattern = /^[0-9+\-\s()]{10,15}$/;
        return phonePattern.test(phone.trim());
    },

    validate(customer) {
        this.clearErrors();

        let isValid = true;

        if (!this.validateName(customer.name)) {
            this.showError(
                "customerName",
                "nameError",
                "Please enter your full name."
            );

            isValid = false;
        }

        if (!this.validateEmail(customer.email)) {
            this.showError(
                "customerEmail",
                "emailError",
                "Please enter a valid email address."
            );

            isValid = false;
        }

        if (!this.validatePhone(customer.phone)) {
            this.showError(
                "customerPhone",
                "phoneError",
                "Please enter a valid phone number."
            );

            isValid = false;
        }

        return isValid;
    }
};
