import React, { Component } from 'react';
import { FaGithubAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Container from '../../Components/Container';

import { UsersList, ErrorMessage, Owner } from './styles';

export default class LatestSearches extends Component {
  state = {
    owner: {},
    users: [],
    loading: false,
    notFoundUser: false,
    visibleButtons: false,
    fillOutForm: false,
    messageErroForm: '',
  };

  componentDidMount() {
    // ASSIM QUE CARREGA
    const users = localStorage.getItem('users');
    if (users) {
      if (users.length > 0) {
        this.setState({ users: JSON.parse(users) });
        return;
      }
      this.setState({ users: [JSON.parse(users)] });
    }

    this.setState({
      messageErroForm: 'Você não tem buscado usuarios',
    });

    console.log(users);
  }

  render() {
    const { messageErroForm, users } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Ultimas 5 buscas
        </h1>
        <Link to="/">Voltar aos repositórios</Link>

        <ErrorMessage>
          <h2>{messageErroForm}</h2>
        </ErrorMessage>

        <UsersList>
          {users.map((user) => (
            <li key={String(user.login)}>
              <img src={user.avatar_url} alt={user.login} />
              <div>
                <strong>
                  <a href={user.html_url}>{user.login}</a>
                </strong>
                {/* <p>{user.description}</p> */}
              </div>
            </li>
          ))}
        </UsersList>
      </Container>
    );
  }
}
