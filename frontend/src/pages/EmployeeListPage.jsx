import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI } from '../services/api';

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchEmployees = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const response = await employeeAPI.getAll(params);
      setEmployees(response.data.data.employees);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(1);
  };

  const handleDelete = async (id) => {
    try {
      await employeeAPI.delete(id);
      setDeleteConfirm(null);
      fetchEmployees(pagination.page);
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
    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      on_leave: 'On Leave',
    };
    return <span className={classes[status] || 'badge'}>{labels[status] || status}</span>;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p className="subtitle">{pagination.total} total employees</p>
        </div>
        <Link to="/employees/new" className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Employee
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="toolbar">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, department, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
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

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading employees...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <h3>No employees found</h3>
          <p>Get started by adding your first employee.</p>
          <Link to="/employees/new" className="btn btn-primary">Add Employee</Link>
        </div>
      ) : (
        <>
          {/* Employee Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="employee-name">
                        <div className="avatar">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <Link to={`/employees/${emp.id}`} className="name-link">
                          {emp.name}
                        </Link>
                      </div>
                    </td>
                    <td className="text-muted">{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.role}</td>
                    <td>{getStatusBadge(emp.status)}</td>
                    <td>
                      <div className="action-btns">
                        <Link to={`/employees/${emp.id}`} className="btn btn-sm btn-ghost" title="View">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                        <Link to={`/employees/${emp.id}/edit`} className="btn btn-sm btn-ghost" title="Edit">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        <button
                          className="btn btn-sm btn-ghost btn-danger"
                          title="Delete"
                          onClick={() => setDeleteConfirm(emp)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-sm btn-ghost"
                disabled={pagination.page <= 1}
                onClick={() => fetchEmployees(pagination.page - 1)}
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-sm btn-ghost"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchEmployees(pagination.page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Employee</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
