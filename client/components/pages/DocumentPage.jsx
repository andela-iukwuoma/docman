import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import TinyMCE from 'react-tinymce';
import FlatButton from 'material-ui/FlatButton';
import SelectInput from '../forms/SelectInput.jsx';
import TextInput from '../forms/TextInput.jsx';
import Nav from '../layouts/Nav.jsx';
import Sidebar from '../layouts/Sidebar.jsx';
import * as documentActions from '../../actions/documentActions';

class DocumentPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      title: '',
      access: '',
      content: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  componentDidMount() {
    $('select').material_select();
    $('#select-box').on('change', this.handleChange);
  }

  handleChange(event) {
    console.log('Value', event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  handleEditorChange(event) {
    this.setState({ content: event.target.getContent() });
  }

  onSubmit() {
    console.log('State', this.state);
    this.props.actions.createDocument(this.state);
  }

  render() {
    return (
      <div>
        <Nav />
        <div className="row">
          <Sidebar />
          <div className="col s12 m8 l9">
            <div className="create-document container center-align">
              <h2>Create New Document</h2>
              <form onSubmit={this.onSubmit}>
                <div>
                  <TextInput
                    fullWidth
                    name="title"
                    type="text"
                    errorText=""
                    floatText="Title"
                    hint="Title of the document"
                    handleChange={this.handleChange}
                    value={this.state.title}
                  />
                </div>
                <div className="select-input">
                  <SelectInput
                    id="select-box"
                    name="access"
                    handleChange={this.handleChange}
                    value={this.state.access}
                  />
                </div>
                <div className="tiny-mce">
                  <TinyMCE
                    content={this.state.content}
                    config={{
                      plugins: 'link image code',
                      toolbar: 'undo redo | bold italic |\
                      alignleft aligncenter alignright | code'
                    }}
                    onChange={this.handleEditorChange}
                  />
                </div>
                <FlatButton
                  backgroundColor="#a4c639"
                  hoverColor="#8AA62F"
                  label="Create New Document"
                  onClick={this.onSubmit}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DocumentPage.propTypes = {
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    documents: state.documentData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(documentActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPage);