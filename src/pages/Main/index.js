import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import {
  Form,
  SubmitButton,
  Owner,
  ButtonList,
  Button,
  RepositoryList,
} from './styles';

export default class Main extends Component {
  state = {
    searchUser: '',
    owner: {},
    repositories: [],
    loading: false,
    notFoundUser: false,
    visibleButtons: false,
  };

  componentDidMount() {
    // const repositories = localStorage.getItem('repositories');
    // if (repositories) {
    //   this.setState({ repositories: JSON.parse(repositories) });
    // }
  }

  componentDidUpdate(_, prevState) {
    // const { repositories } = this.state;
    // if (prevState.repositories !== repositories) {
    //   localStorage.setItem('repositories', JSON.stringify(repositories));
    // }
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
      repositories: repositories,
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

      this.setState({
        repositories: response.data,
        owner: response.data[0].owner,
        loading: false,
        visibleButtons: true,
      });

      this.order('descendingOrder');
    } catch (error) {
      this.setState({
        loading: false,
        notFoundUser: true,
      });
    }
  };

  render() {
    const {
      searchUser,
      owner,
      repositories,
      loading,
      notFoundUser,
      visibleButtons,
    } = this.state;

    return (
      <>
        <h1>
          <FaGithubAlt />
          Usuários
        </h1>

        <Form onSubmit={this.handleSubmit} notFoundUser={notFoundUser}>
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
                </strong>
                <p>{repository.description}</p>
              </div>
            </li>
          ))}
        </RepositoryList>
      </>
    );
  }
}
