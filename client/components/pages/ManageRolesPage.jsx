import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import toastr from 'toastr';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import { Card } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn } from 'material-ui/Table';
import Nav from '../layouts/Nav';
import TextInput from '../forms/TextInput';
import Sidebar from '../layouts/Sidebar';
import * as roleActions from '../../actions/roleActions';
import insertRole from '../../utils/insertRole';
import handleError from '../../utils/errorHandler';

/**
 * Container component for Roles
 * @class ManageRolesPage
 * @extends {React.Component}
 */
export class ManageRolesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [...props.roles],
      newRole: { title: '' },
      editRole: { title: '' },
      roleToEdit: ''
    };
    this.editButtonClick = this.editButtonClick.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onEditSubmit = this.onEditSubmit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
  }

  /**
   * Calls action after component mounts
   * Initializes modal
   * @memberOf ManageRolesPage
   */
  componentDidMount = () => {
    this.props.actions.getRoles();
    $('.modal').modal();
  }

  /**
   * Updates state with props
   * @param {object} nextProps
   * @memberOf ManageRolesPage
   */
  componentWillReceiveProps(nextProps) {
    if (this.state.roles !== nextProps.roles) {
      this.setState({
        roles: [...nextProps.roles]
      });
    }
  }

  /**
   * Sets the new role field to state
   * @param {object} event
   * @memberOf ManageRolesPage
   */
  handleChange(event) {
    const rejectedCharacters = /[^a-z]/;
    if (!rejectedCharacters.test(event.target.value)) {
      const newRole = this.state.newRole;
      newRole.title = event.target.value.substr(0, 20);
      this.setState({ newRole });
    }
  }

  /**
   * Sets the edit role field to state
   * @param {any} event
   * @memberOf ManageRolesPage
   */
  handleEditChange(event) {
    const rejectedCharacters = /[^a-z]/;
    if (!rejectedCharacters.test(event.target.value)) {
      const editRole = this.state.editRole;
      editRole.title = event.target.value.substr(0, 20);
      this.setState({ editRole });
    }
  }

  /**
   * Submits the new role form
   * @param {object} event
   * @memberOf ManageRolesPage
   */
  onSubmit(event) {
    event.preventDefault();
    this.props.actions.createRole(this.state.newRole)
    .then(() => {
      toastr.success('Role added successfully');
      const newRole = this.state.newRole;
      this.state.newRole.title = '';
      this.setState({ newRole });
    })
    .catch(error => handleError(error));
  }

  /**
   * Submits the edit role from
   * @param {object} event
   * @memberOf ManageRolesPage
   */
  onEditSubmit(event) {
    event.preventDefault();
    this.props.actions.updateRole(this.state.roleToEdit, this.state.editRole)
    .then(() => {
      $('#roleModal').modal('close');
      toastr.success('Role updated successfully');
    })
    .catch(error => handleError(error));
  }

  editButtonClick(role, title) {
    this.setState({ roleToEdit: role });
    this.setState({ editRole: { title } });
  }

  /**
   * Deletes a role after confirmation
   * @param {number} roleId
   * @memberOf ManageRolesPage
   */
  deleteRole(roleId) {
    swal({
      title: 'Are you sure?',
      text: 'This role will be permanently deleted!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel this!'
    })
    .then((isConfirm) => {
      if (isConfirm) {
        this.props.actions.deleteRole(roleId)
        .then(() => {
          swal('Deleted!', 'The role has been deleted.', 'success');
        });
      }
    })
    .catch((err) => {
      swal('Cancelled', 'The role is not deleted :)');
    });
  }

  /**
   * Place the retrieved roles on the component
   * @memberOf ManageRolesPage
   */
  placeRoles = (role) =>
      <TableRow key={role.id} className="animated zoomIn">
        <TableRowColumn>{role.id}</TableRowColumn>
        <TableRowColumn>{role.title}</TableRowColumn>
        <TableRowColumn>
          <a href="#roleModal" onClick={() => this
            .editButtonClick(role.id, role.title)}>
            <i className="material-icons">edit</i>
          </a>
          {role.id > 3
          && <a className="delete" onClick={() => this.deleteRole(role.id)}>
              <i className="material-icons">delete_forever</i>
            </a>}
        </TableRowColumn>
      </TableRow>;

  /**
   * Renders the roles page
   * @returns {object} jsx
   * @memberOf ManageRolesPage
   */
  render() {
    return (
      <div className="roles-page">
        <div className="row">
          <div className="col s12 m4 l3">
            <Sidebar />
          </div>
          <div className="col s12 m8 l9">
            <div className="row">
              <div className="headers">
                <h4> Roles </h4>
                <h4>Hi, SuperAdmin</h4>
              </div>
              <Card className="roles-card">
                <Table>
                  <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                    enableSelectAll={false}
                  >
                    <TableRow>
                      <TableHeaderColumn>ID</TableHeaderColumn>
                      <TableHeaderColumn>Title</TableHeaderColumn>
                      <TableHeaderColumn>Actions</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    displayRowCheckbox={false}
                    stripedRows={true}
                  >
                  {this.state.roles
                  && this.state.roles.map(this.placeRoles)}
                  </TableBody>
                </Table>
              </Card>
              <div className="container" id="new-role-form">
                <h4 className="center-align"> Add A New Role</h4>
                <form onSubmit={this.onSubmit}>
                  <TextInput
                    id="new-role"
                    name="role"
                    type="text"
                    fullWidth={true}
                    floatText="Role"
                    handleChange={this.handleChange}
                    value={this.state.newRole.title}
                  />
                  <div className="center-align">
                    <FlatButton
                      backgroundColor="#26a69a"
                      hoverColor="#8AA62F"
                      label="Add Role"
                      disabled={this.state.newRole.title.length === 0}
                      onClick={this.onSubmit}
                    />
                  </div>
                </form>
              </div>
              <div id="roleModal" className="modal">
                <div className="modal-content">
                  <h3 className="center">Edit Role</h3>
                  <form onSubmit={this.onEditSubmit}>
                    <TextInput
                      id="update-role"
                      name="edit-role"
                      type="text"
                      fullWidth={true}
                      floatText="Edit Role"
                      handleChange={this.handleEditChange}
                      value={this.state.editRole.title}
                    />
                    <FlatButton
                      backgroundColor="#26a69a"
                      hoverColor="#8AA62F"
                      label="Edit Role"
                      disabled={this.state.editRole.title.length === 0}
                      onClick={this.onEditSubmit}
                    />
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManageRolesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
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
    roles: state.roles,
    access: state.userAccess
  };
}

/**
 * Make roleActions available as props
 * @param {function} dispatch
 * @returns {object} actions
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(roleActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageRolesPage);
