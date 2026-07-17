import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeAPI.getById(id);
        setEmployee(response.data.data.employee);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch employee details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    try {
      await employeeAPI.delete(id);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee.');
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      active: 'badge badge-active',
      inactive: 'badge badge-inactive',
      on_leave: 'badge badge-leave',
    };
    const labels = { active: 'Active', inactive: 'Inactive', on_leave: 'On Leave' };
    return <span className={classes[status] || 'badge'}>{labels[status] || status}</span>;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn btn-secondary">← Back to List</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/" className="btn btn-ghost">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>
        <div className="header-actions">
          <Link to={`/employees/${id}/edit`} className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </Link>
          <button className="btn btn-danger" onClick={() => setDeleteConfirm(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div className="avatar avatar-lg">
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2>{employee.name}</h2>
            <p className="text-muted">{employee.role} · {employee.department}</p>
          </div>
          {getStatusBadge(employee.status)}
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <label>Full Name</label>
            <p>{employee.name}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>
              <a href={`mailto:${employee.email}`}>{employee.email}</a>
            </p>
          </div>
          <div className="detail-item">
            <label>Department</label>
            <p>{employee.department}</p>
          </div>
          <div className="detail-item">
            <label>Role</label>
            <p>{employee.role}</p>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <p>{getStatusBadge(employee.status)}</p>
          </div>
          <div className="detail-item">
            <label>Added</label>
            <p>{new Date(employee.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Employee</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{employee.name}</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailPage;
