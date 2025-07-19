/**
 * Enhanced form handler for LifeBet booking system
 * Handles API integration, validation, and loading states
 */

class BookingFormHandler {
  constructor() {
    this.form = null;
    this.submitButton = null;
    this.isSubmitting = false;
    this.apiBaseUrl = this.getApiBaseUrl();
    
    this.init();
  }
  
  getApiBaseUrl() {
    // In production, use the same domain. In development, use localhost:3000
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return window.location.origin;
  }
  
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.form = document.getElementById('booking-form');
      this.submitButton = this.form?.querySelector('button[type="submit"]');
      
      if (this.form) {
        this.setupFormHandlers();
        this.setupRealTimeValidation();
      }
    });
  }
  
  setupFormHandlers() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  setupRealTimeValidation() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    if (nameInput) {
      nameInput.addEventListener('blur', () => this.validateField('name', nameInput.value));
      nameInput.addEventListener('input', () => this.clearFieldError('name'));
    }
    
    if (emailInput) {
      emailInput.addEventListener('blur', () => this.validateField('email', emailInput.value));
      emailInput.addEventListener('input', () => this.clearFieldError('email'));
    }
    
    if (messageInput) {
      messageInput.addEventListener('input', () => {
        this.updateCharacterCount(messageInput);
        this.clearFieldError('message');
      });
    }
  }
  
  validateField(fieldName, value) {
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          isValid = false;
          errorMessage = 'Name is required';
        } else if (value.trim().length < 2) {
          isValid = false;
          errorMessage = 'Please enter your full name (at least 2 characters)';
        } else if (value.length > 100) {
          isValid = false;
          errorMessage = 'Name is too long (maximum 100 characters)';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid name using only letters, spaces, hyphens, and apostrophes';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          isValid = false;
          errorMessage = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address (e.g., name@example.com)';
        } else if (value.length > 254) {
          isValid = false;
          errorMessage = 'Email address is too long';
        }
        break;
        
      case 'message':
        if (value.length > 1000) {
          isValid = false;
          errorMessage = 'Message is too long (maximum 1000 characters)';
        }
        break;
    }
    
    if (!isValid) {
      this.showFieldError(fieldName, errorMessage);
    } else {
      this.clearFieldError(fieldName);
    }
    
    return isValid;
  }
  
  showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const existingError = field?.parentNode.querySelector('.field-error');
    
    if (existingError) {
      existingError.textContent = message;
      return;
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error text-red-600 text-sm mt-1';
    errorElement.textContent = message;
    
    if (field?.parentNode) {
      field.parentNode.appendChild(errorElement);
      field.classList.add('border-red-500', 'focus:ring-red-500');
      field.classList.remove('border-gray-300', 'focus:ring-primary');
    }
  }
  
  clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = field?.parentNode.querySelector('.field-error');
    
    if (errorElement) {
      errorElement.remove();
    }
    
    if (field) {
      field.classList.remove('border-red-500', 'focus:ring-red-500');
      field.classList.add('border-gray-300', 'focus:ring-primary');
    }
  }
  
  updateCharacterCount(messageInput) {
    const maxLength = 1000;
    const currentLength = messageInput.value.length;
    
    let counterElement = messageInput.parentNode.querySelector('.char-counter');
    
    if (!counterElement) {
      counterElement = document.createElement('div');
      counterElement.className = 'char-counter text-xs text-gray-500 mt-1 text-right';
      messageInput.parentNode.appendChild(counterElement);
    }
    
    counterElement.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength > maxLength * 0.9) {
      counterElement.classList.add('text-yellow-600');
      counterElement.classList.remove('text-gray-500');
    } else {
      counterElement.classList.remove('text-yellow-600');
      counterElement.classList.add('text-gray-500');
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;
    
    // Clear any previous general errors
    this.clearGeneralError();
    
    // Validate all fields
    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message') || ''
    };
    
    const isNameValid = this.validateField('name', data.name);
    const isEmailValid = this.validateField('email', data.email);
    const isMessageValid = this.validateField('message', data.message);
    
    if (!isNameValid || !isEmailValid || !isMessageValid) {
      this.showGeneralError('Please correct the errors above before submitting.');
      return;
    }
    
    // Set loading state
    this.setLoadingState(true);
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        this.handleSuccess(result.message);
      } else {
        this.handleError(result.message || 'An unexpected error occurred. Please try again.');
        
        // Handle specific field errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach(error => {
            this.showFieldError(error.field, error.message);
          });
        }
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.handleError('Unable to submit your request. Please check your connection and try again.');
    } finally {
      this.setLoadingState(false);
    }
  }
  
  setLoadingState(isLoading) {
    this.isSubmitting = isLoading;
    
    if (this.submitButton) {
      if (isLoading) {
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        `;
      } else {
        this.submitButton.disabled = false;
        this.submitButton.innerHTML = 'Submit Request';
      }
    }
  }
  
  handleSuccess(message) {
    // Reset form
    this.form.reset();
    this.clearAllErrors();
    
    // Use global modal functions if available
    if (window.LifeBetModals) {
      window.LifeBetModals.closeModal();
      
      // Update success message and open success modal
      setTimeout(() => {
        const successModal = document.getElementById('success-modal');
        const successMessage = successModal?.querySelector('p');
        if (successMessage) {
          successMessage.textContent = message || 'Thank you. We\'ve received your request and will be in touch within 24 hours to schedule your consultation. You\'ve taken an important step.';
        }
        
        if (successModal) {
          successModal.classList.remove('hidden');
          setTimeout(() => {
            document.getElementById('success-modal-content').classList.remove('scale-95');
          }, 10);
        }
      }, 350);
    } else {
      // Fallback if modal functions not available
      console.log('Success:', message);
      alert(message || 'Thank you for your submission! We will contact you soon.');
    }
  }
  
  handleError(message) {
    this.showGeneralError(message);
  }
  
  showGeneralError(message) {
    const existingError = this.form.querySelector('.general-error');
    if (existingError) {
      existingError.textContent = message;
      return;
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'general-error bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4';
    errorElement.textContent = message;
    
    this.form.insertBefore(errorElement, this.form.firstChild);
  }
  
  clearGeneralError() {
    const errorElement = this.form?.querySelector('.general-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  clearAllErrors() {
    this.clearGeneralError();
    ['name', 'email', 'message'].forEach(field => {
      this.clearFieldError(field);
    });
    
    // Clear character counter
    const charCounter = this.form?.querySelector('.char-counter');
    if (charCounter) {
      charCounter.remove();
    }
  }
}

// Initialize the form handler
new BookingFormHandler(); 