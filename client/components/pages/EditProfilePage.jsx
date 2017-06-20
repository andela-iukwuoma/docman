import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import SignupForm from '../forms/SignupForm.jsx';
import handleError from '../../utils/errorHandler';
import { signupValidator } from '../../utils/validator';
import { updateUser } from '../../actions/userActions';
import Sidebar from '../layouts/Sidebar.jsx';

class EditProfilePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.state = {
      confirmPassword: '',
      signupErrors: {},
      signupDetails: {
        name: '',
        email: '',
        username: '',
        password: ''
      },
    };
  }

  handleChange(event) {
    const signupDetails = this.state.signupDetails;
    signupDetails[event.target.name] = event.target.value.substr(0, 30);
    this.setState({ signupDetails });
  }

  handleConfirmPassword(event) {
    this.setState({ confirmPassword: event.target.value.substr(0, 30) });
  }

  onSubmit(event) {
    event.preventDefault();
    const { valid, errors } = signupValidator(this
    .state.signupDetails, this.state.confirmPassword);
    if (valid) {
      this.props.updateUser(this.props.user.id, this.state.signupDetails)
      .then(() => {
        this.context.router.push(`/users/${this.props.user.id}`);
        toastr.success('Profile updated successfully');
      })
      .catch(error => handleError(error));
    } else {
      this.setState({ signupErrors: errors });
    }
  }

  render() {
    return (
      <div className="edit-profile-page">
        <div className="row">
          <div className="col s12 m4 l3">
            <Sidebar />
          </div>
          <div className="col s12 m8 l9">
            <div className="forms">
              <h6> Update Profile </h6>
              <SignupForm
                onSubmit={this.onSubmit}
                handleChange={this.handleChange}
                signupErrors={this.state.signupErrors}
                signupDetails={this.state.signupDetails}
                confirmPassword={this.state.confirmPassword}
                handleConfirmPassword={this.handleConfirmPassword}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditProfilePage.propTypes = {
  user: PropTypes.object,
};

EditProfilePage.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, { updateUser })(EditProfilePage);
