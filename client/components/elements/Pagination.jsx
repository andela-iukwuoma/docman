import React, { PropTypes } from 'react';

/**
 * Displays pagination
 * @param {any} { documents, nextPage, prevPage, pageData }
 * @returns {object} jsx that displays the pagintion
 */
function Pagination({ documents, nextPage, prevPage, pageData }) {
  if (pageData.pageSize > 0) {
    return (
      <div>
        <ul className="pagination center-align">
          <li className={pageData.pageNumber < 2 ? 'disabled' : 'waves-effect'}>
            <a onClick={prevPage} href="#!">
              <i className="material-icons">chevron_left</i>
            </a>
          </li>
          <li id="paginationText">
            Page {pageData.pageNumber} of {pageData.totalPages}
          </li>
          <li className={documents.length < 9 ? 'disabled' : 'waves-effect'}>
            <a onClick={nextPage} href="#!" className="next">
              <i className="material-icons">chevron_right</i>
            </a>
          </li>
        </ul>
        <div className="center">
          Showing {pageData.pageSize} of {pageData.count} results
        </div>
      </div>
    );
  }
  return (
    <div>
      <p className="center-align">
        {location.pathname === '/manageusers' ? 'No users found'
        : 'No documents found'}
      </p>
    </div>
  );
}

Pagination.propTypes = {
  users: PropTypes.array,
  documents: PropTypes.array,
  pageData: PropTypes.object.isRequired,
  nextPage: PropTypes.func.isRequired,
  prevPage: PropTypes.func.isRequired
};

export default Pagination;
