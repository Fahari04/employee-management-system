import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeAPI } from '../services/api';

const EmployeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        try {
          const response = await employeeAPI.getById(id);
          const emp = response.data.data.employee;
          setFormData({
            name: emp.name,
            email: emp.email,
            department: emp.department,
            role: emp.role,
            status: emp.status,
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch employee.');
        } finally {
          setFetching(false);
        }
      };
      fetchEmployee();
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.department.trim()) errors.department = 'Department is required';
    if (!formData.role.trim()) errors.role = 'Role is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await employeeAPI.update(id, formData);
      } else {
        await employeeAPI.create(formData);
      }
      navigate(isEdit ? `/employees/${id}` : '/');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.message).join(', ') ||
        'An error occurred.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to={isEdit ? `/employees/${id}` : '/'} className="btn btn-ghost">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <h2>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
          <p className="text-muted">{isEdit ? 'Update employee information' : 'Fill in the details to create a new employee record'}</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name <span className="required">*</span></label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                className={fieldErrors.name ? 'input-error' : ''}
              />
              {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. john@company.com"
                value={formData.email}
                onChange={handleChange}
                className={fieldErrors.email ? 'input-error' : ''}
              />
              {fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department <span className="required">*</span></label>
              <input
                id="department"
                name="department"
                type="text"
                placeholder="e.g. Engineering"
                value={formData.department}
                onChange={handleChange}
                className={fieldErrors.department ? 'input-error' : ''}
              />
              {fieldErrors.department && <span className="error-text">{fieldErrors.department}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="role">Role <span className="required">*</span></label>
              <input
                id="role"
                name="role"
                type="text"
                placeholder="e.g. Senior Developer"
                value={formData.role}
                onChange={handleChange}
                className={fieldErrors.role ? 'input-error' : ''}
              />
              {fieldErrors.role && <span className="error-text">{fieldErrors.role}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>

          <div className="form-actions">
            <Link to={isEdit ? `/employees/${id}` : '/'} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner-sm" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEdit ? 'Update Employee' : 'Create Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormPage;
