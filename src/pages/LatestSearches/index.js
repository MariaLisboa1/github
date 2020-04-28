import React, { Component } from 'react';
import { FaGithubAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Container from '../../Components/Container';

import { UsersList, ErrorMessage } from './styles';

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
    let users = JSON.parse(localStorage.getItem('users'));

    if (users) {
      users = users.sort((a, b) =>
        a.repositoryCount > b.repositoryCount ? -1 : 1,
      );

      this.setState({ users: users });
      return;
    }

    this.setState({
      messageErroForm: 'Você não tem buscado usuarios',
    });
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
          {users.map((user, index) => (
            <li key={String(user.login)}>
              <img src={user.avatar_url} alt={user.login} />
              <div>
                <strong>
                  <a href={user.html_url}>
                    {user.login} {index + 1}º
                  </a>
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
