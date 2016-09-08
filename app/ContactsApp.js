import React , { Component, PropTypes } from 'react';
import { render } from 'react-dom';

class ContactsApp extends Component {
    constructor() {
        super();
        this.state={
          filterText: 'P'
        };
    }

    render() {
        return (
            <div>
                <SearchBar filterText={this.state.filterText} />
                <ContactList contacts={this.props.contacts}
                                filterText={this.state.filterText} />
            </div>
        )
    }
}
ContactsApp.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object)
}

class SearchBar extends Component {
    render() {
        return <input type="search" placeholder="search"
                        value={this.props.filterText} />
    }
}
SearchBar.propTypes = {
    filterText: PropTypes.string.isRequired
}

class ContactList extends Component {
    render() {
        let filteredContacts = this.props.contacts.filter(
            (contact) => contact.name.indexOf(this.props.filterText) !== -1
        );

        return (
            <ul>
                {filteredContacts.map(
                    (contact) => <ContactItem key={contact.email}
                                            name={contact.name}
                                            email={contact.email} />
                )}
            </ul>
        )
    }
}
ContactList.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object)
}

class ContactItem extends Component {
    render() {
        return <li>{this.props.name} - {this.props.email}</li>
    }
}
ContactItem.propTypes = {
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
}

let contacts = [
    { name: "Cassio Zen", email: "cassiozen@gmail.com" },
    { name: "Dan Abramov", email: "gaearon@somewhere.com" },
    { name: "Pete Hunt", email: "floydophone@somewhere.com" },
    { name: "Paul O'Shannessy", email: "zpao@somewhere.com" },
    { name: "Ryan Florence", email: "rpflorence@somewhere.com" },
    { name: "Sebastian Markbage", email: "sebmarkbage@here.com" }
]

render(<ContactsApp contacts={contacts} />, document.getElementById('root'));