import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Divider from 'material-ui/Divider';
import { Card } from 'material-ui/Card';
import {
  Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn } from 'material-ui/Table';
import Nav from '../layouts/Nav';
import Sidebar from '../layouts/Sidebar';
import Searchbar from '../forms/Searchbar';
import Pagination from '../elements/Pagination';
import { nextPage, prevPage } from '../../utils/paginate';
import * as userActions from '../../actions/userActions';
import * as searchActions from '../../actions/searchActions';
import insertRole from '../../utils/insertRole';

/**
 * Controller component to manage users
 * @class ManageUsersPage
 * @extends {React.Component}
 */
export class ManageUsersPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      users: [...props.users],
      pageData: Object.assign({}, props.pageData),
      usersLoaded: false
    };
  }

  /**
   * Call to get users after component mounts
   * @memberOf ManageUsersPage
   */
  componentDidMount() {
    this.props.actions.getUsers();
  }

  /**
   * Update state with props
   * @param {object} nextProps
   * @memberOf ManageUsersPage
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.pageData !== nextProps.pageData) {
      this.setState({
        users: [...nextProps.users],
        pageData: Object.assign({}, nextProps.pageData),
        usersLoaded: true
      });
    }
  }

  /**
   * Place retrieved users on the component
   * @memberOf ManageUsersPage
   */
  placeUsers = (user, index) =>
    <TableRow key={user.id}>
      <TableRowColumn>{index + 1}</TableRowColumn>
      <TableRowColumn>{user.id}</TableRowColumn>
      <TableRowColumn>{user.name}</TableRowColumn>
      <TableRowColumn>{user.username}</TableRowColumn>
      <TableRowColumn>{insertRole(user.roleId)}</TableRowColumn>
      <TableRowColumn><Link to={`/user/${user.id}`}>
        Visit Profile</Link></TableRowColumn>
    </TableRow>;

  /**
   * Renders the ManageUsers page
   * @returns {object} jsx
   * @memberOf ManageUsersPage
   */
  render() {
    const { users, usersLoaded, pageData } = this.state;
    return (
      <div className="users-page">
        <div className="row">
          <div className="col s12 m4 l3">
            <Sidebar />
          </div>
          <div className="col s12 m8 l9">
            <div className="row">
              <div className="headers">
                <h3>Users</h3>
                <Searchbar />
              </div>
              <Card className="users-card">
                <Table className="animated zoomIn">
                  <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                    enableSelectAll={false}
                  >
                    <TableRow>
                      <TableHeaderColumn>S/N</TableHeaderColumn>
                      <TableHeaderColumn>UserID</TableHeaderColumn>
                      <TableHeaderColumn>Name</TableHeaderColumn>
                      <TableHeaderColumn>Username</TableHeaderColumn>
                      <TableHeaderColumn>Role</TableHeaderColumn>
                      <TableHeaderColumn></TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    displayRowCheckbox={false}
                    stripedRows={true}
                  >
                  {users
                  && users.map(this.placeUsers)}
                  </TableBody>
                </Table>
              </Card>
            </div>
            {usersLoaded
            && <Pagination
              documents={users}
              nextPage={() => nextPage(
                users,
                this.props.actions.getUsers,
                0,
                pageData.offset,
                pageData.query,
                this.props.actions.searchUsers
              )}
              prevPage={() => prevPage(
                this.props.actions.getUsers,
                0,
                pageData.offset,
                pageData.query,
                this.props.actions.searchUsers
              )}
              pageData={pageData} />}
          </div>
        </div>
      </div>
    );
  }
}

ManageUsersPage.propTypes = {
  actions: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  pageData: PropTypes.object.isRequired,
  access: PropTypes.object.isRequired
};

/**
 * Make state available as props
 * @param {object} state
 * @param {object} ownProps
 * @returns {object} props
 */
function mapStateToProps(state, ownProps) {
  return {
    users: state.users,
    pageData: state.pageData,
    access: state.userAccess
  };
}

/**
 * Make actions available as props
 * @param {function} dispatch
 * @returns {function} action
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(userActions, searchActions),
      dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsersPage);
