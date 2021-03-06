import expect from 'expect';
import sinon from 'sinon';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { ViewDocumentPage } from
'../../../components/pages/ViewDocumentPage';

const getDocument = sinon.spy(() => Promise.resolve());
const deleteDocument = sinon.spy(() => Promise.resolve());
const spyDelete = sinon.spy(ViewDocumentPage.prototype, 'delete');

const props = {
  params: { id: 4 },
  document: { title: 'TIA', content: 'Andela', access: 'public', userId: 4 },
  access: { user: { id: 4 } },
  getDocument,
  deleteDocument
};


describe('ViewDocumentPage', () => {
  it('renders a div with class name of view-document', () => {
    const wrapper = shallow(<ViewDocumentPage {...props} />,
      { context: { router: { push: () => {} } } });
    expect(wrapper.find('.view-document').length).toBe(1);
  });

  it('calls deleteDocument when delete function runs', () => {
    const wrapper = shallow(<ViewDocumentPage {...props} />,
      { context: { router: { push: () => {} } } });
    wrapper.instance().delete();
    expect(spyDelete.callCount).toBe(1);
    expect(deleteDocument.callCount).toBe(1);
  });
});
