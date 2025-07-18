import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaBuilding, FaPhone, FaSearch, FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import { DataContext } from './DataContext'; // Import DataContext
import './App.css'; // Assuming your CSS is here

function Customers() {
  const navigate = useNavigate();
  // Destructure customers, projects, and the addCustomer function from DataContext
  // No need to destructure API_URL here if using addCustomer from context
  const { customers, projects, fetchCustomers, addCustomer } = useContext(DataContext); // Added addCustomer here!

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This useEffect ensures customers are fetched when the component mounts
  // This is crucial for showing existing customers on initial load.
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]); // Dependency array includes fetchCustomers to prevent stale closure if it changes (though it's useCallback'd)

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const customersWithProjectCount = useMemo(() => {
    return filteredCustomers.map(customer => {
      const projectCount = projects.filter(project =>
        project.customer_id === customer.customer_id
      ).length;
      return {
        ...customer,
        projectCount
      };
    });
  }, [filteredCustomers, projects]);

  const handleAddCustomer = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // *** IMPORTANT CHANGE: Call the addCustomer function from DataContext ***
      // DataContext's addCustomer internally calls createItem and then refetches customers.
      await addCustomer(newCustomer);

      setShowAddModal(false); // Close the modal
      setNewCustomer({ // Reset the form
        name: '',
        company: '',
        email: '',
        phone: ''
      });
      // No need to call fetchCustomers() here, as DataContext's addCustomer already does it.
    } catch (error) {
      console.error('Error creating customer:', error);
      // Display a more user-friendly message based on the error
      alert(`Failed to create customer: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>CUSTOMERS</h3>
        <div className="main-title-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-button" onClick={handleAddCustomer}>
            <FaPlus /> Add Customer
          </button>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button
                className="close-button"
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <FaUser className="icon" /> Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FaBuilding className="icon" /> Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={newCustomer.company}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>
                  <FaEnvelope className="icon" /> Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newCustomer.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FaPhone className="icon" /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={isSubmitting}
                >
                  <FaSave /> {isSubmitting ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className='customer-list-container'>
        <h3>All Customers ({customersWithProjectCount.length})</h3>
        <div className="customer-list-header">
          <span>Name</span>
          <span>Company</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Projects</span>
        </div>

        {customersWithProjectCount.length > 0 ? (
          customersWithProjectCount.map(customer => (
            <div
              key={customer.customer_id}
              className='customer-item'
              onClick={() => navigate(`/customers/${customer.customer_id}`)}
            >
              <span className="customer-name">
                <FaUser className="icon" /> {customer.name}
              </span>
              <span className="customer-company">
                <FaBuilding className="icon" /> {customer.company || 'N/A'}
              </span>
              <span className="customer-email">
                <FaEnvelope className="icon" /> {customer.email}
              </span>
              <span className="customer-phone">
                <FaPhone className="icon" /> {customer.phone || 'N/A'}
              </span>
              <span className="customer-projects">
                {customer.projectCount} projects
              </span>
            </div>
          ))
        ) : (
          <div className="no-results">
            {searchTerm ? 'No customers match your search' : 'No customers found'}
          </div>
        )}
      </div>
    </main>
  );
}

export default Customers;
