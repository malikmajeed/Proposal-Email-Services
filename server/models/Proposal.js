class Proposal {
  constructor(data) {
    this.name = data.name || '';
    this.address = data.address || '';
    this.email = data.email || '';
    this.contact = data.contact || '';
    this.company = data.company || '';
    this.termination = data.termination || '';
    this.paymentTerms = data.paymentTerms || '';
    this.serviceStartDate = data.serviceStartDate || '';
    this.note = data.note || '';
    this.services = data.services || [];
  }

  validate() {
    const errors = [];
    
    if (!this.name.trim()) errors.push('Name is required');
    if (!this.email.trim()) errors.push('Email is required');
    if (!this.paymentTerms.trim()) errors.push('Payment Terms is required');
    if (!this.termination.trim()) errors.push('Termination is required');
    
    if (this.services.length === 0) {
      errors.push('At least one service is required');
    }
    
    this.services.forEach((service, index) => {
      if (!service.service) errors.push(`Service ${index + 1}: Service type is required`);
      if (service.hourlyRate < 0) errors.push(`Service ${index + 1}: Hourly rate must be positive`);
      if (service.hours < 0) errors.push(`Service ${index + 1}: Hours must be positive`);
      if (service.guards < 1) errors.push(`Service ${index + 1}: Guards must be at least 1`);
    });
    
    return errors;
  }

  calculateTotals() {
    this.services = this.services.map(service => ({
      ...service,
      totalCost: parseFloat((service.hourlyRate * service.hours * service.guards).toFixed(2))
    }));
    return this;
  }

  toJSON() {
    return {
      name: this.name,
      address: this.address,
      email: this.email,
      contact: this.contact,
      company: this.company,
      termination: this.termination,
      paymentTerms: this.paymentTerms,
      serviceStartDate: this.serviceStartDate,
      note: this.note,
      services: this.services
    };
  }
}

module.exports = Proposal;
