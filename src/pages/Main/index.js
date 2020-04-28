import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../Components/Container';

import {
  Form,
  SubmitButton,
  Owner,
  ButtonList,
  Button,
  RepositoryList,
  ErrorMessage,
  ButtonLink,
} from './styles';

export default class Main extends Component {
  state = {
    owner: {},
    repositories: [],
    users: [],
    loading: false,
    notFoundUser: false,
    visibleButtons: false,
    fillOutForm: false,
    messageErroForm: '',
  };

  componentDidMount() {
    const users = localStorage.getItem('users');
    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  order = (option) => {
    const optionOrder = {
      ascendingOrder: (a, b) => {
        return a.updated_at < b.updated_at ? -1 : 1;
      },
      descendingOrder: (a, b) => {
        return a.updated_at > b.updated_at ? -1 : 1;
      },
    };

    const startingOrder = optionOrder[option];
    const { repositories } = this.state;

    repositories.sort(startingOrder.bind(this));

    this.setState({
      repositories,
    });
  };

  handleInputChange = (e) => {
    this.setState({ searchUser: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      this.setState({ loading: true });

      const { searchUser } = this.state;
      const response = await api.get(`/users/${searchUser}/repos`);
      const owner = response.data[0].owner;
      owner.repositoryCount = response.data.length || 0;

      if (response) {
        this.setState({
          repositories: response.data,
          owner,
          loading: false,
          visibleButtons: true,
          notFoundUser: false,
          fillOutForm: false,
          messageErroForm: '',
        });

        this.order('descendingOrder');
        this.saveUserStorage();

        return;
      }
      this.sendMessageErro('Preencha um usuário');
    } catch (error) {
      this.sendMessageErro('Usuário não encontrado');
    }
  };

  sendMessageErro = (messageErroForm) => {
    this.setState({
      loading: false,
      notFoundUser: true,
      fillOutForm: true,
      messageErroForm,
    });
  };

  saveUserStorage = () => {
    const { owner, users } = this.state;

    const hasUser = users.find((user) => user.login === owner.login);
    if (hasUser) return;

    if (users.length === 5) users.shift();

    this.setState({
      users: [...users, owner],
    });

    const useStorage = this.state.users;

    localStorage.setItem('users', JSON.stringify(useStorage));
  };

  render() {
    const {
      searchUser,
      owner,
      repositories,
      loading,
      notFoundUser,
      visibleButtons,
      messageErroForm,
      fillOutForm,
    } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Usuários
        </h1>

        <Form
          onSubmit={this.handleSubmit}
          notFoundUser={notFoundUser || fillOutForm}
        >
          <input
            type="text"
            placeholder="Buscar usuário"
            value={searchUser}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <ButtonLink>
          <Link to="/latestSearches">Ir para os 5 mais buscados</Link>
        </ButtonLink>

        <ErrorMessage>
          {notFoundUser || fillOutForm ? <p>{messageErroForm}</p> : ''}
        </ErrorMessage>

        <Owner>
          <img src={owner.avatar_url} />
          <h1>{owner.login}</h1>
        </Owner>

        {visibleButtons ? (
          <ButtonList>
            <Button onClick={() => this.order('ascendingOrder')}>
              Ordem crescente
            </Button>
            <Button onClick={() => this.order('descendingOrder')}>
              Ordem decrescente
            </Button>
          </ButtonList>
        ) : (
          ''
        )}

        <RepositoryList>
          {repositories.map((repository) => (
            <li key={String(repository.name)}>
              <div>
                <strong>
                  <a href={repository.html_url}>{repository.name}</a>
                  <Link
                    to={`/repository/${encodeURIComponent(
                      `${owner.login + '/' + repository.name}`,
                    )}`}
                  >
                    Detalhes
                  </Link>
                </strong>
                <p>{repository.description}</p>
              </div>
            </li>
          ))}
        </RepositoryList>
      </Container>
    );
  }
}
